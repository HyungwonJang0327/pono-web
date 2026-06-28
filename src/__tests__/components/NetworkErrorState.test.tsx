import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NetworkErrorState } from '@/components/ui/NetworkErrorState'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) => {
    if (params) return `${key}:${JSON.stringify(params)}`
    return key
  },
}))

describe('NetworkErrorState', () => {
  it('번역 키 error.networkTitle을 기본 title로 노출한다', () => {
    render(<NetworkErrorState onRetry={() => {}} />)
    expect(screen.getByText('error.networkTitle')).toBeInTheDocument()
  })

  it('번역 키 error.networkDescription을 기본 description으로 노출한다', () => {
    render(<NetworkErrorState onRetry={() => {}} />)
    expect(screen.getByText('error.networkDescription')).toBeInTheDocument()
  })

  it('번역 키 error.retry 버튼을 노출한다', () => {
    render(<NetworkErrorState onRetry={() => {}} />)
    expect(screen.getByRole('button', { name: 'error.retry' })).toBeInTheDocument()
  })

  it('버튼 클릭 시 onRetry를 호출한다', async () => {
    const onRetry = jest.fn()
    render(<NetworkErrorState onRetry={onRetry} />)
    await userEvent.click(screen.getByRole('button', { name: 'error.retry' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('커스텀 title, retryLabel을 렌더링한다', () => {
    render(<NetworkErrorState title="오류 발생" retryLabel="재시도" onRetry={() => {}} />)
    expect(screen.getByText('오류 발생')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /재시도/ })).toBeInTheDocument()
  })
})
