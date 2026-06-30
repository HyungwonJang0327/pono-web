import { Skeleton } from '@/components/ui'

export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto w-full max-w-[560px] px-4">
        <Skeleton className="mt-6 h-[72px] w-full rounded-[10px]" />
        <Skeleton className="mt-7 h-[52px] w-full rounded-[10px]" />
      </div>
    </div>
  )
}

