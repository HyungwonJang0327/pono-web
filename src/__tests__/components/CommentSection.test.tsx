import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CommentSection from '@/components/post/CommentSection'
import { getComments } from '@/services/comment.service'
import { ApiError } from '@/lib/api'

jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({ isSignedIn: false, getToken: jest.fn().mockResolvedValue(null) }),
  useClerk: () => ({ openSignIn: jest.fn() }),
}))

jest.mock('@/hooks/useToast', () => ({
  useToast: () => ({ success: jest.fn(), error: jest.fn(), info: jest.fn() }),
}))

jest.mock('@/services/comment.service', () => ({
  getComments: jest.fn(),
  createComment: jest.fn(),
  deleteComment: jest.fn(),
}))

const mockGetComments = getComments as jest.Mock

beforeEach(() => {
  mockGetComments.mockReset()
})

describe('CommentSection 로드 실패 처리', () => {
  it('로드 실패 시 에러 메시지와 재시도 버튼을 노출한다', async () => {
    mockGetComments.mockRejectedValue(new ApiError({ status: 0, isNetworkError: true }))

    render(<CommentSection postId="p1" currentUser={null} />)

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'error.retry' })).toBeInTheDocument(),
    )
  })

  it('재시도 버튼 클릭 시 getComments를 다시 호출하고 성공하면 목록을 보여준다', async () => {
    mockGetComments
      .mockRejectedValueOnce(new ApiError({ status: 0, isNetworkError: true }))
      .mockResolvedValueOnce({
        items: [
          {
            id: 'c1',
            author: { id: 'u1', username: 'alice', avatar: null },
            body: '첫 댓글',
            parentId: null,
            replies: [],
            isOwnedByMe: false,
            createdAt: '2026-01-01T00:00:00Z',
            updatedAt: '2026-01-01T00:00:00Z',
          },
        ],
        nextCursor: null,
        hasMore: false,
      })

    render(<CommentSection postId="p1" currentUser={null} />)

    const retryBtn = await screen.findByRole('button', { name: 'error.retry' })
    await userEvent.click(retryBtn)

    await waitFor(() => expect(screen.getByText('첫 댓글')).toBeInTheDocument())
    expect(mockGetComments).toHaveBeenCalledTimes(2)
  })

  it('로드 중에는 스켈레톤(status=loading)을 보여준다', async () => {
    let resolve!: (v: unknown) => void
    mockGetComments.mockReturnValue(new Promise((r) => { resolve = r }))

    render(<CommentSection postId="p1" currentUser={null} />)

    expect(screen.getByTestId('comment-loading')).toBeInTheDocument()

    resolve({ items: [], nextCursor: null, hasMore: false })
    await waitFor(() =>
      expect(screen.queryByTestId('comment-loading')).not.toBeInTheDocument(),
    )
  })
})
