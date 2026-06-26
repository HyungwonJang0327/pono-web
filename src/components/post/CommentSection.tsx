'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Trash2, X } from 'lucide-react'
import { useAuth, useClerk } from '@clerk/nextjs'
import { useToast } from '@/hooks/useToast'
import { getComments, createComment, deleteComment } from '@/services/comment.service'
import type { CommentDto, ReplyDto } from '@/types/comment'

interface Props {
  postId: string
  currentUser: { id: string; username: string; avatar: string | null } | null
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
  return new Date(iso).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
}

function Avatar({ src, username, size }: { src: string | null; username: string; size: number }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={username}
        width={size}
        height={size}
        className="rounded-full object-cover flex-none"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <div
      className="rounded-full bg-neutral-200 flex items-center justify-center flex-none"
      style={{ width: size, height: size }}
    >
      <span className="text-neutral-600 font-semibold" style={{ fontSize: size * 0.4 }}>
        {username[0]?.toUpperCase() ?? '?'}
      </span>
    </div>
  )
}

function ReplyItem({
  reply,
  currentUserId,
  onDelete,
}: {
  reply: ReplyDto
  currentUserId: string | null
  onDelete: (commentId: string) => void
}) {
  return (
    <div className="ml-10 flex gap-2.5 py-3 border-t border-neutral-100">
      <Avatar src={reply.author.avatar} username={reply.author.username} size={32} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[13px] font-semibold text-neutral-900">{reply.author.username}</span>
          <span className="text-[11px] text-neutral-400">{formatRelativeTime(reply.createdAt)}</span>
        </div>
        <p className="text-[13px] text-neutral-800 leading-[1.5] whitespace-pre-wrap break-words">{reply.body}</p>
      </div>
      {currentUserId === reply.author.id && (
        <button
          type="button"
          aria-label="댓글 삭제"
          onClick={() => onDelete(reply.id)}
          className="flex-none self-start mt-0.5 p-1 text-neutral-400 hover:text-neutral-600"
        >
          <Trash2 size={14} strokeWidth={1.5} />
        </button>
      )}
    </div>
  )
}

function CommentItem({
  comment,
  currentUserId,
  onDelete,
  onReply,
}: {
  comment: CommentDto
  currentUserId: string | null
  onDelete: (commentId: string) => void
  onReply: (username: string, parentId: string) => void
}) {
  const [repliesOpen, setRepliesOpen] = useState(false)

  return (
    <div className="border-t border-neutral-100">
      <div className="flex gap-2.5 py-3">
        <Avatar src={comment.author.avatar} username={comment.author.username} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[13px] font-semibold text-neutral-900">{comment.author.username}</span>
            <span className="text-[11px] text-neutral-400">{formatRelativeTime(comment.createdAt)}</span>
          </div>
          <p className="text-[13px] text-neutral-800 leading-[1.5] whitespace-pre-wrap break-words">{comment.body}</p>
          <button
            type="button"
            onClick={() => onReply(comment.author.username, comment.id)}
            className="mt-1 text-[11px] text-neutral-400 font-medium"
          >
            답글
          </button>
        </div>
        {currentUserId === comment.author.id && (
          <button
            type="button"
            aria-label="댓글 삭제"
            onClick={() => onDelete(comment.id)}
            className="flex-none self-start mt-0.5 p-1 text-neutral-400 hover:text-neutral-600"
          >
            <Trash2 size={14} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {comment.replies.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setRepliesOpen((v) => !v)}
            className="ml-10 mb-2 text-[12px] text-primary-700 font-medium"
          >
            {repliesOpen ? '답글 접기' : `답글 ${comment.replies.length}개 보기`}
          </button>
          {repliesOpen &&
            comment.replies.map((reply) => (
              <ReplyItem
                key={reply.id}
                reply={reply}
                currentUserId={currentUserId}
                onDelete={onDelete}
              />
            ))}
        </>
      )}
    </div>
  )
}

