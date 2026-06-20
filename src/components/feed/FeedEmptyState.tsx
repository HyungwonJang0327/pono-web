import { Newspaper, Search } from 'lucide-react'
import { FeedStateCard } from './FeedStateCard'

export function FeedEmptyState() {
  return (
    <FeedStateCard
      iconBg="bg-primary-50"
      iconNode={<Newspaper size={28} className="text-primary-500" strokeWidth={1.5} />}
      title="아직 보여드릴 글이 없어요"
      description={<>탐색에서 마음에 드는 스냅과 아티클을 찾아보세요.<br />곧 당신만의 피드가 채워질 거예요.</>}
      action={
        <button
          type="button"
          className="w-full h-12 bg-primary-700 text-white rounded-[var(--radius-md)] flex items-center justify-center gap-2 text-[15px] font-medium"
        >
          <Search size={16} />
          탐색 둘러보기
        </button>
      }
    />
  )
}
