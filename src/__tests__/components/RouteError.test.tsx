import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouteError } from '@/components/ui/RouteError'

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => {
  jest.restoreAllMocks()
})

describe('RouteError', () => {
  it('에러 폴백을 렌더링하고 재시도 버튼을 노출한다', () => {
    render(<RouteError error={new Error('boom')} unstable_retry={() => {}} />)
    expect(screen.getByText('error.networkTitle')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'error.retry' })).toBeInTheDocument()
  })

  it('재시도 버튼 클릭 시 unstable_retry를 호출한다', async () => {
    const retry = jest.fn()
    render(<RouteError error={new Error('boom')} unstable_retry={retry} />)
    await userEvent.click(screen.getByRole('button', { name: 'error.retry' }))
    expect(retry).toHaveBeenCalledTimes(1)
  })

  it('unstable_retry가 없으면 reset 폴백을 호출한다', async () => {
    const reset = jest.fn()
    render(<RouteError error={new Error('boom')} reset={reset} />)
    await userEvent.click(screen.getByRole('button', { name: 'error.retry' }))
    expect(reset).toHaveBeenCalledTimes(1)
  })
})
