'use client'

import React from 'react'
import { WifiOff, RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface NetworkErrorStateProps {
  title?: string
  description?: React.ReactNode
  retryLabel?: string
  onRetry: () => void
  /** 댓글 등 좁은 영역용 컴팩트 레이아웃 (아이콘·여백 축소, 인라인 재시도 링크) */
  compact?: boolean
}

export function NetworkErrorState({
  title,
  description,
  retryLabel,
  onRetry,
  compact = false,
}: NetworkErrorStateProps) {
  const t = useTranslations('error')
  const resolvedTitle = title ?? t('networkTitle')
  const resolvedDescription = description ?? t('networkDescription')
  const resolvedRetryLabel = retryLabel ?? t('retry')

  if (compact) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <p className="text-[13px] text-neutral-600">{resolvedDescription}</p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary-700"
        >
          <RefreshCw size={14} />
          {resolvedRetryLabel}
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 pt-2 pb-6">
      <div className="flex justify-center mb-4">
        <div className="w-[56px] h-[56px] rounded-full bg-[#F3EEE6] flex items-center justify-center">
          <WifiOff size={24} style={{ color: '#A88B6A' }} strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="text-[16px] font-semibold text-neutral-900 text-center tracking-tight mb-2">
        {resolvedTitle}
      </h3>
      <p className="text-[13px] text-neutral-600 text-center leading-relaxed mb-5">
        {resolvedDescription}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="w-full h-12 bg-primary-700 text-white rounded-[var(--radius-md)] flex items-center justify-center gap-2 text-[15px] font-medium"
      >
        <RefreshCw size={16} />
        {resolvedRetryLabel}
      </button>
    </div>
  )
}
