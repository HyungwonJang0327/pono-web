import { render, screen } from '@testing-library/react'
import { EditedMarker } from '@/components/post/EditedMarker'

describe('EditedMarker', () => {
  it('isEdited가 true면 "수정됨" 텍스트를 렌더링한다', () => {
    render(<EditedMarker isEdited={true} />)
    expect(screen.getByText('post.edited')).toBeInTheDocument()
  })

  it('isEdited가 false면 아무것도 렌더링하지 않는다', () => {
    render(<EditedMarker isEdited={false} />)
    expect(screen.queryByText('post.edited')).not.toBeInTheDocument()
  })
})
