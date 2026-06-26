import { getUserPosts } from '@/services/post.service'

const mockFetch = jest.fn()
global.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({ items: [], nextCursor: null, hasMore: false }),
  })
})

describe('getUserPosts', () => {
  it('GET /users/:username/posts?type=snap&limit=30 을 호출한다', async () => {
    await getUserPosts('seoyeon', 'snap')

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [url] = mockFetch.mock.calls[0]
    expect(url).toContain('/users/seoyeon/posts')
    expect(url).toContain('type=snap')
    expect(url).toContain('limit=30')
  })

  it('cursor가 있을 때 encodeURIComponent 처리 후 쿼리스트링에 포함한다', async () => {
    const cursor = '2026-01-01T00:00:00.000Z_post-1'
    await getUserPosts('seoyeon', 'snap', undefined, cursor)

    const [url] = mockFetch.mock.calls[0]
    // params.set(key, encodeURIComponent(cursor)) → URLSearchParams.toString()이 한 번 더 인코딩
    // → URL에는 이중 인코딩된 값이 포함됨
    expect(url).toContain('cursor=')
    expect(url).toContain(encodeURIComponent(encodeURIComponent(cursor)))
  })
})
