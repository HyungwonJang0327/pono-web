'use client'

import { useState } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { useToastContext } from '@/components/ui'
import { followUser, unfollowUser } from '@/services/user.service'
import type { FollowUserDto } from '@/types/user'

interface Props {
  list: FollowUserDto[]
  title: string
}

export default function FollowListClient({ list, title }: Props) {
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

  if (list.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-neutral-400">아직 없어요</p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[560px]">
      <ul>
        {list.map((user) => {
          const isMe = clerkUser?.username === user.username
          const isFollowing = following[user.id] ?? false

          return (
            <li
              key={user.id}
              className="flex items-center gap-3 px-5 py-3 border-b border-neutral-100"
            >
              {/* 아바타 */}
              <div className="w-9 h-9 rounded-full bg-neutral-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-neutral-600 text-sm font-semibold">
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar} alt={user.username ?? ''} className="w-full h-full object-cover" />
                ) : (
                  <span>{(user.username ?? '?')[0].toUpperCase()}</span>
                )}
              </div>

              {/* 유저 정보 */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 leading-tight">
                  {user.username}
                </p>
                {user.bio && (
                  <p className="text-xs text-neutral-500 truncate mt-0.5">{user.bio}</p>
                )}
              </div>

              {/* 팔로우 버튼 (본인 제외) */}
              {!isMe && (
                <button
                  type="button"
                  onClick={() => handleToggle(user.id)}
                  className={[
                    'px-3 py-1 rounded-full text-sm flex-shrink-0',
                    isFollowing
                      ? 'border border-neutral-300 text-neutral-700'
                      : 'bg-primary-700 text-white',
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
