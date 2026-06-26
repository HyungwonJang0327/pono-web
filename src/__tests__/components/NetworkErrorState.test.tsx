import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NetworkErrorState } from '@/components/ui/NetworkErrorState'

describe('NetworkErrorState', () => {
  it('title 텍스트를 노출한다', () => {
    render(<NetworkErrorState onRetry={() => {}} />)
    expect(screen.getByText('불러오지 못했어요')).toBeInTheDocument()
  })

  it('description 텍스트를 노출한다', () => {
    render(<NetworkErrorState onRetry={() => {}} />)
    expect(screen.getByText(/인터넷 연결이 불안정하거나/)).toBeInTheDocument()
  })

  it('retryLabel 버튼을 노출한다', () => {
    render(<NetworkErrorState onRetry={() => {}} />)
    expect(screen.getByRole('button', { name: /다시 시도/ })).toBeInTheDocument()
  })

  it('버튼 클릭 시 onRetry를 호출한다', async () => {
    const onRetry = jest.fn()
    render(<NetworkErrorState onRetry={onRetry} />)
    await userEvent.click(screen.getByRole('button', { name: /다시 시도/ }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('커스텀 title, retryLabel을 렌더링한다', () => {
    render(<NetworkErrorState title="오류 발생" retryLabel="재시도" onRetry={() => {}} />)
    expect(screen.getByText('오류 발생')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /재시도/ })).toBeInTheDocument()
  })
})
