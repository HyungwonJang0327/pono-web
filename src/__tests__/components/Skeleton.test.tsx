import { render } from '@testing-library/react'
import { Skeleton } from '@/components/ui/Skeleton'

describe('Skeleton', () => {
  it('rect variant: rounded-full 클래스 없음, rounded 클래스 적용', () => {
    const { container } = render(<Skeleton className="w-full h-4" />)
    const el = container.firstChild as HTMLElement
    expect(el.className).not.toContain('rounded-full')
    expect(el.className).toContain('rounded-')
  })

  it('circle variant: rounded-full 클래스 적용', () => {
    const { container } = render(<Skeleton variant="circle" className="w-10 h-10" />)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('rounded-full')
  })
})
