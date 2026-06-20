'use client'

import React from 'react'
import { WifiOff, RefreshCw } from 'lucide-react'

interface NetworkErrorStateProps {
  title?: string
  description?: React.ReactNode
  retryLabel?: string
  onRetry: () => void
}

export function NetworkErrorState({
  title = '불러오지 못했어요',
  description = '인터넷 연결이 불안정하거나 서버에 일시적인 문제가 있어요. 잠시 후 다시 시도해 주세요.',
  retryLabel = '다시 시도',
  onRetry,
}: NetworkErrorStateProps) {
  return (
    <div className="px-4 pt-2 pb-6">
      <div className="flex justify-center mb-4">
        <div className="w-[56px] h-[56px] rounded-full bg-[#F3EEE6] flex items-center justify-center">
          <WifiOff size={24} style={{ color: '#A88B6A' }} strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="text-[16px] font-semibold text-neutral-900 text-center tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-[13px] text-neutral-600 text-center leading-relaxed mb-5">
        {description}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="w-full h-12 bg-primary-700 text-white rounded-[var(--radius-md)] flex items-center justify-center gap-2 text-[15px] font-medium"
      >
        <RefreshCw size={16} />
        {retryLabel}
      </button>
    </div>
  )
}
