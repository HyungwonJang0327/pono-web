'use client'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProfileEditClient from '@/app/settings/profile/ProfileEditClient'

// ── 모킹 ──────────────────────────────────────────────────────────────────────

const mockToastSuccess = jest.fn()
const mockToastError = jest.fn()
const mockRouterBack = jest.fn()

jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({ getToken: jest.fn().mockResolvedValue('mock-token') }),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ back: mockRouterBack, push: jest.fn() }),
}))

jest.mock('@/components/ui', () => ({
  useToastContext: () => ({
    success: mockToastSuccess,
    error: mockToastError,
    info: jest.fn(),
  }),
}))

jest.mock('@/services/user.service', () => ({
  updateUserProfile: jest.fn(),
}))

// ── 헬퍼 ──────────────────────────────────────────────────────────────────────

function renderProfileEditClient(overrides: {
  initialUsername?: string
  initialBio?: string | null
  initialAvatar?: string | null
} = {}) {
  return render(
    <ProfileEditClient
      initialUsername={overrides.initialUsername ?? 'testuser'}
      initialBio={overrides.initialBio ?? null}
      initialAvatar={overrides.initialAvatar ?? null}
    />,
  )
}

// ── 테스트 ────────────────────────────────────────────────────────────────────

describe('ProfileEditClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('"저장하기" 버튼이 초기 진입 시 렌더링된다', () => {
    renderProfileEditClient()
    expect(screen.getByRole('button', { name: 'profileEdit.save' })).toBeInTheDocument()
  })

  it('bio 입력 시 글자 수 카운터가 업데이트된다', async () => {
    renderProfileEditClient({ initialBio: null })
    const textarea = screen.getByRole('textbox', { name: /profileEdit\.bioLabel/ })

    await userEvent.clear(textarea)
    await userEvent.type(textarea, '안녕하세요')

    // 5자 입력
    expect(screen.getByText(/5 \/ 80/)).toBeInTheDocument()
  })

  it('bio 80자 초과 입력을 방지한다', async () => {
    renderProfileEditClient({ initialBio: null })
    const textarea = screen.getByRole('textbox', { name: /profileEdit\.bioLabel/ })

    const over80 = 'a'.repeat(85)
    await userEvent.clear(textarea)
    await userEvent.type(textarea, over80)

    // textarea 값이 80자를 넘지 않아야 함
    expect((textarea as HTMLTextAreaElement).value.length).toBeLessThanOrEqual(80)
    expect(screen.getByText(/80 \/ 80/)).toBeInTheDocument()
  })

  it('저장 성공 시 toast.success를 호출한다', async () => {
    const { updateUserProfile } = await import('@/services/user.service')
    ;(updateUserProfile as jest.Mock).mockResolvedValue(undefined)

    renderProfileEditClient({ initialUsername: 'testuser', initialBio: '기존 소개' })

    // bio를 변경해서 isDirty 상태 만들기
    const textarea = screen.getByRole('textbox', { name: /profileEdit\.bioLabel/ })
    await userEvent.clear(textarea)
    await userEvent.type(textarea, '새로운 소개')

    const saveButton = screen.getByRole('button', { name: 'profileEdit.save' })
    await userEvent.click(saveButton)

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('profileEdit.saveSuccess')
    })
  })

  it('저장 실패 시 toast.error를 호출한다', async () => {
    const { updateUserProfile } = await import('@/services/user.service')
    ;(updateUserProfile as jest.Mock).mockRejectedValue(new Error('API error'))

    renderProfileEditClient({ initialUsername: 'testuser', initialBio: '기존 소개' })

    // bio를 변경해서 isDirty 상태 만들기
    const textarea = screen.getByRole('textbox', { name: /profileEdit\.bioLabel/ })
    await userEvent.clear(textarea)
    await userEvent.type(textarea, '새로운 소개')

    const saveButton = screen.getByRole('button', { name: 'profileEdit.save' })
    await userEvent.click(saveButton)

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('profileEdit.saveError')
    })
  })
})
