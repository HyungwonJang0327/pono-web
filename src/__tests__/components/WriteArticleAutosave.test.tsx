import { render, screen, act, waitFor } from '@testing-library/react'
import WriteArticlePage from '@/app/(main)/write/article/page'
import { createArticlePost } from '@/services/post.service'

// ── TipTap 모킹 (jsdom에서 실제 에디터 렌더 회피) ──
const editorStub = {
  getText: () => '본문 텍스트',
  getJSON: () => ({ type: 'doc', content: [] }),
  on: jest.fn(),
  off: jest.fn(),
  isActive: () => false,
  getAttributes: () => ({}),
  chain: () => ({
    focus: () => ({
      toggleBold: () => ({ run: jest.fn() }),
    }),
  }),
}

jest.mock('@tiptap/react', () => ({
  useEditor: () => editorStub,
  EditorContent: () => null,
}))
jest.mock('@tiptap/starter-kit', () => ({ __esModule: true, default: { configure: () => ({}) } }))
jest.mock('@tiptap/extension-link', () => ({ __esModule: true, default: { configure: () => ({}) } }))
jest.mock('@tiptap/extension-image', () => ({ __esModule: true, default: { configure: () => ({}) } }))
jest.mock('@tiptap/extension-placeholder', () => ({ __esModule: true, default: { configure: () => ({}) } }))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}))

jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({ isLoaded: true, isSignedIn: true, getToken: jest.fn().mockResolvedValue('token') }),
}))

jest.mock('@/hooks/useToast', () => ({
  useToast: () => ({ success: jest.fn(), error: jest.fn(), info: jest.fn() }),
}))

jest.mock('@/services/post.service', () => ({
  getPresignedUrl: jest.fn(),
  uploadToS3: jest.fn(),
  createArticlePost: jest.fn(),
  updateArticlePost: jest.fn(),
}))

const mockCreate = createArticlePost as jest.Mock

describe('WriteArticlePage 자동저장 실패 표시', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockCreate.mockReset()
  })
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('자동저장 실패 시 "저장 실패" 상태를 노출한다', async () => {
    mockCreate.mockRejectedValue(new Error('save failed'))

    render(<WriteArticlePage />)

    // 제목 입력 → 자동저장 예약
    const titleInput = screen.getByPlaceholderText('writeArticle.titlePlaceholder')
    act(() => {
      titleInput.focus()
    })
    // fireEvent로 값 변경
    act(() => {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )!.set!
      nativeSetter.call(titleInput, '제목입니다')
      titleInput.dispatchEvent(new Event('input', { bubbles: true }))
    })

    // 30초 경과 → 자동저장 트리거
    await act(async () => {
      jest.advanceTimersByTime(30_000)
    })

    await waitFor(() => expect(screen.getByText('writeArticle.saveError')).toBeInTheDocument())
  })
})
