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
const mockOpenSignIn = jest.fn()

let mockIsSignedIn = true

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockRouterBack,
    push: mockRouterPush,
    refresh: mockRouterRefresh,
  }),
}))

jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({
    isSignedIn: mockIsSignedIn,
    getToken: jest.fn().mockResolvedValue('token'),
  }),
  useClerk: () => ({ openSignIn: mockOpenSignIn }),
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
  username?: string | null
  avatar?: string | null
  locale?: string | null
  loadFailed?: boolean
} = {}) {
  return render(
    <SettingsClient
      username={overrides.username === undefined ? 'testuser' : overrides.username}
      avatar={overrides.avatar ?? null}
      locale={overrides.locale ?? 'ko'}
      loadFailed={overrides.loadFailed ?? false}
    />,
  )
}

// ── 테스트 ────────────────────────────────────────────────────────────────────

describe('SettingsClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockIsSignedIn = true
  })

  it('username과 @username을 렌더링한다', () => {
    renderSettingsClient({ username: 'testuser' })
    expect(screen.getByText('testuser')).toBeInTheDocument()
    expect(screen.getByText('@testuser')).toBeInTheDocument()
  })

  it('프로필 요약 카드 탭 시 /settings/profile로 이동한다', async () => {
    renderSettingsClient()
    const card = screen.getByRole('button', { name: /settings\.editProfile/ })
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
    const backButton = screen.getByRole('button', { name: 'settings.back' })
    await userEvent.click(backButton)
    expect(mockRouterBack).toHaveBeenCalled()
  })

  it('언어 row 탭 시 언어 선택 바텀시트가 열린다', async () => {
    renderSettingsClient()
    expect(screen.queryByText('settings.languageSheetTitle')).not.toBeInTheDocument()
    const languageRow = screen.getByRole('button', { name: /settings\.language/ })
    await userEvent.click(languageRow)
    expect(screen.getByText('settings.languageSheetTitle')).toBeInTheDocument()
  })

  it('선택된 locale row에 Check 아이콘을 표시한다', async () => {
    renderSettingsClient({ locale: 'ko' })
    const languageRow = screen.getByRole('button', { name: /settings\.language/ })
    await userEvent.click(languageRow)
    const koRow = screen.getByRole('button', { name: '한국어' })
    expect(within(koRow).getByTestId('locale-check')).toBeInTheDocument()
  })

  it('English row 탭 시 updateUserProfile를 { locale: "en" }로 호출한다', async () => {
    renderSettingsClient({ locale: 'ko' })
    const languageRow = screen.getByRole('button', { name: /settings\.language/ })
    await userEvent.click(languageRow)
    const enRow = screen.getByRole('button', { name: 'English' })
    await userEvent.click(enRow)
    expect(updateUserProfile).toHaveBeenCalledWith({ locale: 'en' }, 'token')
  })

  describe('비로그인 상태', () => {
    beforeEach(() => {
      mockIsSignedIn = false
    })

    it('"로그인하기" row를 표시하고 프로필 요약 카드를 표시하지 않는다', () => {
      renderSettingsClient({ username: null })
      expect(screen.getByText('settings.login')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /settings\.editProfile/ })).not.toBeInTheDocument()
    })

    it('"로그인하기" row 탭 시 openSignIn을 호출한다', async () => {
      renderSettingsClient({ username: null })
      const loginRow = screen.getByRole('button', { name: /settings\.login/ })
      await userEvent.click(loginRow)
      expect(mockOpenSignIn).toHaveBeenCalled()
    })

    it('언어 설정 섹션은 그대로 노출한다', () => {
      renderSettingsClient({ username: null, locale: 'ko' })
      expect(screen.getByRole('button', { name: /settings\.language/ })).toBeInTheDocument()
    })

    it('언어 변경 시 updateUserProfile를 호출하지 않는다', async () => {
      renderSettingsClient({ username: null, locale: 'ko' })
      const languageRow = screen.getByRole('button', { name: /settings\.language/ })
      await userEvent.click(languageRow)
      const enRow = screen.getByRole('button', { name: 'English' })
      await userEvent.click(enRow)
      expect(updateUserProfile).not.toHaveBeenCalled()
      expect(mockRouterRefresh).toHaveBeenCalled()
    })
  })

  describe('프로필 로드 실패 상태', () => {
    it('loadFailed면 로그인하기 카드 대신 에러/재시도를 노출한다', () => {
      renderSettingsClient({ username: null, loadFailed: true })
      expect(screen.queryByText('로그인하기')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'error.retry' })).toBeInTheDocument()
    })

    it('재시도 버튼 탭 시 router.refresh를 호출한다', async () => {
      renderSettingsClient({ username: null, loadFailed: true })
      await userEvent.click(screen.getByRole('button', { name: 'error.retry' }))
      expect(mockRouterRefresh).toHaveBeenCalled()
    })
  })
})
