'use client'

import { useEffect } from 'react'
import { NetworkErrorState } from './NetworkErrorState'

interface RouteErrorProps {
  error: Error & { digest?: string }
  /** Next 16.2의 권장 복구 함수 (재페치 후 세그먼트 재렌더) */
  unstable_retry?: () => void
  /** 구버전 호환용 폴백 */
  reset?: () => void
}

/**
 * 라우트 세그먼트 error.tsx에서 재사용하는 공통 에러 폴백.
 * NetworkErrorState를 그대로 쓰고, 재시도는 unstable_retry → reset 순으로 연결한다.
 */
export function RouteError({ error, unstable_retry, reset }: RouteErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const handleRetry = () => {
    if (unstable_retry) unstable_retry()
    else if (reset) reset()
  }

  return (
    <div className="mx-auto w-full max-w-[560px]">
      <NetworkErrorState onRetry={handleRetry} />
    </div>
  )
}
