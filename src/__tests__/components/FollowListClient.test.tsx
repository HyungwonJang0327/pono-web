import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FollowListClient from '@/app/(main)/[username]/FollowListClient'
import type { FollowUserDto } from '@/types/user'

const mockPush = jest.fn()
const mockReplace = jest.fn()

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) => {
    if (params) return `${key}:${JSON.stringify(params)}`
    return key
  },
}))

jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({ getToken: jest.fn().mockResolvedValue('token') }),
  useUser: () => ({ user: { username: 'me' } }),
  SignInButton: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}))

jest.mock('@/components/ui', () => ({
  useToastContext: () => ({ error: jest.fn() }),
}))

jest.mock('@/services/user.service', () => ({
  followUser: jest.fn().mockResolvedValue(undefined),
  unfollowUser: jest.fn().mockResolvedValue(undefined),
}))

const mockList: FollowUserDto[] = [
  {
    id: 'u1',
    username: 'alice',
    avatar: null,
    bio: '안녕',
    isFollowedByMe: false,
    followerCount: 120,
    recentActivity: null,
  },
  {
    id: 'u2',
    username: 'bob',
    avatar: null,
    bio: null,
    isFollowedByMe: true,
    followerCount: 5000,
    recentActivity: { type: 'article', daysAgo: 3 },
  },
  {
    id: 'u3',
    username: 'me',
    avatar: null,
    bio: null,
    isFollowedByMe: false,
    followerCount: 0,
    recentActivity: null,
  },
]

describe('FollowListClient', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockReplace.mockClear()
  })

  it('유저 목록을 렌더링한다', () => {
    render(<FollowListClient list={mockList} activeTab="followers" username="profileowner" />)
    expect(screen.getByText('alice')).toBeInTheDocument()
    expect(screen.getByText('bob')).toBeInTheDocument()
  })

  it('isFollowedByMe가 false인 유저에게 "follow.follow" 버튼을 표시한다', () => {
    render(<FollowListClient list={mockList} activeTab="followers" username="profileowner" />)
    expect(screen.getByRole('button', { name: 'follow.follow' })).toBeInTheDocument()
  })

  it('isFollowedByMe가 true인 유저에게 "follow.following" 버튼을 표시한다', () => {
    render(<FollowListClient list={mockList} activeTab="followers" username="profileowner" />)
    // 탭 "follow.following" + 팔로우 상태 "follow.following" 두 개 존재
    expect(screen.getAllByRole('button', { name: 'follow.following' })).toHaveLength(2)
  })

  it('현재 로그인 유저 본인은 팔로우 버튼을 숨긴다', () => {
    render(<FollowListClient list={mockList} activeTab="followers" username="profileowner" />)
    expect(screen.getByText('me')).toBeInTheDocument()
    const buttons = screen.getAllByRole('button')
    // 탭 버튼 2개 + alice follow.follow + bob follow.following = 4개. me 버튼 없음.
    expect(buttons).toHaveLength(4)
  })

  it('bio가 있으면 서브텍스트로 표시한다', () => {
    render(<FollowListClient list={mockList} activeTab="followers" username="profileowner" />)
    expect(screen.getByText('안녕')).toBeInTheDocument()
  })

  it('bio 없고 recentActivity 있으면 follow.recentArticle 키로 표시한다', () => {
    render(<FollowListClient list={mockList} activeTab="followers" username="profileowner" />)
    expect(screen.getByText('follow.recentArticle:{"days":3}')).toBeInTheDocument()
  })

  it('bio 없고 recentActivity도 없으면 "@username"을 표시한다', () => {
    // me 유저: bio null, recentActivity null
    render(<FollowListClient list={mockList} activeTab="followers" username="profileowner" />)
    expect(screen.getByText('@me')).toBeInTheDocument()
  })

  it('followerCount를 follow.followerCount 키로 표시한다', () => {
    render(<FollowListClient list={mockList} activeTab="followers" username="profileowner" />)
    // bob: 5000 → follow.followerCount:{"count":"5,000"}
    expect(screen.getByText('follow.followerCount:{"count":"5,000"}')).toBeInTheDocument()
    // alice: 120 → follow.followerCount:{"count":"120"}
    expect(screen.getByText('follow.followerCount:{"count":"120"}')).toBeInTheDocument()
  })

  it('"follow.followers" 탭이 activeTab=followers일 때 활성 상태다', () => {
    render(<FollowListClient list={mockList} activeTab="followers" username="profileowner" />)
    const followersTab = screen.getByRole('button', { name: 'follow.followers' })
    expect(followersTab).toBeInTheDocument()
  })

  it('"follow.following" 탭 클릭 시 /profileowner/following으로 이동한다', async () => {
    const user = userEvent.setup()
    render(<FollowListClient list={mockList} activeTab="followers" username="profileowner" />)
    // 첫 번째가 탭 버튼
    const followingTab = screen.getAllByRole('button', { name: 'follow.following' })[0]
    await user.click(followingTab)
    expect(mockReplace).toHaveBeenCalledWith('/profileowner/following')
  })

  it('"follow.followers" 탭 클릭 시 /profileowner/followers로 이동한다', async () => {
    const user = userEvent.setup()
    render(<FollowListClient list={mockList} activeTab="following" username="profileowner" />)
    const followersTab = screen.getByRole('button', { name: 'follow.followers' })
    await user.click(followersTab)
    expect(mockReplace).toHaveBeenCalledWith('/profileowner/followers')
  })

  it('목록이 비어있으면 follow.empty 메시지를 표시한다', () => {
    render(<FollowListClient list={[]} activeTab="followers" username="profileowner" />)
    expect(screen.getByText('follow.empty')).toBeInTheDocument()
  })
})
