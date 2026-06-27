import { render, screen } from '@testing-library/react'
import WriteFab from '@/components/layout/WriteFab'

const mockPush = jest.fn()
let mockPathname = '/'
let mockIsSignedIn = true
let mockUsername: string | null = 'me'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => mockPathname,
}))

jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({ isSignedIn: mockIsSignedIn }),
  useUser: () => ({ user: mockUsername ? { username: mockUsername } : null }),
}))

jest.mock('@/components/ui', () => ({
  BottomSheet: ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) =>
    isOpen ? <div>{children}</div> : null,
}))

describe('WriteFab 노출 정책', () => {
  beforeEach(() => {
    mockIsSignedIn = true
    mockUsername = 'me'
  })

  it('홈 피드(/)에서 표시된다', () => {
    mockPathname = '/'
    render(<WriteFab />)
    expect(screen.getByRole('button', { name: '글 작성' })).toBeInTheDocument()
  })

  it('내 프로필(/me)에서 표시된다', () => {
    mockPathname = '/me'
    render(<WriteFab />)
    expect(screen.getByRole('button', { name: '글 작성' })).toBeInTheDocument()
  })

  it('타인 프로필에서 숨겨진다', () => {
    mockPathname = '/other'
    render(<WriteFab />)
    expect(screen.queryByRole('button', { name: '글 작성' })).not.toBeInTheDocument()
  })

  it('팔로워 목록 페이지에서 숨겨진다', () => {
    mockPathname = '/me/followers'
    render(<WriteFab />)
    expect(screen.queryByRole('button', { name: '글 작성' })).not.toBeInTheDocument()
  })

  it('팔로잉 목록 페이지에서 숨겨진다', () => {
    mockPathname = '/me/following'
    render(<WriteFab />)
    expect(screen.queryByRole('button', { name: '글 작성' })).not.toBeInTheDocument()
  })

  it('포스트 상세 페이지에서 숨겨진다', () => {
    mockPathname = '/someone/post-id-123'
    render(<WriteFab />)
    expect(screen.queryByRole('button', { name: '글 작성' })).not.toBeInTheDocument()
  })

  it('글 작성 페이지에서 숨겨진다', () => {
    mockPathname = '/write/snap'
    render(<WriteFab />)
    expect(screen.queryByRole('button', { name: '글 작성' })).not.toBeInTheDocument()
  })

  it('비로그인 상태에서 숨겨진다', () => {
    mockIsSignedIn = false
    mockPathname = '/'
    render(<WriteFab />)
    expect(screen.queryByRole('button', { name: '글 작성' })).not.toBeInTheDocument()
  })
})
