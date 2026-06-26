'use client'

import { useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useClerk, useUser } from '@clerk/nextjs'
import { MoreHorizontal, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { SnapLikeButton } from '@/components/ui/SnapLikeButton'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { useToast } from '@/hooks/useToast'
import { addLike, removeLike, updatePost, deletePost } from '@/services/post.service'
import CommentSection from '@/components/post/CommentSection'
import type { SnapDetailDto } from '@/types/post'

interface Props {
  post: SnapDetailDto
  isWebView: boolean
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return '방금'
  if (mins < 60) return `${mins}분 전`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}일 전`
  return new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function SnapDetailPage({ post, isWebView }: Props) {
  const router = useRouter()
  const { isSignedIn, getToken } = useAuth()
  const { openSignIn } = useClerk()
  const { user } = useUser()
  const toast = useToast()

  const currentUser = user
    ? { username: user.username ?? '', avatar: user.imageUrl ?? null }
    : null

  // 좋아요 낙관적 업데이트 state
  const [likedByMe, setLikedByMe] = useState(post.likedByMe)
  const [likeCount, setLikeCount] = useState(post.likeCount)

  // 캐러셀 state
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  // 캡션 편집 state
  const [caption, setCaption] = useState(post.caption ?? '')
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(caption)
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false)

  // 바텀시트 / 삭제 다이얼로그 state
  const [sheetOpen, setSheetOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // 댓글 구간 ref
  const commentSectionRef = useRef<HTMLDivElement>(null)

  // 이미지 비율 결정 (첫 번째 이미지 기준)
  const firstImage = post.images[0]
  const isPortrait = firstImage && firstImage.height / firstImage.width >= 1.15
  const aspectClass = isPortrait ? 'aspect-[4/5]' : 'aspect-square'

  // 캐러셀 스크롤 핸들러
  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    const index = Math.round(el.scrollLeft / el.clientWidth)
    setCurrentIndex(index)
  }

  // 좋아요 토글
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
      toast.error('좋아요 처리에 실패했어요')
    }
  }, [isSignedIn, likedByMe, likeCount, post.id, getToken, openSignIn, toast])

  // 댓글 구간으로 스크롤
  function handleCommentScroll() {
    commentSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // 캡션 수정 완료
  async function handleCaptionSave() {
    if (isSaving) return
    setIsSaving(true)
    try {
      const token = await getToken()
      if (!token) throw new Error('no token')
      await updatePost(post.id, { caption: editValue }, token)
      setCaption(editValue)
      setIsEditing(false)
    } catch {
      toast.error('수정에 실패했어요')
    } finally {
      setIsSaving(false)
    }
  }

  function handleCaptionCancel() {
    setEditValue(caption)
    setIsEditing(false)
  }

  // 삭제
  async function handleDelete() {
    if (isDeleting) return
    setIsDeleting(true)
    try {
      const token = await getToken()
      if (!token) throw new Error('no token')
      await deletePost(post.id, token)
      router.back()
    } catch {
      toast.error('삭제에 실패했어요')
      setIsDeleting(false)
    }
  }

  const hasMultipleImages = post.images.length > 1

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-neutral-50 border-b border-neutral-200 h-[52px] flex items-center justify-between px-4">
        {/* 웹 전용 뒤로가기 */}
        {!isWebView && (
          <button
            type="button"
            aria-label="뒤로 가기"
            onClick={() => router.back()}
            className="w-10 h-10 -ml-1 flex items-center justify-center text-neutral-900"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        {isWebView && <div />}
        {/* 본인 게시물일 때만 더보기 버튼 */}
        {post.isOwnedByMe ? (
          <button
            type="button"
            aria-label="더보기"
            onClick={() => setSheetOpen(true)}
            className="w-10 h-10 flex items-center justify-center text-neutral-700"
          >
            <MoreHorizontal size={22} strokeWidth={1.5} />
          </button>
        ) : (
          <div />
        )}
      </div>

      {/* 이미지 캐러셀 */}
      <div className="relative w-full">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className={[
            'flex overflow-x-auto snap-x snap-mandatory scrollbar-hide',
            aspectClass,
          ].join(' ')}
          style={{ scrollbarWidth: 'none' }}
        >
          {post.images.map((img, i) => (
            <div
              key={i}
              className={['flex-none w-full snap-start relative', aspectClass].join(' ')}
            >
              <Image
                src={img.url}
                alt={`이미지 ${i + 1}`}
                fill
                className="object-cover"
                priority={i === 0}
                sizes="(max-width: 560px) 100vw, 560px"
              />
            </div>
          ))}
        </div>

        {/* 인디케이터 — 이미지 2장 이상일 때만 */}
        {hasMultipleImages && (
          <div
            className="absolute top-3 right-3 px-2 py-1 rounded-full text-white text-xs font-medium"
            style={{ background: 'rgba(28,25,23,0.45)', lineHeight: '1' }}
          >
            {currentIndex + 1}/{post.images.length}
          </div>
        )}
      </div>

      {/* 본문 영역 */}
      <div className="px-4">
        {/* 작성자 행 */}
        <button
          type="button"
          onClick={() => router.push(`/${post.author.username}`)}
          className="flex items-center gap-2 mt-4 w-full text-left"
        >
          <div className="w-8 h-8 rounded-full bg-neutral-200 overflow-hidden flex-none">
            {post.author.avatar ? (
              <Image src={post.author.avatar} alt={post.author.username} width={32} height={32} className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs font-semibold">
                {post.author.username[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <span className="text-sm font-semibold text-neutral-900">{post.author.username}</span>
          <span className="text-xs text-neutral-600">{formatRelativeTime(post.createdAt)}</span>
        </button>

        {/* 캡션 구간 */}
        {(caption || post.isOwnedByMe) && (
          <div className="mt-2">
            {isEditing ? (
              <div className="rounded-[var(--radius-md)] bg-neutral-200 p-3">
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                  maxLength={500}
                  rows={4}
                  className="w-full bg-transparent text-sm text-neutral-900 resize-none outline-none"
                />
                <div className="flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={handleCaptionCancel}
                    className="text-sm text-neutral-500 font-medium"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={handleCaptionSave}
                    disabled={isSaving}
                    className="text-sm text-primary-700 font-semibold disabled:opacity-50"
                  >
                    완료
                  </button>
                </div>
              </div>
            ) : caption ? (
              <div>
                <p
                  className={[
                    'text-sm text-neutral-900 whitespace-pre-wrap',
                    !isCaptionExpanded ? 'line-clamp-3' : '',
                  ].join(' ')}
                >
                  {caption}
                </p>
                {!isCaptionExpanded && caption.length > 120 && (
                  <button
                    type="button"
                    onClick={() => setIsCaptionExpanded(true)}
                    className="text-sm text-primary-700 font-medium mt-0.5"
                  >
                    더 보기
                  </button>
                )}
                {isCaptionExpanded && (
                  <button
                    type="button"
                    onClick={() => setIsCaptionExpanded(false)}
                    className="text-sm text-primary-700 font-medium mt-0.5"
                  >
                    접기
                  </button>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* 액션 행 */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <SnapLikeButton isLiked={likedByMe} onToggle={handleLikeToggle} />
            <span className="text-sm text-neutral-700">{likeCount}</span>
          </div>
          <button
            type="button"
            onClick={handleCommentScroll}
            className="flex items-center gap-1.5"
          >
            <MessageCircle size={20} strokeWidth={1.5} className="text-neutral-400" />
            <span className="text-sm text-neutral-700">{post.commentCount}</span>
          </button>
        </div>

        {/* 구분선 */}
        <div className="mt-4 border-t border-neutral-200" />

        {/* 댓글 구간 */}
        <div ref={commentSectionRef} className="py-4">
          <CommentSection postId={post.id} currentUser={currentUser} />
        </div>

        {/* 하단 여백 */}
        <div className="pb-[72px]" />
      </div>

      {/* 수정/삭제 바텀시트 */}
      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)}>
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => {
              setSheetOpen(false)
              setEditValue(caption)
              setIsEditing(true)
            }}
            className="py-4 text-left text-[15px] text-neutral-900 font-medium border-b border-neutral-100"
          >
            캡션 수정
          </button>
          <button
            type="button"
            onClick={() => {
              setSheetOpen(false)
              setDeleteDialogOpen(true)
            }}
            className="py-4 text-left text-[15px] font-medium"
            style={{ color: '#B54040' }}
          >
            게시물 삭제
          </button>
          <button
            type="button"
            onClick={() => setSheetOpen(false)}
            className="py-4 text-left text-[15px] text-neutral-500 font-medium"
          >
            취소
          </button>
        </div>
      </BottomSheet>

      {/* 삭제 확인 다이얼로그 */}
      {deleteDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(28,25,23,0.4)' }}
          onClick={() => setDeleteDialogOpen(false)}
        >
          <div
            className="w-full max-w-[320px] bg-white rounded-[var(--radius-lg)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[15px] font-semibold text-neutral-900 mb-2">게시물을 삭제할까요?</p>
            <p className="text-sm text-neutral-500 mb-6">삭제된 게시물은 복구할 수 없어요</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteDialogOpen(false)}
                className="flex-1 py-2.5 rounded-[var(--radius-md)] border border-neutral-200 text-sm font-medium text-neutral-700"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: '#B54040' }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
