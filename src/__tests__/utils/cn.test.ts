import { cn } from '@/lib/utils'

describe('cn', () => {
  it('문자열 클래스를 공백으로 합친다', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('false는 무시한다', () => {
    expect(cn('foo', false, 'bar')).toBe('foo bar')
  })

  it('null은 무시한다', () => {
    expect(cn('foo', null, 'bar')).toBe('foo bar')
  })

  it('undefined는 무시한다', () => {
    expect(cn('foo', undefined, 'bar')).toBe('foo bar')
  })

  it('빈 문자열도 무시한다', () => {
    expect(cn('foo', '', 'bar')).toBe('foo bar')
  })
})
