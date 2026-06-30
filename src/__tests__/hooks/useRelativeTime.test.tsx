import { renderHook } from '@testing-library/react'
import { useRelativeTime } from '@/hooks/useRelativeTime'

// next-intl은 전역 mock(__mocks__/next-intl.js)으로 대체된다.
// useTranslations('time')은 키를 그대로 echo하고, params는 JSON으로 덧붙인다.
//   t('justNow')              -> "time.justNow"
//   t('minutesAgo',{count:5}) -> "time.minutesAgo:{\"count\":5}"

function isoMinutesAgo(mins: number): string {
  return new Date(Date.now() - mins * 60_000).toISOString()
}

describe('useRelativeTime', () => {
  it('1분 미만은 justNow 키를 반환한다', () => {
    const { result } = renderHook(() => useRelativeTime())
    expect(result.current(isoMinutesAgo(0))).toBe('time.justNow')
  })

  it('60분 미만은 minutesAgo 키에 분(count)을 넘긴다', () => {
    const { result } = renderHook(() => useRelativeTime())
    expect(result.current(isoMinutesAgo(5))).toBe('time.minutesAgo:{"count":5}')
  })

  it('24시간 미만은 hoursAgo 키에 시간(count)을 넘긴다', () => {
    const { result } = renderHook(() => useRelativeTime())
    expect(result.current(isoMinutesAgo(3 * 60))).toBe('time.hoursAgo:{"count":3}')
  })

  it('7일 미만은 daysAgo 키에 일(count)을 넘긴다', () => {
    const { result } = renderHook(() => useRelativeTime())
    expect(result.current(isoMinutesAgo(2 * 24 * 60))).toBe('time.daysAgo:{"count":2}')
  })

  it('7일 이상은 상대 시간 키가 아닌 절대 날짜를 반환한다', () => {
    const { result } = renderHook(() => useRelativeTime())
    const out = result.current(isoMinutesAgo(10 * 24 * 60))
    expect(out.startsWith('time.')).toBe(false)
    expect(out.length).toBeGreaterThan(0)
  })
})
