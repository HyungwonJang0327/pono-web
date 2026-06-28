import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProfileClient from '@/app/(main)/[username]/ProfileClient'
import type { UserPublicProfileDto } from '@/types/user'
import type { PostSummaryDto } from '@/types/post'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) => {
    if (params) return `${key}:${JSON.stringify(params)}`
    return key
  },
}))

jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({ getToken: jest.fn().mockResolvedValue('token') }),
  useUser: () => ({ user: { username: 'testuser' } }),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}))

jest.mock('@/components/ui', () => ({
  useToastContext: () => ({ success: jest.fn(), error: jest.fn(), info: jest.fn() }),
}))

jest.mock('@/services/user.service', () => ({
  followUser: jest.fn().mockResolvedValue(undefined),
  unfollowUser: jest.fn().mockResolvedValue(undefined),
}))

const mockProfile: UserPublicProfileDto = {
  id: 'user-1',
  username: 'seoyeon',
  avatar: null,
  bio: '기록하는 사람',
  followerCount: 100,
  followingCount: 50,
  postCount: 10,
  isFollowedByMe: false,
  isOwnedByMe: false,
}

const snapPost: PostSummaryDto = {
  id: 'snap-1',
  type: 'snap',
  images: [{ url: 'https://example.com/img.jpg', width: 400, height: 400 }],
  caption: null,
  likeCount: 5,
  createdAt: '2026-01-01T00:00:00Z',
}

const articlePost: PostSummaryDto = {
  id: 'article-1',
  type: 'article',
  title: '테스트 아티클',
  excerpt: '요약입니다',
  coverImage: null,
  readingTime: 3,
  isDraft: false,
  likeCount: 2,
  createdAt: '2026-01-01T00:00:00Z',
}

function renderProfileClient(overrides: Partial<{
  profile: UserPublicProfileDto
  snapPosts: PostSummaryDto[]
  articlePosts: PostSummaryDto[]
  isOwnedByMe: boolean
}> = {}) {
  return render(
    <ProfileClient
      profile={overrides.profile ?? mockProfile}
      snapPosts={overrides.snapPosts ?? []}
      articlePosts={overrides.articlePosts ?? []}
      isOwnedByMe={overrides.isOwnedByMe ?? false}
    />,
  )
}

describe('ProfileClient', () => {
  it('타인 프로필: "profile.follow" 번역 키 버튼을 노출한다', () => {
    renderProfileClient({ isOwnedByMe: false })
    expect(screen.getByRole('button', { name: 'follow.follow' })).toBeInTheDocument()
  })

  it('본인 프로필(isOwnedByMe=true): "profile.editProfile" 번역 키 버튼을 노출한다', () => {
    renderProfileClient({ isOwnedByMe: true })
    expect(screen.getByRole('button', { name: /profile.editProfile/ })).toBeInTheDocument()
  })

  it('팔로잉 상태(isFollowedByMe=true): "follow.following" 번역 키 버튼을 노출한다', () => {
    renderProfileClient({
      profile: { ...mockProfile, isFollowedByMe: true },
      isOwnedByMe: false,
    })
    expect(screen.getByRole('button', { name: 'follow.following' })).toBeInTheDocument()
  })

  it('스냅 탭: 스냅 그리드를 렌더링한다', () => {
    const { container } = renderProfileClient({ snapPosts: [snapPost] })
    // alt=""인 이미지는 role="presentation" → querySelector로 확인
    const img = container.querySelector('img[src="https://example.com/img.jpg"]')
    expect(img).toBeInTheDocument()
  })

  it('아티클 탭: 아티클 리스트를 렌더링한다', async () => {
    renderProfileClient({ articlePosts: [articlePost] })
    await userEvent.click(screen.getByRole('button', { name: 'profile.article' }))
    expect(screen.getByText('테스트 아티클')).toBeInTheDocument()
  })

  it('게시글 없음: "profile.noPost" 번역 키를 노출한다', () => {
    renderProfileClient({ snapPosts: [], articlePosts: [] })
    // 스냅·아티클 탭 모두 EmptyState를 렌더링하므로 복수로 확인
    const messages = screen.getAllByText('profile.noPost')
    expect(messages.length).toBeGreaterThan(0)
  })
})
