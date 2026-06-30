'use client'

import { RouteError } from '@/components/ui'

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  return (
    <div className="min-h-screen bg-neutral-50 pt-10">
      <RouteError error={error} unstable_retry={unstable_retry} />
    </div>
  )
}