export default function CommentSection({ postId, currentUser }: Props) {
  const { isSignedIn, getToken } = useAuth()
  const { openSignIn } = useClerk()
  const toast = useToast()

  const [comments, setComments] = useState<CommentDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyTarget, setReplyTarget] = useState<{ username: string; parentId: string } | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 댓글 목록 로드
  useEffect(() => {
    let cancelled = false
    async function load() {
      setIsLoading(true)
      try {
        const token = isSignedIn ? (await getToken()) ?? undefined : undefined
        const data = await getComments(postId, token)
        if (!cancelled) setComments(data.comments)
      } catch {
        // 에러 시 빈 목록 유지
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  // textarea 높이 자동 확장
  function handleBodyChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setBody(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 96) + 'px'
  }

  // 댓글/대댓글 삭제
  const handleDelete = useCallback(
    async (commentId: string) => {
      try {
        const token = await getToken()
        if (!token) throw new Error('no token')
        await deleteComment(postId, commentId, token)
        setComments((prev) => {
          // 루트 댓글 삭제
          const withoutRoot = prev.filter((c) => c.id !== commentId)
          if (withoutRoot.length !== prev.length) return withoutRoot
          // 대댓글 삭제
          return prev.map((c) => ({
            ...c,
            replies: c.replies.filter((r) => r.id !== commentId),
          }))
        })
      } catch {
        toast.error('댓글 삭제에 실패했어요')
      }
    },
    [postId, getToken, toast],
  )

  // 답글 타겟 설정
  function handleReply(username: string, parentId: string) {
    setReplyTarget({ username, parentId })
    textareaRef.current?.focus()
  }

  // 댓글 게시
  async function handleSubmit() {
    if (!body.trim() || isSubmitting) return
    if (!isSignedIn) {
      openSignIn()
      return
    }
    setIsSubmitting(true)
    try {
      const token = await getToken()
      if (!token) throw new Error('no token')
      const newComment = await createComment(postId, body.trim(), token, replyTarget?.parentId)
      setComments((prev) => {
        if (replyTarget?.parentId) {
          return prev.map((c) =>
            c.id === replyTarget.parentId
              ? { ...c, replies: [...c.replies, newComment as unknown as ReplyDto] }
              : c,
          )
        }
        return [...prev, newComment]
      })
      setBody('')
      setReplyTarget(null)
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } catch {
      toast.error('댓글 게시에 실패했어요')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentUserId = currentUser?.id ?? null

  return (
    <>
      {/* 댓글 목록 */}
      <div>
        {isLoading ? null : comments.length === 0 ? (
          <p className="text-sm text-neutral-400 text-center py-6">아직 댓글이 없어요</p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onDelete={handleDelete}
              onReply={handleReply}
            />
          ))
        )}
      </div>

      {/* 댓글 입력창 (fixed) */}
      <div
        className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-neutral-200"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* 대댓글 대상 표시 */}
        {replyTarget && (
          <div className="mx-auto w-full max-w-[560px] px-4 pt-2 flex items-center justify-between">
            <span className="text-[12px] text-neutral-500">
              → {replyTarget.username}에게 답글 중
            </span>
            <button
              type="button"
              aria-label="답글 취소"
              onClick={() => setReplyTarget(null)}
              className="p-1 text-neutral-400"
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </div>
        )}
        <div className="mx-auto w-full max-w-[560px] px-4 py-3 flex items-center gap-3 min-h-[72px]">
          <Avatar
            src={currentUser?.avatar ?? null}
            username={currentUser?.username ?? '?'}
            size={32}
          />
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={body}
              onChange={handleBodyChange}
              readOnly={!isSignedIn}
              placeholder="댓글 달기..."
              rows={1}
              maxLength={200}
              onFocus={() => { if (!isSignedIn) openSignIn() }}
              className="w-full bg-neutral-100 rounded-full px-4 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 resize-none outline-none"
              style={{ maxHeight: '96px' }}
            />
            {body.length > 0 && (
              <span className="absolute right-3 -bottom-4 text-[10px] text-neutral-400">
                {body.length}/200
              </span>
            )}
          </div>
          {body.trim().length > 0 && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="text-sm font-semibold text-primary-700 disabled:opacity-50 flex-none"
            >
              게시
            </button>
          )}
        </div>
      </div>
    </>
  )
}
