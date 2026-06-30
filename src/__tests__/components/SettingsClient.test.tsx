'use client'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SettingsClient from '@/app/settings/SettingsClient'

// ── 모킹 ──────────────────────────────────────────────────────────────────────

const mockRouterBack = jest.fn()
const mockRouterPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ back: mockRouterBack, push: mockRouterPush }),
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
})
