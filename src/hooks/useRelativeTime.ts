'use client'

import { useCallback } from 'react'
import { useLocale, useTranslations } from 'next-intl'

/**
 * ISO 문자열을 현재 locale에 맞는 상대 시간 문자열로 변환하는 포맷터를 반환한다.
 * 7일 이상 지난 경우 locale 기반 절대 날짜로 표기한다.
 */
export function useRelativeTime() {
  const t = useTranslations('time')
  const locale = useLocale()

  return useCallback(
    (iso: string): string => {
      const diff = Date.now() - new Date(iso).getTime()
      const mins = Math.floor(diff / 60_000)
      if (mins < 1) return t('justNow')
      if (mins < 60) return t('minutesAgo', { count: mins })
      const hours = Math.floor(mins / 60)
      if (hours < 24) return t('hoursAgo', { count: hours })
      const days = Math.floor(hours / 24)
      if (days < 7) return t('daysAgo', { count: days })
      return new Date(iso).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
    [t, locale],
  )
}
