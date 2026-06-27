import { getUserProfile, followUser, unfollowUser, getFollowers, getFollowing } from '@/services/user.service'

const mockFetch = jest.fn()
global.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockReset()
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      id: 'user-1',
      username: 'seoyeon',
      avatar: null,
      bio: '기록하는 사람',
      followerCount: 100,
      followingCount: 50,
      postCount: 10,
      isFollowedByMe: false,
    }),
  })
})

describe('getUserProfile', () => {
  it('GET /users/:username 을 호출한다', async () => {
    await getUserProfile('seoyeon')

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toContain('/users/seoyeon')
    expect(options?.method).toBeUndefined() // GET은 method 명시 없음
  })

  it('token이 있으면 Authorization 헤더를 포함한다', async () => {
    await getUserProfile('seoyeon', 'token-abc')

    const [, options] = mockFetch.mock.calls[0]
    expect(options.headers['Authorization']).toBe('Bearer token-abc')
  })

  it('token이 없으면 Authorization 헤더를 포함하지 않는다', async () => {
    await getUserProfile('seoyeon')

    const [, options] = mockFetch.mock.calls[0]
    expect(options.headers['Authorization']).toBeUndefined()
  })
})

describe('followUser', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ followingId: 'user-1' }),
    })
  })

  it('POST /follow/:userId 를 호출한다', async () => {
    await followUser('user-1', 'token-abc')

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toContain('/follow/user-1')
    expect(options.method).toBe('POST')
  })

  it('Authorization 헤더에 Bearer 토큰을 포함한다', async () => {
    await followUser('user-1', 'token-abc')

    const [, options] = mockFetch.mock.calls[0]
    expect(options.headers['Authorization']).toBe('Bearer token-abc')
  })
})

describe('unfollowUser', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ followingId: 'user-1' }),
    })
  })

  it('DELETE /follow/:userId 를 호출한다', async () => {
    await unfollowUser('user-1', 'token-abc')

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toContain('/follow/user-1')
    expect(options.method).toBe('DELETE')
  })

  it('Authorization 헤더에 Bearer 토큰을 포함한다', async () => {
    await unfollowUser('user-1', 'token-abc')

    const [, options] = mockFetch.mock.calls[0]
    expect(options.headers['Authorization']).toBe('Bearer token-abc')
  })
})

describe('getFollowers', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 'user-2', username: 'jiwon', avatar: null, bio: null, isFollowedByMe: false },
      ],
    })
  })

  it('GET /follow/:username/followers 를 호출한다', async () => {
    await getFollowers('seoyeon')

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toContain('/follow/seoyeon/followers')
    expect(options?.method).toBeUndefined()
  })

  it('token이 있으면 Authorization 헤더를 포함한다', async () => {
    await getFollowers('seoyeon', 'token-abc')

    const [, options] = mockFetch.mock.calls[0]
    expect(options.headers['Authorization']).toBe('Bearer token-abc')
  })

  it('token이 없으면 Authorization 헤더를 포함하지 않는다', async () => {
    await getFollowers('seoyeon')

    const [, options] = mockFetch.mock.calls[0]
    expect(options.headers['Authorization']).toBeUndefined()
  })
})

describe('getFollowing', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 'user-3', username: 'minho', avatar: null, bio: null, isFollowedByMe: true },
      ],
    })
  })

  it('GET /follow/:username/following 를 호출한다', async () => {
    await getFollowing('seoyeon')

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toContain('/follow/seoyeon/following')
    expect(options?.method).toBeUndefined()
  })

  it('token이 있으면 Authorization 헤더를 포함한다', async () => {
    await getFollowing('seoyeon', 'token-abc')

    const [, options] = mockFetch.mock.calls[0]
    expect(options.headers['Authorization']).toBe('Bearer token-abc')
  })

  it('token이 없으면 Authorization 헤더를 포함하지 않는다', async () => {
    await getFollowing('seoyeon')

    const [, options] = mockFetch.mock.calls[0]
    expect(options.headers['Authorization']).toBeUndefined()
  })
})
