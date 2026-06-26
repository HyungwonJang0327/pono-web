import { addLike, removeLike } from '@/services/post.service'

const mockFetch = jest.fn()
global.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({ postId: 'p1', likeCount: 1 }),
  })
})

describe('addLike', () => {
  it('POST /likes/:postId 를 호출한다', async () => {
    await addLike('p1', 'token-abc')

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toContain('/likes/p1')
    expect(options.method).toBe('POST')
  })

  it('Authorization 헤더에 Bearer 토큰을 포함한다', async () => {
    await addLike('p1', 'token-abc')

    const [, options] = mockFetch.mock.calls[0]
    expect(options.headers['Authorization']).toBe('Bearer token-abc')
  })
})

describe('removeLike', () => {
  it('DELETE /likes/:postId 를 호출한다', async () => {
    await removeLike('p1', 'token-abc')

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toContain('/likes/p1')
    expect(options.method).toBe('DELETE')
  })

  it('Authorization 헤더에 Bearer 토큰을 포함한다', async () => {
    await removeLike('p1', 'token-abc')

    const [, options] = mockFetch.mock.calls[0]
    expect(options.headers['Authorization']).toBe('Bearer token-abc')
  })
})
