import { render, screen } from '@testing-library/react'
import EmptySlot from '@/components/feed/EmptySlot'

describe('EmptySlot', () => {
  it('"추천 크리에이터" 텍스트를 노출한다', () => {
    render(<EmptySlot />)
    expect(screen.getByText('recommendedCreators.title')).toBeInTheDocument()
  })

  it('목업 유저 4명을 렌더링한다', () => {
    render(<EmptySlot />)
    expect(screen.getByText('이도현')).toBeInTheDocument()
    expect(screen.getByText('김서연')).toBeInTheDocument()
    expect(screen.getByText('정우성')).toBeInTheDocument()
    expect(screen.getByText('윤소희')).toBeInTheDocument()
  })
})
