describe('테스트 환경', () => {
  it('jest-dom이 정상 로드된다', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    expect(div).toBeInTheDocument()
  })
})
