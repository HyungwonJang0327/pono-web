import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SnapLikeButton } from '@/components/ui/SnapLikeButton'

describe('SnapLikeButton', () => {
  it('비활성(isLiked: false) 상태를 렌더링한다', () => {
    render(<SnapLikeButton isLiked={false} onToggle={() => {}} />)
    expect(screen.getByRole('button', { name: '좋아요' })).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('활성(isLiked: true) 상태를 렌더링한다', () => {
    render(<SnapLikeButton isLiked={true} onToggle={() => {}} />)
    expect(screen.getByRole('button', { name: '좋아요 취소' })).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('count 숫자를 표시한다', () => {
    render(<SnapLikeButton isLiked={false} count={42} onToggle={() => {}} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('클릭 시 onToggle을 호출한다', async () => {
    const onToggle = jest.fn()
    render(<SnapLikeButton isLiked={false} onToggle={onToggle} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})
