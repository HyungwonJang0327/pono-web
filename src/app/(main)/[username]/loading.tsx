import { Skeleton } from '@/components/ui'

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[560px] px-4 pt-6">
      <div className="flex items-center gap-4">
        <Skeleton variant="circle" className="w-20 h-20" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-3 w-24 rounded" />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full" />
        ))}
      </div>
    </div>
  )
}
