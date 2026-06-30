'use client'

import { useCallback, useState } from 'react'
import { useAuth, useClerk } from '@clerk/nextjs'
import { useTranslations } from 'next-intl'
import { useToast } from '@/hooks/useToast'
import { addLike, removeLike } from '@/services/post.service'
import { SnapFeedItemDto } from '@/types/post'
import { SnapLikeButton } from '@/components/ui'

interface SnapMiniCardProps {
  post: SnapFeedItemDto
  aspectRatio: '1/1' | '4/5'
}

function AvatarFallback({ username }: { username: string | null }) {
  return (
    <div className="w-4 h-4 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0">
      <span className="text-[9px] font-semibold text-neutral-600 leading-none">
        {username ? username.charAt(0).toUpperCase() : '?'}
      </span>
    </div>
  )
}

export default function SnapMiniCard({ post, aspectRatio }: SnapMiniCardProps) {
  const { isSignedIn, getToken } = useAuth()
  const { openSignIn } = useClerk()
  const toast = useToast()
  const tLike = useTranslations('like')

  const [likedByMe, setLikedByMe] = useState(post.likedByMe)
  const [likeCount, setLikeCount] = useState(post.likeCount)

  const handleLikeToggle = useCallback(async () => {
    if (!isSignedIn) {
      openSignIn()
      return
    }
    const prev = { likedByMe, likeCount }
    setLikedByMe((v) => !v)
    setLikeCount((v) => (likedByMe ? v - 1 : v + 1))
    try {
      const token = await getToken()
      if (!token) throw new Error('no token')
      if (likedByMe) {
        await removeLike(post.id, token)
      } else {
        await addLike(post.id, token)
      }
    } catch {
      setLikedByMe(prev.likedByMe)
      setLikeCount(prev.likeCount)
      toast.error(tLike('error'))
    }
  }, [isSignedIn, likedByMe, likeCount, post.id, getToken, openSignIn, toast, tLike])

  const image = post.images[0]
  const aspectClass = aspectRatio === '4/5' ? 'aspect-[4/5]' : 'aspect-square'

  return (
    <div className="bg-white rounded-[var(--radius-md)] overflow-hidden shadow-[var(--shadow-card)]">
      {/* 이미지 */}
      <div className={`relative w-full ${aspectClass} bg-neutral-200`}>
        {image?.url && (
          // 사용자 업로드 원격 이미지(S3). 동적 URL이라 next/image 대신 img 사용.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.url}
            alt={post.caption ?? undefined}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* 캡션 + 메타 */}
      <div className="px-2.5 pt-2 pb-2.5">
        {post.caption && (
          <p className="text-[11px] text-neutral-800 leading-[1.4] mb-1.5 line-clamp-2">
            {post.caption}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 min-w-0">
            {post.author.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.author.avatar}
                alt={post.author.username ?? undefined}
                className="w-4 h-4 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <AvatarFallback username={post.author.username} />
            )}
            <span className="text-[10px] text-neutral-500 truncate max-w-[60px]">
              {post.author.username ?? ''}
            </span>
          </div>
          <SnapLikeButton
            isLiked={likedByMe}
            count={likeCount}
            onToggle={handleLikeToggle}
          />
        </div>
      </div>
    </div>
  )
}
