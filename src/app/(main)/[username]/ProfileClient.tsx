'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useUser } from '@clerk/nextjs'
import { BookOpen, Clock } from 'lucide-react'
import { useToastContext } from '@/components/ui'
import { followUser, unfollowUser } from '@/services/user.service'
import type { UserPublicProfileDto } from '@/types/user'
import type { SnapFeedItemDto, ArticleFeedItemDto } from '@/types/post'

interface ProfileClientProps {
  profile: UserPublicProfileDto
  snapPosts: (SnapFeedItemDto | ArticleFeedItemDto)[]
  articlePosts: (SnapFeedItemDto | ArticleFeedItemDto)[]
  isOwnedByMe: boolean
  isWebView?: boolean
}

export default function ProfileClient({
  profile,
  snapPosts,
  articlePosts,
  isOwnedByMe,
}: ProfileClientProps) {
  const router = useRouter()
  const { getToken } = useAuth()
  const { user: clerkUser } = useUser()
  const toast = useToastContext()

  const [isFollowing, setIsFollowing] = useState(profile.isFollowedByMe)
  const [activeTab, setActiveTab] = useState<0 | 1>(0) // 0: 스냅, 1: 아티클
  const [isCompact, setIsCompact] = useState(false)
  const profileSectionRef = useRef<HTMLDivElement>(null)

  // 스크롤 감지 → isCompact 전환
  useEffect(() => {
    const onScroll = () => {
      const sectionHeight = profileSectionRef.current?.offsetHeight ?? 160
      setIsCompact(window.scrollY > sectionHeight)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 터치 스와이프 처리
  const touchStartX = useRef<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (dx < -50) setActiveTab(1)
    else if (dx > 50) setActiveTab(0)
    touchStartX.current = null
  }

  // 팔로우 낙관적 업데이트
  const handleFollowToggle = async () => {
    if (!clerkUser) return
    const prev = isFollowing
    setIsFollowing(!prev)
    try {
      const token = (await getToken()) ?? ''
      if (prev) {
        await unfollowUser(profile.id, token)
      } else {
        await followUser(profile.id, token)
      }
    } catch {
      setIsFollowing(prev)
      toast.error('오류가 발생했어요')
    }
  }

  const snaps = snapPosts.filter((p): p is SnapFeedItemDto => p.type === 'snap')
  const articles = articlePosts.filter((p): p is ArticleFeedItemDto => p.type === 'article')

  return (
    <div className="min-h-screen">
      {/* 페이지 자체 sticky 헤더 (레이아웃 Header와 별개) */}
      <div className="sticky top-[57px] z-10 bg-neutral-50 border-b border-neutral-200">
        {/* 축소/전체 프로필 행 */}
        <div
          className="mx-auto w-full max-w-[560px] px-5 transition-all duration-200"
          style={{ paddingTop: isCompact ? '10px' : '16px', paddingBottom: isCompact ? '10px' : '0' }}
        >
          {/* 상단 타이틀 행: @username */}
          <div className="flex items-center justify-center mb-3">
            <span className="text-sm font-semibold text-neutral-900">@{profile.username}</span>
          </div>

          {/* 프로필 정보 행 */}
          <div className="flex items-center gap-3">
            {/* 아바타 */}
            <div
              className="rounded-full bg-neutral-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-neutral-600 font-semibold transition-all duration-200"
              style={{ width: isCompact ? 32 : 48, height: isCompact ? 32 : 48, fontSize: isCompact ? 13 : 18 }}
            >
              {profile.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
              ) : (
                <span>{profile.username[0].toUpperCase()}</span>
              )}
            </div>

            {/* 이름 + bio */}
            <div className="flex-1 min-w-0">
              {isCompact ? (
                <>
                  <p className="text-sm font-semibold text-neutral-900 leading-tight">
                    {profile.username}
                  </p>
                  {profile.bio && (
                    <p className="text-xs text-neutral-500 truncate">{profile.bio}</p>
                  )}
                </>
              ) : (
                <>
                  <p className="text-[15px] font-semibold text-neutral-900 leading-tight">
                    {profile.username}
                  </p>
                  {profile.bio && (
                    <p className="text-sm text-neutral-600 mt-0.5">{profile.bio}</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 스크롤 전에만 표시: 팔로워/팔로잉 수 + 버튼 */}
          <div
            className="overflow-hidden transition-all duration-200"
            style={{ maxHeight: isCompact ? 0 : 120, opacity: isCompact ? 0 : 1 }}
          >
            <div ref={profileSectionRef}>
              {/* 팔로워/팔로잉 */}
              <div className="flex gap-4 mt-3 text-sm">
                <span>
                  <span className="font-bold text-neutral-900">{profile.followerCount.toLocaleString()}</span>
                  <span className="text-neutral-500 ml-1">팔로워</span>
                </span>
                <span>
                  <span className="font-bold text-neutral-900">{profile.followingCount.toLocaleString()}</span>
                  <span className="text-neutral-500 ml-1">팔로잉</span>
                </span>
              </div>

              {/* 팔로우 / 프로필 편집 버튼 */}
              <div className="mt-3 mb-4">
                {isOwnedByMe ? (
                  <button
                    type="button"
                    onClick={() => {
                      // TODO: /settings/profile 이동
                    }}
                    className="w-full py-2 rounded-full border border-primary-700 text-primary-700 text-sm font-medium flex items-center justify-center gap-1.5"
                  >
                    <span>✏</span>
                    <span>프로필 편집</span>
                  </button>
                ) : isFollowing ? (
                  <button
                    type="button"
                    onClick={handleFollowToggle}
                    className="w-full py-2 rounded-full border border-neutral-300 text-neutral-700 text-sm font-medium"
                  >
                    팔로잉
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFollowToggle}
                    className="w-full py-2 rounded-full bg-primary-700 text-white text-sm font-medium"
                  >
                    팔로우
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 탭 row */}
        <div className="mx-auto w-full max-w-[560px] flex border-b border-neutral-200">
          <button
            type="button"
            onClick={() => setActiveTab(0)}
            className={[
              'flex-1 py-2.5 text-sm text-center transition-colors',
              activeTab === 0
                ? 'font-semibold text-primary-700 border-b-2 border-primary-700'
                : 'text-neutral-400',
            ].join(' ')}
          >
            스냅
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(1)}
            className={[
              'flex-1 py-2.5 text-sm text-center transition-colors',
              activeTab === 1
                ? 'font-semibold text-primary-700 border-b-2 border-primary-700'
                : 'text-neutral-400',
            ].join(' ')}
          >
            아티클
          </button>
        </div>
      </div>

      {/* 콘텐츠 영역 — 좌우 스와이프 */}
      <div
        className="overflow-x-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex"
          style={{
            width: '200%',
            transform: `translateX(-${activeTab * 50}%)`,
            transition: 'transform 200ms ease',
          }}
        >
          {/* 스냅 탭 */}
          <div className="w-1/2">
            {snaps.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-3 gap-px">
                {snaps.map((snap) => (
                  <button
                    key={snap.id}
                    type="button"
                    onClick={() => router.push(`/${profile.username}/${snap.id}`)}
                    className="aspect-square bg-neutral-100 overflow-hidden"
                  >
                    {snap.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={snap.images[0].url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-200" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 아티클 탭 */}
          <div className="w-1/2">
            {articles.length === 0 ? (
              <EmptyState />
            ) : (
              <ul>
                {articles.map((article) => (
                  <li key={article.id} className="border-b border-neutral-100">
                    <button
                      type="button"
                      onClick={() => router.push(`/${profile.username}/${article.id}`)}
                      className="w-full px-5 py-4 flex items-start gap-3 text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-900 text-[15px] leading-snug">
                          {article.title}
                        </p>
                        <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <p className="text-xs text-neutral-400 mt-1.5 flex items-center gap-1">
                          <Clock size={12} strokeWidth={1.5} />
                          {article.readingTime}분 읽기
                        </p>
                      </div>
                      {article.coverImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={article.coverImage}
                          alt=""
                          className="w-12 h-12 rounded-[var(--radius-sm)] object-cover flex-shrink-0"
                        />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-20">
      <BookOpen size={32} strokeWidth={1.5} className="text-neutral-300" />
      <p className="text-sm text-neutral-400">아직 게시물이 없어요</p>
    </div>
  )
}
