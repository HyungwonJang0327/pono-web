import { Skeleton } from '@/components/ui'

export default function MainLoading() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 헤더 스켈레톤 */}
      <div className="sticky top-0 z-20 h-[52px] bg-neutral-50 border-b border-neutral-200 flex items-center justify-between px-4 max-w-[560px] mx-auto w-full">
        <Skeleton className="w-12 h-5 rounded" />
        <div className="flex gap-3">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="w-6 h-6 rounded-full" />
        </div>
      </div>
      {/* 피드 스켈레톤 */}
      <main className="mx-auto w-full max-w-[560px] px-3.5 pb-24 pt-4">
        <div className="flex flex-col gap-2.5">
          <div className="bg-white rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-sm)]">
            <Skeleton className="w-full aspect-[16/9]" />
            <div className="px-3 pt-3 pb-3.5 flex flex-col gap-2">
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-full h-3" />
              <Skeleton className="w-1/2 h-3" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[0, 1].map((i) => (
              <div key={i} className="bg-white rounded-[var(--radius-md)] overflow-hidden shadow-[var(--shadow-sm)]">
                <Skeleton className="w-full aspect-square" />
                <div className="px-2.5 pt-2 pb-2.5 flex flex-col gap-1.5">
                  <Skeleton className="w-full h-3" />
                  <Skeleton className="w-2/3 h-3" />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-sm)]">
            <Skeleton className="w-full aspect-[16/9]" />
            <div className="px-3 pt-3 pb-3.5 flex flex-col gap-2">
              <Skeleton className="w-2/3 h-4" />
              <Skeleton className="w-full h-3" />
              <Skeleton className="w-1/2 h-3" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
