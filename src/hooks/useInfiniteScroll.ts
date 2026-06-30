'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface UseInfiniteScrollParams {
  /** sentinel이 뷰포트에 진입했을 때 호출할 추가 로드 함수 */
  onLoadMore: () => void
  /** 더 불러올 페이지가 있는지. false면 관찰 자체를 중단한다. */
  hasMore: boolean
  /** 로딩 중 여부. true면 교차해도 호출하지 않는다(in-flight 가드). */
  isLoading: boolean
  /** IntersectionObserver rootMargin. 기본은 하단 도달 전 미리 로드. */
  rootMargin?: string
}

interface UseInfiniteScrollResult {
  /** 리스트 하단 sentinel 엘리먼트에 붙일 콜백 ref */
  sentinelRef: (node: HTMLDivElement | null) => void
}

/**
 * IntersectionObserver 기반 무한 스크롤 훅.
 * 리스트 하단 sentinel에 `sentinelRef`를 연결하면, 화면에 진입할 때 `onLoadMore`를 호출한다.
 *
 * - hasMore=false: observer를 생성하지 않아 더 이상 호출하지 않는다.
 * - isLoading=true: 교차해도 호출하지 않아 중복 로드를 막는다.
 * - 최신 onLoadMore/isLoading은 ref로 들고 있어, 매 렌더 새 함수가 와도 재구독하지 않는다.
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  rootMargin = '200px',
}: UseInfiniteScrollParams): UseInfiniteScrollResult {
  const [node, setNode] = useState<HTMLDivElement | null>(null)

  const onLoadMoreRef = useRef(onLoadMore)
  const isLoadingRef = useRef(isLoading)
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore
    isLoadingRef.current = isLoading
  })

  const sentinelRef = useCallback((el: HTMLDivElement | null) => {
    setNode(el)
  }, [])

  useEffect(() => {
    if (!node || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting && !isLoadingRef.current) {
          onLoadMoreRef.current()
        }
      },
      { rootMargin },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [node, hasMore, rootMargin])

  return { sentinelRef }
}
