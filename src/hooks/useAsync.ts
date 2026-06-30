'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface UseAsyncResult<T> {
  data: T | null
  isLoading: boolean
  error: unknown
  retry: () => void
}

/**
 * CSR 데이터 페칭 표준 훅.
 * 마운트 시(및 retry 시) asyncFn을 실행해 data/isLoading/error 상태를 관리한다.
 * 언마운트·재요청 레이스는 호출 토큰으로 무시한다.
 */
export function useAsync<T>(asyncFn: () => Promise<T>): UseAsyncResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  // 최신 asyncFn을 ref로 들고 있어, 매 렌더 새 함수가 와도 effect를 재구독하지 않음
  const fnRef = useRef(asyncFn)
  useEffect(() => {
    fnRef.current = asyncFn
  })

  const [tick, setTick] = useState(0)
  const callIdRef = useRef(0)

  useEffect(() => {
    const callId = ++callIdRef.current
    // 새 요청 시작: 로딩 표시·이전 에러 초기화 (의도된 effect 내 setState)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true)
    setError(null)

    fnRef.current().then(
      (result) => {
        if (callId !== callIdRef.current) return
        setData(result)
        setIsLoading(false)
      },
      (err) => {
        if (callId !== callIdRef.current) return
        setError(err)
        setIsLoading(false)
      },
    )
  }, [tick])

  const retry = useCallback(() => setTick((v) => v + 1), [])

  return { data, isLoading, error, retry }
}
