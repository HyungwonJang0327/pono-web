'use client'

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SettingsClient from '@/app/settings/SettingsClient'
import { updateUserProfile } from '@/services/user.service'

// ── 모킹 ──────────────────────────────────────────────────────────────────────

const mockRouterBack = jest.fn()
const mockRouterPush = jest.fn()
const mockRouterRefresh = jest.fn()
const mockToastError = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockRouterBack,
    push: mockRouterPush,
    refresh: mockRouterRefresh,
  }),
}))

jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({ getToken: jest.fn().mockResolvedValue('token') }),
}))

jest.mock('@/components/ui', () => ({
  useToastContext: () => ({ error: mockToastError }),
  BottomSheet: ({
    isOpen,
    children,
  }: {
    isOpen: boolean
    children: React.ReactNode
  }) => (isOpen ? <div role="dialog">{children}</div> : null),
}))

jest.mock('@/services/user.service', () => ({
  updateUserProfile: jest.fn().mockResolvedValue(undefined),
}))

// ── 헬퍼 ──────────────────────────────────────────────────────────────────────

function renderSettingsClient(overrides: {
  username?: string
  avatar?: string | null
  locale?: string | null
} = {}) {
  return render(
    <SettingsClient
      username={overrides.username ?? 'testuser'}
      avatar={overrides.avatar ?? null}
      locale={overrides.locale ?? 'ko'}
    />,
  )
}

// ── 테스트 ────────────────────────────────────────────────────────────────────

describe('SettingsClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('username과 @username을 렌더링한다', () => {
    renderSettingsClient({ username: 'testuser' })
    expect(screen.getByText('testuser')).toBeInTheDocument()
    expect(screen.getByText('@testuser')).toBeInTheDocument()
  })

  it('프로필 요약 카드 탭 시 /settings/profile로 이동한다', async () => {
    renderSettingsClient()
    const card = screen.getByRole('button', { name: /프로필 편집/ })
    await userEvent.click(card)
    expect(mockRouterPush).toHaveBeenCalledWith('/settings/profile')
  })

  it('locale이 ko면 "한국어" 라벨을 표시한다', () => {
    renderSettingsClient({ locale: 'ko' })
    expect(screen.getByText('한국어')).toBeInTheDocument()
  })

  it('locale이 en이면 "English" 라벨을 표시한다', () => {
    renderSettingsClient({ locale: 'en' })
    expect(screen.getByText('English')).toBeInTheDocument()
  })

  it('헤더 뒤로 가기 버튼 탭 시 router.back을 호출한다', async () => {
    renderSettingsClient()
    const backButton = screen.getByRole('button', { name: '뒤로 가기' })
    await userEvent.click(backButton)
    expect(mockRouterBack).toHaveBeenCalled()
  })

  it('언어 row 탭 시 언어 선택 바텀시트가 열린다', async () => {
    renderSettingsClient()
    expect(screen.queryByText('언어 선택')).not.toBeInTheDocument()
    const languageRow = screen.getByRole('button', { name: /언어/ })
    await userEvent.click(languageRow)
    expect(screen.getByText('언어 선택')).toBeInTheDocument()
  })

  it('선택된 locale row에 Check 아이콘을 표시한다', async () => {
    renderSettingsClient({ locale: 'ko' })
    const languageRow = screen.getByRole('button', { name: /언어/ })
    await userEvent.click(languageRow)
    const koRow = screen.getByRole('button', { name: '한국어' })
    expect(within(koRow).getByTestId('locale-check')).toBeInTheDocument()
  })

  it('English row 탭 시 updateUserProfile를 { locale: "en" }로 호출한다', async () => {
    renderSettingsClient({ locale: 'ko' })
    const languageRow = screen.getByRole('button', { name: /언어/ })
    await userEvent.click(languageRow)
    const enRow = screen.getByRole('button', { name: 'English' })
    await userEvent.click(enRow)
    expect(updateUserProfile).toHaveBeenCalledWith({ locale: 'en' }, 'token')
  })
})
