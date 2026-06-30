'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { useTranslations } from 'next-intl'
import { Bell, User } from 'lucide-react'
import FeedRenderer from '@/components/feed/FeedRenderer'
import { FeedErrorState } from '@/components/feed/FeedErrorState'
import { FeedEmptyState } from '@/components/feed/FeedEmptyState'
import { FeedNoFollowing } from '@/components/feed/FeedNoFollowing'
import { FeedLoginRequired } from '@/components/feed/FeedLoginRequired'
import { Skeleton, NetworkErrorState } from '@/components/ui'
import { FeedItemDto } from '@/types/post'
import { fetchFeed } from '@/services/feed.service'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

type TabType = 'following' | 'recommended'

export default function HomePage() {
  const t = useTranslations('feedHome')
  const [activeTab, setActiveTab] = useState<TabType>('recommended')
  const [items, setItems] = useState<FeedItemDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isLoginRequired, setIsLoginRequired] = useState(false)

  // 페이지네이션 상태
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [loadMoreError, setLoadMoreError] = useState(false)

  // 추가 로드 중복 호출 방지용 in-flight 가드 (state 갱신 전 동기 차단)
  const loadingMoreRef = useRef(false)

  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()

  // 피드를 로딩 상태로 되돌린다(탭 전환·재시도 공용). 누적 상태 초기화 포함.
  const resetToLoading = useCallback(() => {
    setIsLoading(true)
    setError(false)
    setIsLoginRequired(false)
    setItems([])
    setCursor(null)
    setHasMore(false)
    setLoadMoreError(false)
  }, [])

  const loadFeed = useCallback(
    async (tab: TabType) => {
      try {
        const token = isSignedIn ? await getToken() : null
        const data = await fetchFeed({ tab, token })
        setItems(data.items)
        setCursor(data.nextCursor)
        setHasMore(data.hasMore)
      } catch (e: unknown) {
        if ((e as { status?: number })?.status === 401) {
          setIsLoginRequired(true)
          return
        }
        setError(true)
      } finally {
        setIsLoading(false)
      }
    },
    [isSignedIn, getToken],
  )

  // 재시도: 로딩 표시를 즉시 켠 뒤 다시 불러온다(이벤트 핸들러에서 동기 setState).
  const retry = useCallback(() => {
    resetToLoading()
    loadFeed(activeTab)
  }, [resetToLoading, loadFeed, activeTab])

  // 탭 전환: 로딩 표시를 즉시 켜고 탭을 바꾼다. 실제 fetch는 effect가 담당.
  const handleTabChange = useCallback(
    (tab: TabType) => {
      if (tab === activeTab) return
      resetToLoading()
      setActiveTab(tab)
    },
    [activeTab, resetToLoading],
  )

  const loadMore = useCallback(async () => {
    // in-flight 가드 + 더 없거나 cursor 없으면 중단
    if (loadingMoreRef.current || !hasMore || !cursor) return
    loadingMoreRef.current = true
    setIsLoadingMore(true)
    setLoadMoreError(false)

    try {
      const token = isSignedIn ? await getToken() : null
      const data = await fetchFeed({ tab: activeTab, cursor, token })
      // 누적 배열을 통째로 넘겨 페이지 경계 스냅 그룹핑을 FeedRenderer가 처리
      setItems((prev) => [...prev, ...data.items])
      setCursor(data.nextCursor)
      setHasMore(data.hasMore)
    } catch {
      // 추가 로드 실패는 전체 피드를 날리지 않고 인라인 재시도로 처리
      setLoadMoreError(true)
    } finally {
      loadingMoreRef.current = false
      setIsLoadingMore(false)
    }
  }, [activeTab, cursor, hasMore, isSignedIn, getToken])

  // 추가 로드 에러가 떠 있으면 자동 관찰을 멈추고 사용자의 명시적 재시도만 받는다
  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore: hasMore && !loadMoreError,
    isLoading: isLoadingMore,
  })

  // 최신 loadFeed를 ref로 들고 있어, auth 상태로 인한 함수 재생성이 재fetch를 유발하지 않게 한다.
  const loadFeedRef = useRef(loadFeed)
  useEffect(() => {
    loadFeedRef.current = loadFeed
  }, [loadFeed])

  // activeTab 변경·마운트 시에만 데이터 fetch. setState는 모두 await 이후라 동기 cascading 없음.
  useEffect(() => {
    loadFeedRef.current(activeTab)
  }, [activeTab])

  return (
    <>
      {/* 서브탭 */}
      <div className="sticky top-0 z-10 bg-neutral-50 -mx-3.5 px-3.5 pt-3 pb-2 mb-3 border-b border-neutral-200 flex items-center justify-between">
        {/* 왼쪽: 탭 버튼 */}
        <div className="flex gap-4">
          {(['following', 'recommended'] as const).map((tab) => {
            const isActive = activeTab === tab
            const label = tab === 'following' ? t('following') : t('recommended')
            return (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabChange(tab)}
                className={[
                  'text-[14px] font-semibold pb-1.5 border-b-2 transition-colors',
                  isActive
                    ? 'text-primary-700 border-primary-700'
                    : 'text-neutral-500 border-transparent',
                ].join(' ')}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* 오른쪽: 헤더 숨김 시 노출되는 아이콘 */}
        <div className="tab-secondary-actions flex items-center gap-3">
          {/* 알림 버튼 — MVP에서 알림 기능 없음, 뱃지 미표시 */}
          <button className="w-7 h-7 flex items-center justify-center text-neutral-600">
            <Bell size={20} strokeWidth={1.5} />
          </button>
          {/* 프로필 버튼 — 로그인 + 아바타 있으면 Clerk avatar, 아니면 User 폴백 */}
          <button className="w-7 h-7 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center text-neutral-500">
            {isSignedIn && user?.imageUrl ? (
              // Clerk 호스팅 원격 이미지. 동적 URL이라 next/image 대신 img 사용.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.imageUrl}
                alt={user.username ?? ''}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={16} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {/* 피드 */}
      {isLoading ? (
        <div className="flex flex-col gap-2.5">
          {/* 아티클 카드 스켈레톤 */}
          <div className="bg-white rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-card)]">
            <Skeleton className="w-full aspect-[16/9]" />
            <div className="px-3 pt-3 pb-3.5 flex flex-col gap-2">
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-full h-3" />
              <Skeleton className="w-1/2 h-3" />
            </div>
          </div>
          {/* 스냅 2열 스켈레톤 */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-[var(--radius-md)] overflow-hidden shadow-[var(--shadow-card)]">
              <Skeleton className="w-full aspect-square" />
              <div className="px-2.5 pt-2 pb-2.5 flex flex-col gap-1.5">
                <Skeleton className="w-full h-3" />
                <Skeleton className="w-2/3 h-3" />
              </div>
            </div>
            <div className="bg-white rounded-[var(--radius-md)] overflow-hidden shadow-[var(--shadow-card)]">
              <Skeleton className="w-full aspect-square" />
              <div className="px-2.5 pt-2 pb-2.5 flex flex-col gap-1.5">
                <Skeleton className="w-full h-3" />
                <Skeleton className="w-2/3 h-3" />
              </div>
            </div>
          </div>
        </div>
      ) : isLoginRequired ? (
        <div className="fixed inset-x-0 top-[96px] bottom-0 flex items-center justify-center">
          <div className="w-full max-w-[320px]">
            <FeedLoginRequired />
          </div>
        </div>
      ) : error ? (
        <div className="fixed inset-x-0 top-[96px] bottom-0 flex items-center justify-center pointer-events-none">
          <div className="w-full max-w-[320px] pointer-events-auto">
            <FeedErrorState onRetry={retry} />
          </div>
        </div>
      ) : items.length === 0 && activeTab === 'following' ? (
        <div className="fixed inset-x-0 top-[96px] bottom-0 flex items-center justify-center">
          <div className="w-full max-w-[320px]">
            <FeedNoFollowing />
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="fixed inset-x-0 top-[96px] bottom-0 flex items-center justify-center">
          <div className="w-full max-w-[320px]">
            <FeedEmptyState />
          </div>
        </div>
      ) : (
        <>
          <FeedRenderer items={items} />

          {/* 추가 로드 실패: 전체 피드 유지, 인라인 재시도 */}
          {loadMoreError ? (
            <NetworkErrorState compact onRetry={loadMore} />
          ) : isLoadingMore ? (
            // 하단 로딩 인디케이터 (스켈레톤 톤 유지, 스피너 미사용)
            <div className="grid grid-cols-2 gap-2 mt-2.5" aria-hidden="true">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-[var(--radius-md)] overflow-hidden shadow-[var(--shadow-card)]"
                >
                  <Skeleton className="w-full aspect-square" />
                  <div className="px-2.5 pt-2 pb-2.5 flex flex-col gap-1.5">
                    <Skeleton className="w-full h-3" />
                    <Skeleton className="w-2/3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {/* IntersectionObserver sentinel */}
          {hasMore && !loadMoreError && <div ref={sentinelRef} className="h-px" aria-hidden="true" />}
        </>
      )}
    </>
  )
}
