'use client'

import { useTranslations } from 'next-intl'
import { NetworkErrorState } from '@/components/ui'

interface FeedErrorStateProps {
  onRetry: () => void
}

export function FeedErrorState({ onRetry }: FeedErrorStateProps) {
  const t = useTranslations('feed')

  return (
    <NetworkErrorState
      title={t('error.title')}
      onRetry={onRetry}
    />
  )
}
