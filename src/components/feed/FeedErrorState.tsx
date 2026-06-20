'use client'

import { WifiOff, RefreshCw } from 'lucide-react'
import { FeedStateCard } from './FeedStateCard'

interface FeedErrorStateProps {
  onRetry: () => void
}

export function FeedErrorState({ onRetry }: FeedErrorStateProps) {
  return (
    <FeedStateCard
      iconBg="bg-[#F3EEE6]"
      iconNode={<WifiOff size={28} style={{ color: '#A88B6A' }} strokeWidth={1.5} />}
      title="피드를 불러오지 못했어요"
      description="인터넷 연결이 불안정하거나 서버에 일시적인 문제가 있어요. 잠시 후 다시 시도해 주세요."
      action={
        <button
          type="button"
          onClick={onRetry}
          className="w-full h-12 bg-primary-700 text-white rounded-[var(--radius-md)] flex items-center justify-center gap-2 text-[15px] font-medium"
        >
          <RefreshCw size={16} />
          다시 시도
        </button>
      }
    />
  )
}
