import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ArticleLikeButton } from '@/components/ui/ArticleLikeButton'

describe('ArticleLikeButton', () => {
  it('비활성(isLiked: false) 상태를 렌더링한다', () => {
    render(<ArticleLikeButton isLiked={false} onToggle={() => {}} />)
    expect(screen.getByRole('button', { name: '좋아요' })).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('활성(isLiked: true) 상태를 렌더링한다', () => {
    render(<ArticleLikeButton isLiked={true} onToggle={() => {}} />)
    expect(screen.getByRole('button', { name: '좋아요 취소' })).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('count 숫자를 표시한다', () => {
    render(<ArticleLikeButton isLiked={false} count={128} onToggle={() => {}} />)
    expect(screen.getByText('128')).toBeInTheDocument()
  })

  it('클릭 시 onToggle을 호출한다', async () => {
    const onToggle = jest.fn()
    render(<ArticleLikeButton isLiked={false} onToggle={onToggle} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('활성 색상이 primary-700(#1F4D3A)이다', () => {
    const { container } = render(<ArticleLikeButton isLiked={true} onToggle={() => {}} />)
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('fill')).toBe('#1F4D3A')
  })
})
