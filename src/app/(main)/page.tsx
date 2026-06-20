'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import FeedRenderer from '@/components/feed/FeedRenderer'
import { Skeleton } from '@/components/ui'
import { FeedItemDto } from '@/types/post'
import { fetchFeed } from '@/services/feed.service'

type TabType = 'following' | 'recommended'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('recommended')
  const [items, setItems] = useState<FeedItemDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const { getToken, isSignedIn } = useAuth()

  useEffect(() => {
    loadFeed()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const loadFeed = async () => {
    setIsLoading(true)
    setError(false)
    setItems([])

    try {
      const token = isSignedIn ? await getToken() : null
      const data = await fetchFeed({ tab: activeTab, token })
      setItems(data.items)
    } catch (e: unknown) {
      if ((e as { status?: number })?.status === 401) {
        // 비로그인 following 탭 → recommended로 자동 fallback
        setActiveTab('recommended')
        return
      }
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* 서브탭 */}
      <div className="sticky top-0 z-10 bg-neutral-50 -mx-3.5 px-3.5 pt-3 pb-2 mb-3 border-b border-neutral-200 flex items-center justify-between">
        {/* 왼쪽: 탭 버튼 */}
        <div className="flex gap-4">
          {(['following', 'recommended'] as const).map((tab) => {
            const isActive = activeTab === tab
            const label = tab === 'following' ? '팔로잉' : '추천'
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
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
          {/* 알림 버튼 */}
          <button className="relative w-7 h-7 flex items-center justify-center text-neutral-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-primary-500 rounded-full border border-neutral-50" />
          </button>
          {/* 프로필 버튼 — 추후 Clerk avatar로 교체 예정 */}
          <button className="w-7 h-7 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center text-neutral-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
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
      ) : error ? (
        <p className="text-center text-neutral-500 text-sm mt-10">피드를 불러오지 못했어요.</p>
      ) : items.length === 0 ? (
        <p className="text-center text-neutral-500 text-sm mt-10">아직 게시물이 없어요.</p>
      ) : (
        <FeedRenderer items={items} />
      )}
    </>
  )
}
