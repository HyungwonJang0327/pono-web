import { RESERVED_USERNAMES, SNAP_MAX_CAPTION_LENGTH } from '@/constants'

describe('RESERVED_USERNAMES', () => {
  it.each(['explore', 'write', 'api', 'admin'])('%s를 포함한다', (name) => {
    expect(RESERVED_USERNAMES).toContain(name)
  })
})

describe('SNAP_MAX_CAPTION_LENGTH', () => {
  it('500이다', () => {
    expect(SNAP_MAX_CAPTION_LENGTH).toBe(500)
  })
})
