'use client'

import { NetworkErrorState } from '@/components/ui'

interface FeedErrorStateProps {
  onRetry: () => void
}

export function FeedErrorState({ onRetry }: FeedErrorStateProps) {
  return (
    <NetworkErrorState
      title="피드를 불러오지 못했어요"
      onRetry={onRetry}
    />
  )
}
