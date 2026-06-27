import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FollowListClient from '@/app/(main)/[username]/FollowListClient'
import type { FollowUserDto } from '@/types/user'

const mockPush = jest.fn()

jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({ getToken: jest.fn().mockResolvedValue('token') }),
  useUser: () => ({ user: { username: 'me' } }),
  SignInButton: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
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
  })

  it('유저 목록을 렌더링한다', () => {
    render(<FollowListClient list={mockList} activeTab="followers" username="profileowner" />)
    expect(screen.getByText('alice')).toBeInTheDocument()
    expect(screen.getByText('bob')).toBeInTheDocument()
  })

  it('isFollowedByMe가 false인 유저에게 "팔로우" 버튼을 표시한다', () => {
    render(<FollowListClient list={mockList} activeTab="followers" username="profileowner" />)
    expect(screen.getByRole('button', { name: '팔로우' })).toBeInTheDocument()
  })

  it('isFollowedByMe가 true인 유저에게 "팔로잉" 버튼을 표시한다', () => {
    render(<FollowListClient list={mockList} activeTab="followers" username="profileowner" />)
    // 탭 "팔로잉" + 팔로우 상태 "팔로잉" 두 개 존재
    expect(screen.getAllByRole('button', { name: '팔로잉' })).toHaveLength(2)
  })

  it('현재 로그인 유저 본인은 팔로우 버튼을 숨긴다', () => {
    render(<FollowListClient list={mockList} activeTab="followers" username="profileowner" />)
    expect(screen.getByText('me')).toBeInTheDocument()
    const buttons = screen.getAllByRole('button')
    // 탭 버튼 2개 + alice 팔로우 + bob 팔로잉 = 4개. me 버튼 없음.
    expect(buttons).toHaveLength(4)
  })

  it('bio가 있으면 서브텍스트로 표시한다', () => {
    render(<FollowListClient list={mockList} activeTab="followers" username="profileowner" />)
    expect(screen.getByText('안녕')).toBeInTheDocument()
  })

  it('bio 없고 recentActivity 있으면 "N일 전 아티클 발행"을 표시한다', () => {
    render(<FollowListClient list={mockList} activeTab="followers" username="profileowner" />)
    expect(screen.getByText('3일 전 아티클 발행')).toBeInTheDocument()
  })

  it('bio 없고 recentActivity도 없으면 "@username"을 표시한다', () => {
    // me 유저: bio null, recentActivity null
    render(<FollowListClient list={mockList} activeTab="followers" username="profileowner" />)
    expect(screen.getByText('@me')).toBeInTheDocument()
  })

  it('followerCount를 "팔로워 N,NNN" 형식으로 표시한다', () => {
    render(<FollowListClient list={mockList} activeTab="followers" username="profileowner" />)
    // bob: 5000 → "팔로워 5,000"
    expect(screen.getByText('팔로워 5,000')).toBeInTheDocument()
    // alice: 120 → "팔로워 120"
    expect(screen.getByText('팔로워 120')).toBeInTheDocument()
  })

  it('"팔로워" 탭이 activeTab=followers일 때 활성 상태다', () => {
    render(<FollowListClient list={mockList} activeTab="followers" username="profileowner" />)
    const followersTab = screen.getByRole('button', { name: '팔로워' })
    expect(followersTab).toBeInTheDocument()
  })

  it('"팔로잉" 탭 클릭 시 /profileowner/following으로 이동한다', async () => {
    const user = userEvent.setup()
    render(<FollowListClient list={mockList} activeTab="followers" username="profileowner" />)
    // 첫 번째가 탭 버튼
    const followingTab = screen.getAllByRole('button', { name: '팔로잉' })[0]
    await user.click(followingTab)
    expect(mockPush).toHaveBeenCalledWith('/profileowner/following')
  })

  it('"팔로워" 탭 클릭 시 /profileowner/followers로 이동한다', async () => {
    const user = userEvent.setup()
    render(<FollowListClient list={mockList} activeTab="following" username="profileowner" />)
    const followersTab = screen.getByRole('button', { name: '팔로워' })
    await user.click(followersTab)
    expect(mockPush).toHaveBeenCalledWith('/profileowner/followers')
  })

  it('목록이 비어있으면 빈 상태 메시지를 표시한다', () => {
    render(<FollowListClient list={[]} activeTab="followers" username="profileowner" />)
    expect(screen.getByText('아직 없어요')).toBeInTheDocument()
  })
})
