import { render, screen } from '@testing-library/react'
import ArticleCard from '@/components/feed/ArticleCard'
import type { ArticleFeedItemDto } from '@/types/post'

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

const basePost: ArticleFeedItemDto = {
  id: 'a1',
  type: 'article',
  createdAt: '2026-01-01T00:00:00Z',
  author: { id: 'u1', username: 'tester', avatar: null },
  title: '테스트 아티클 제목',
  excerpt: '요약 텍스트입니다.',
  coverImage: null,
  readingTime: 5,
  likeCount: 10,
  likedByMe: false,
}

describe('ArticleCard', () => {
  it('coverImage가 있을 때 이미지를 렌더링한다', () => {
    const post = { ...basePost, coverImage: 'https://example.com/cover.jpg' }
    render(<ArticleCard post={post} />)
    const img = screen.getByRole('img', { name: /테스트 아티클 제목/ })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/cover.jpg')
  })

  it('coverImage가 null일 때 img 태그를 렌더링하지 않는다 (회색 박스 버그 방지)', () => {
    render(<ArticleCard post={basePost} />)
    // 아바타용 img가 없으므로(avatar도 null) img 태그 자체가 없어야 함
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('제목을 표시한다', () => {
    render(<ArticleCard post={basePost} />)
    expect(screen.getByText('테스트 아티클 제목')).toBeInTheDocument()
  })

  it('excerpt를 표시한다', () => {
    render(<ArticleCard post={basePost} />)
    expect(screen.getByText('요약 텍스트입니다.')).toBeInTheDocument()
  })

  it('작성자명을 표시한다', () => {
    render(<ArticleCard post={basePost} />)
    expect(screen.getByText('tester')).toBeInTheDocument()
  })

  it('읽기시간을 표시한다', () => {
    render(<ArticleCard post={basePost} />)
    expect(screen.getByText('profile.readingTime:{"minutes":5}')).toBeInTheDocument()
  })
})
