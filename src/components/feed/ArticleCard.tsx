'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { useAuth, useClerk } from '@clerk/nextjs'
import { useTranslations } from 'next-intl'
import { useToast } from '@/hooks/useToast'
import { addLike, removeLike } from '@/services/post.service'
import { ArticleFeedItemDto } from '@/types/post'
import { ArticleLikeButton } from '@/components/ui'

interface ArticleCardProps {
  post: ArticleFeedItemDto
}

function AvatarFallback({ username }: { username: string | null }) {
  return (
    <div className="w-5 h-5 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0">
      <span className="text-[10px] font-semibold text-neutral-600 leading-none">
        {username ? username.charAt(0).toUpperCase() : '?'}
      </span>
    </div>
  )
}

export default function ArticleCard({ post }: ArticleCardProps) {
  const { isSignedIn, getToken } = useAuth()
  const { openSignIn } = useClerk()
  const toast = useToast()
  const t = useTranslations('articleCard')
  const tProfile = useTranslations('profile')
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

  const detailHref = post.author.username
    ? `/${post.author.username}/${post.id}`
    : null

  const coverBlock = post.coverImage && (
    <div className="relative w-full aspect-[16/9]">
      {/* 사용자 업로드 원격 이미지(S3). 동적 URL이라 next/image 대신 img 사용. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={post.coverImage}
        alt={post.title ?? undefined}
        className="w-full h-full object-cover"
      />
    </div>
  )

  const textBlock = (
    <>
      <h2 className="text-[15px] font-bold text-neutral-900 leading-[1.4] tracking-tight mb-1.5 line-clamp-2">
        {post.title ?? t('noTitle')}
      </h2>
      <p className="text-[11px] text-neutral-600 leading-[1.6] mb-2.5 line-clamp-2">
        {post.excerpt}
      </p>
    </>
  )

  return (
    <div className="bg-white rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-card)]">
      {/* 커버 이미지 16:9 (상세로 이동) */}
      {coverBlock &&
        (detailHref ? <Link href={detailHref}>{coverBlock}</Link> : coverBlock)}

      {/* 본문 */}
      <div className="px-3 pt-3 pb-3.5">
        {detailHref ? (
          <Link href={detailHref} className="block">
            {textBlock}
          </Link>
        ) : (
          textBlock
        )}
        <div className="flex items-center gap-2">
          {post.author.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.author.avatar}
              alt={post.author.username ?? undefined}
              className="w-5 h-5 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <AvatarFallback username={post.author.username} />
          )}
          <span className="text-[11px] text-neutral-700 flex-1 truncate">
            {post.author.username ?? ''}
          </span>
          {post.readingTime != null && (
            <span className="text-[10px] text-neutral-500">
              {tProfile('readingTime', { minutes: post.readingTime })}
            </span>
          )}
          <ArticleLikeButton
            isLiked={likedByMe}
            count={likeCount}
            onToggle={handleLikeToggle}
          />
        </div>
      </div>
    </div>
  )
}
