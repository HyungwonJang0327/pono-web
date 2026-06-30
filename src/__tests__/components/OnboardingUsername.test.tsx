import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OnboardingUsernamePage from '@/app/onboarding/username/page'
import { updateUserProfile } from '@/services/user.service'
import { ApiError } from '@/lib/api'

const push = jest.fn()
const refresh = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh }),
}))

jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({ getToken: jest.fn().mockResolvedValue('token') }),
}))

jest.mock('@/services/user.service', () => ({
  updateUserProfile: jest.fn(),
}))

const mockUpdate = updateUserProfile as jest.Mock

beforeEach(() => {
  push.mockReset()
  refresh.mockReset()
  mockUpdate.mockReset()
})

async function typeValidUsername() {
  const input = screen.getByPlaceholderText('onboarding.usernamePlaceholder')
  await userEvent.type(input, 'validname')
  return screen.getByRole('button', { name: 'onboarding.submit' })
}

describe('OnboardingUsernamePage 에러 처리', () => {
  it('409 충돌 시 이미 사용 중 메시지를 노출한다', async () => {
    mockUpdate.mockRejectedValue(new ApiError({ status: 409, code: 'USERNAME_TAKEN' }))

    render(<OnboardingUsernamePage />)
    const button = await typeValidUsername()
    await userEvent.click(button)

    await waitFor(() =>
      expect(screen.getByText('onboarding.usernameTaken')).toBeInTheDocument(),
    )
  })

  it('비-409 에러 시 일반 에러 메시지를 노출하고 버튼을 재활성화한다', async () => {
    mockUpdate.mockRejectedValue(new ApiError({ status: 500, code: 'INTERNAL_ERROR' }))

    render(<OnboardingUsernamePage />)
    const button = await typeValidUsername()
    await userEvent.click(button)

    await waitFor(() =>
      expect(screen.getByText('onboarding.submitError')).toBeInTheDocument(),
    )
    expect(screen.getByRole('button', { name: 'onboarding.submit' })).not.toBeDisabled()
    expect(push).not.toHaveBeenCalled()
  })

  it('성공 시 홈으로 이동한다', async () => {
    mockUpdate.mockResolvedValue(undefined)

    render(<OnboardingUsernamePage />)
    const button = await typeValidUsername()
    await userEvent.click(button)

    await waitFor(() => expect(push).toHaveBeenCalledWith('/'))
  })
})
