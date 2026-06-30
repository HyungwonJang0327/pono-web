import { api, ApiError } from '@/lib/api'

const mockFetch = jest.fn()
global.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
})

describe('ApiError', () => {
  it('Error를 상속하고 status/code/serverMessage/isNetworkError/details 필드를 가진다', () => {
    const err = new ApiError({
      status: 404,
      code: 'POST_NOT_FOUND',
      serverMessage: 'Post not found',
      details: ['x'],
    })
    expect(err).toBeInstanceOf(Error)
    expect(err).toBeInstanceOf(ApiError)
    expect(err.status).toBe(404)
    expect(err.code).toBe('POST_NOT_FOUND')
    expect(err.serverMessage).toBe('Post not found')
    expect(err.isNetworkError).toBe(false)
    expect(err.details).toEqual(['x'])
  })
})

describe('api request - 네트워크 실패', () => {
  it('fetch가 reject되면 isNetworkError=true인 ApiError를 던진다', async () => {
    mockFetch.mockRejectedValue(new TypeError('Failed to fetch'))
    await expect(api.get('/feed')).rejects.toBeInstanceOf(ApiError)

    mockFetch.mockRejectedValue(new TypeError('Failed to fetch'))
    await expect(api.get('/feed')).rejects.toMatchObject({
      isNetworkError: true,
      status: 0,
    })
  })
})

describe('api request - 4xx/5xx 본문 파싱', () => {
  it('표준 에러 본문의 code와 serverMessage를 보존한다', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({
        statusCode: 404,
        code: 'POST_NOT_FOUND',
        message: 'Post not found',
        error: 'Not Found',
        details: ['detail-1'],
      }),
    })

    await expect(api.get('/posts/x')).rejects.toMatchObject({
      status: 404,
      code: 'POST_NOT_FOUND',
      serverMessage: 'Post not found',
      details: ['detail-1'],
      isNetworkError: false,
    })
  })

  it('JSON이 아닌 본문이어도 status를 보존하고 던진다 (파싱 실패 안전)', async () => {
    const nonJson = {
      ok: false,
      status: 500,
      json: async () => {
        throw new SyntaxError('Unexpected token < in JSON')
      },
    }
    mockFetch.mockResolvedValue(nonJson)
    await expect(api.get('/posts/x')).rejects.toBeInstanceOf(ApiError)

    mockFetch.mockResolvedValue(nonJson)
    await expect(api.get('/posts/x')).rejects.toMatchObject({
      status: 500,
      code: undefined,
      isNetworkError: false,
    })
  })
})

describe('api request - 성공', () => {
  it('2xx 응답 본문을 JSON으로 반환한다', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 'p1' }),
    })

    await expect(api.get<{ id: string }>('/posts/p1')).resolves.toEqual({ id: 'p1' })
  })
})
