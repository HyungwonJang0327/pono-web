import { render, screen } from '@testing-library/react'
import SnapMiniCard from '@/components/feed/SnapMiniCard'
import type { SnapFeedItemDto } from '@/types/post'

jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({ isSignedIn: false, getToken: jest.fn() }),
  useClerk: () => ({ openSignIn: jest.fn() }),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  usePathname: () => '/',
}))

jest.mock('@/hooks/useToast', () => ({
  useToast: () => ({ success: jest.fn(), error: jest.fn(), info: jest.fn() }),
}))

jest.mock('@/services/post.service', () => ({
  addLike: jest.fn(),
  removeLike: jest.fn(),
}))

const basePost: SnapFeedItemDto = {
  id: 's1',
  type: 'snap',
  createdAt: '2026-01-01T00:00:00Z',
  author: { id: 'u1', username: 'snapper', avatar: null },
  images: [{ url: 'https://example.com/img.jpg', width: 100, height: 100 }],
  caption: '스냅 캡션입니다.',
  likeCount: 3,
  likedByMe: false,
}

describe('SnapMiniCard', () => {
  it('이미지가 상세 페이지(/{username}/{id})로 가는 링크로 렌더된다', () => {
    render(<SnapMiniCard post={basePost} aspectRatio="1/1" />)
    const img = screen.getByRole('img', { name: /스냅 캡션입니다/ })
    expect(img.closest('a')).toHaveAttribute('href', '/snapper/s1')
  })

  it('캡션도 상세 링크 안에 있다', () => {
    render(<SnapMiniCard post={basePost} aspectRatio="1/1" />)
    const link = screen.getByText('스냅 캡션입니다.').closest('a')
    expect(link).toHaveAttribute('href', '/snapper/s1')
  })

  it('username이 null이면 상세 링크를 걸지 않는다', () => {
    const post = { ...basePost, author: { ...basePost.author, username: null } }
    render(<SnapMiniCard post={post} aspectRatio="1/1" />)
    expect(screen.getByText('스냅 캡션입니다.').closest('a')).toBeNull()
  })
})
