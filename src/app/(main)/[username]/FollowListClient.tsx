'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useUser } from '@clerk/nextjs'
import { useToastContext } from '@/components/ui'
import { followUser, unfollowUser } from '@/services/user.service'
import type { FollowUserDto } from '@/types/user'

interface Props {
  list: FollowUserDto[]
  activeTab: 'followers' | 'following'
  username: string
}

function getSubText(user: FollowUserDto): { text: string; muted: boolean } {
  if (user.bio) return { text: user.bio, muted: false }
  if (user.recentActivity) {
    const label = user.recentActivity.type === 'article' ? '아티클 발행' : '스냅 게시'
    return { text: `${user.recentActivity.daysAgo}일 전 ${label}`, muted: false }
  }
  return { text: `@${user.username ?? ''}`, muted: true }
}

export default function FollowListClient({ list, activeTab, username }: Props) {
  const router = useRouter()
  const { getToken } = useAuth()
  const { user: clerkUser } = useUser()
  const toast = useToastContext()

  const [following, setFollowing] = useState<Record<string, boolean>>(
    () => Object.fromEntries(list.map((u) => [u.id, u.isFollowedByMe])),
  )

  const handleToggle = async (userId: string) => {
    const prev = following[userId]
    setFollowing((s) => ({ ...s, [userId]: !prev }))
    try {
      const token = (await getToken()) ?? ''
      if (prev) {
        await unfollowUser(userId, token)
      } else {
        await followUser(userId, token)
      }
    } catch {
      setFollowing((s) => ({ ...s, [userId]: prev }))
      toast.error('오류가 발생했어요')
    }
  }

  return (
    <div className="mx-auto w-full max-w-[560px]">
      {/* 탭 헤더 */}
      <div className="flex border-b border-neutral-100">
        {(['followers', 'following'] as const).map((tab) => {
          const label = tab === 'followers' ? '팔로워' : '팔로잉'
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              type="button"
              onClick={() => router.push(`/${username}/${tab}`)}
              className={[
                'flex-1 py-3 text-sm text-center',
                isActive
                  ? 'text-primary-700 border-b-2 border-primary-700 font-semibold'
                  : 'text-neutral-400',
              ].join(' ')}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* 빈 상태 */}
      {list.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-neutral-400">아직 없어요</p>
        </div>
      )}

      {/* 목록 */}
      <ul>
        {list.map((user) => {
          const isMe = clerkUser?.username === user.username
          const isFollowing = following[user.id] ?? false
          const subText = getSubText(user)

          return (
            <li
              key={user.id}
              className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100"
            >
              {/* 아바타 56px */}
              <div className="w-14 h-14 rounded-full bg-neutral-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-neutral-600 text-sm font-semibold">
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar} alt={user.username ?? ''} className="w-full h-full object-cover" />
                ) : (
                  <span>{(user.username ?? '?')[0].toUpperCase()}</span>
                )}
              </div>

              {/* 유저 정보 */}
              <div className="flex-1 min-w-0">
                <p className="text-base font-normal text-neutral-900 leading-tight">
                  {user.username}
                </p>
                <p className={['text-sm truncate mt-0.5', subText.muted ? 'text-neutral-400' : 'text-neutral-500'].join(' ')}>
                  {subText.text}
                </p>
                <p className="text-[13px] text-neutral-400 mt-0.5">
                  팔로워 {user.followerCount.toLocaleString()}
                </p>
              </div>

              {/* 팔로우 버튼 (본인 제외) */}
              {!isMe && (
                <button
                  type="button"
                  onClick={() => handleToggle(user.id)}
                  className={[
                    'w-[74px] h-10 rounded-[9px] text-sm flex-shrink-0',
                    isFollowing
                      ? 'bg-[#EFEDE6] text-neutral-500'
                      : 'border border-[#E4E0D6] text-primary-700 bg-white',
                  ].join(' ')}
                >
                  {isFollowing ? '팔로잉' : '팔로우'}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
