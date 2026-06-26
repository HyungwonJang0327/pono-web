import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BottomSheet } from '@/components/ui/BottomSheet'

describe('BottomSheet', () => {
  it('isOpen: false → children을 렌더링하지 않는다', () => {
    render(
      <BottomSheet isOpen={false} onClose={() => {}}>
        <p>시트 내용</p>
      </BottomSheet>,
    )
    expect(screen.queryByText('시트 내용')).not.toBeInTheDocument()
  })

  it('isOpen: true → children을 렌더링한다', async () => {
    render(
      <BottomSheet isOpen={true} onClose={() => {}}>
        <p>시트 내용</p>
      </BottomSheet>,
    )
    // requestAnimationFrame 실행 대기
    await act(async () => {})
    expect(screen.getByText('시트 내용')).toBeInTheDocument()
  })

  it('오버레이 클릭 시 onClose를 호출한다', async () => {
    const onClose = jest.fn()
    render(
      <BottomSheet isOpen={true} onClose={onClose}>
        <p>시트 내용</p>
      </BottomSheet>,
    )
    await act(async () => {})
    const overlay = document.querySelector('[aria-hidden="true"]') as HTMLElement
    await userEvent.click(overlay)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
