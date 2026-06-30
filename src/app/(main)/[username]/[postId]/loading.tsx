import { Skeleton } from '@/components/ui'

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[560px]">
      <Skeleton className="w-full aspect-square" />
      <div className="px-4 pt-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Skeleton variant="circle" className="w-8 h-8" />
          <Skeleton className="h-3 w-24 rounded" />
        </div>
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-3/4 rounded" />
      </div>
    </div>
  )
}
