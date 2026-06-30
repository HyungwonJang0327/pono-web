import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HomePage from '@/app/(main)/page'
import { fetchFeed } from '@/services/feed.service'
import { ApiError } from '@/lib/api'
import type { FeedItemDto } from '@/types/post'

jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({ isSignedIn: true, getToken: jest.fn().mockResolvedValue('token') }),
}))

jest.mock('@/hooks/useToast', () => ({
  useToast: () => mockToast,
}))

jest.mock('@/services/feed.service', () => ({
  fetchFeed: jest.fn(),
}))

// onLoadMore를 캡처해 버튼으로 노출 → 테스트에서 클릭으로 추가 로드 트리거
jest.mock('@/hooks/useInfiniteScroll', () => ({
  useInfiniteScroll: ({ onLoadMore }: { onLoadMore: () => void }) => {
    lastOnLoadMore = onLoadMore
    return { sentinelRef: jest.fn() }
  },
}))

// FeedRenderer는 아이템 id만 노출하도록 단순화 (누적 검증 목적)
jest.mock('@/components/feed/FeedRenderer', () => ({
  __esModule: true,
  default: ({ items }: { items: FeedItemDto[] }) => (
    <div data-testid="feed-renderer">{items.map((it) => it.id).join(',')}</div>
  ),
}))

// next-intl 의존 빈/에러 상태 컴포넌트는 스텁으로 대체 (페이징 로직과 무관)
jest.mock('@/components/feed/FeedErrorState', () => ({
  FeedErrorState: ({ onRetry }: { onRetry: () => void }) => (
    <button onClick={onRetry}>feed-error-retry</button>
  ),
}))
jest.mock('@/components/feed/FeedEmptyState', () => ({ FeedEmptyState: () => <div>feed-empty</div> }))
jest.mock('@/components/feed/FeedNoFollowing', () => ({ FeedNoFollowing: () => <div>feed-no-following</div> }))
jest.mock('@/components/feed/FeedLoginRequired', () => ({ FeedLoginRequired: () => <div>feed-login</div> }))

const mockToast = { success: jest.fn(), error: jest.fn(), info: jest.fn() }
let lastOnLoadMore: () => void = () => {}

const mockFetchFeed = fetchFeed as jest.Mock

function snap(id: string): FeedItemDto {
  return {
    id,
    type: 'snap',
    createdAt: '2026-01-01T00:00:00Z',
    author: { id: 'u1', username: 'alice', avatar: null },
    images: [{ url: 'https://x/i.jpg', width: 400, height: 400 }],
    caption: null,
    likeCount: 0,
    likedByMe: false,
  }
}

beforeEach(() => {
  mockFetchFeed.mockReset()
  mockToast.error.mockReset()
  lastOnLoadMore = () => {}
})

describe('홈 피드 무한 스크롤', () => {
  it('첫 로드 후 추가 페이지를 cursor로 이어 받아 items에 append한다', async () => {
    mockFetchFeed
      .mockResolvedValueOnce({ items: [snap('a'), snap('b')], nextCursor: 'cur1', hasMore: true })
      .mockResolvedValueOnce({ items: [snap('c'), snap('d')], nextCursor: null, hasMore: false })

    render(<HomePage />)

    await waitFor(() =>
      expect(screen.getByTestId('feed-renderer')).toHaveTextContent('a,b'),
    )

    await act(async () => {
      lastOnLoadMore()
    })

    await waitFor(() =>
      expect(screen.getByTestId('feed-renderer')).toHaveTextContent('a,b,c,d'),
    )
    // 두 번째 호출은 첫 응답의 cursor로 이어 받는다
    expect(mockFetchFeed).toHaveBeenLastCalledWith(
      expect.objectContaining({ cursor: 'cur1' }),
    )
  })

  it('hasMore=false면 추가 로드를 호출하지 않는다', async () => {
    mockFetchFeed.mockResolvedValueOnce({ items: [snap('a')], nextCursor: null, hasMore: false })

    render(<HomePage />)
    await waitFor(() =>
      expect(screen.getByTestId('feed-renderer')).toHaveTextContent('a'),
    )

    await act(async () => {
      lastOnLoadMore()
    })

    // 첫 로드 1회만
    expect(mockFetchFeed).toHaveBeenCalledTimes(1)
  })

  it('추가 로드 실패 시 전체 피드를 유지하고 인라인 재시도를 노출한다', async () => {
    mockFetchFeed
      .mockResolvedValueOnce({ items: [snap('a')], nextCursor: 'cur1', hasMore: true })
      .mockRejectedValueOnce(new ApiError({ status: 0, isNetworkError: true }))

    render(<HomePage />)
    await waitFor(() =>
      expect(screen.getByTestId('feed-renderer')).toHaveTextContent('a'),
    )

    await act(async () => {
      lastOnLoadMore()
    })

    // 피드는 유지된다
    expect(screen.getByTestId('feed-renderer')).toHaveTextContent('a')
    // 인라인 재시도 버튼 노출
    const retryBtn = await screen.findByRole('button', { name: 'error.retry' })
    expect(retryBtn).toBeInTheDocument()

    // 재시도 성공 시 append
    mockFetchFeed.mockResolvedValueOnce({ items: [snap('b')], nextCursor: null, hasMore: false })
    await userEvent.click(retryBtn)
    await waitFor(() =>
      expect(screen.getByTestId('feed-renderer')).toHaveTextContent('a,b'),
    )
  })
})
