'use client'

import { useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useClerk, useUser } from '@clerk/nextjs'
import { MoreHorizontal, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { ArticleLikeButton } from '@/components/ui/ArticleLikeButton'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { useToast } from '@/hooks/useToast'
import { useErrorMessage } from '@/hooks/useErrorMessage'
import { addLike, removeLike, deletePost } from '@/services/post.service'
import CommentSection from '@/components/post/CommentSection'
import type { ArticleDetailDto } from '@/types/post'

interface Props {
  post: ArticleDetailDto
  isWebView: boolean
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

/**
 * TipTap JSON → HTML 문자열 변환 (서버/클라이언트 모두 사용 가능)
 * TipTap v3에 generateHTML이 없으므로 직접 구현.
 * 지원 노드: doc, paragraph, heading, blockquote, codeBlock, bulletList,
 *             orderedList, listItem, hardBreak, horizontalRule, image, text
 * 지원 마크: bold, italic, code, link
 */
function tiptapToHtml(node: { type: string; content?: unknown[]; attrs?: Record<string, unknown>; marks?: { type: string; attrs?: Record<string, unknown> }[]; text?: string }): string {
  if (!node) return ''

  const children = Array.isArray(node.content)
    ? (node.content as typeof node[]).map(tiptapToHtml).join('')
    : ''

  // 텍스트 노드에 마크 적용
  if (node.type === 'text') {
    let html = escapeHtml(node.text ?? '')
    for (const mark of node.marks ?? []) {
      if (mark.type === 'bold') html = `<strong>${html}</strong>`
      else if (mark.type === 'italic') html = `<em>${html}</em>`
      else if (mark.type === 'code') html = `<code>${html}</code>`
      else if (mark.type === 'link') {
        const href = escapeHtml(String(mark.attrs?.href ?? ''))
        html = `<a href="${href}" target="_blank" rel="noopener noreferrer">${html}</a>`
      }
    }
    return html
  }

  switch (node.type) {
    case 'doc':
      return children
    case 'paragraph':
      return `<p>${children || '<br>'}</p>`
    case 'heading': {
      const level = Number(node.attrs?.level ?? 1)
      return `<h${level}>${children}</h${level}>`
    }
    case 'blockquote':
      return `<blockquote>${children}</blockquote>`
    case 'codeBlock':
      return `<pre><code>${children}</code></pre>`
    case 'bulletList':
      return `<ul>${children}</ul>`
    case 'orderedList':
      return `<ol>${children}</ol>`
    case 'listItem':
      return `<li>${children}</li>`
    case 'hardBreak':
      return '<br>'
    case 'horizontalRule':
      return '<hr>'
    case 'image': {
      const src = escapeHtml(String(node.attrs?.src ?? ''))
      const alt = escapeHtml(String(node.attrs?.alt ?? ''))
      return `<img src="${src}" alt="${alt}" style="width:100%;height:auto;border-radius:var(--radius-lg)">`
    }
    default:
      return children
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default function ArticleDetailPage({ post, isWebView }: Props) {
  const router = useRouter()
  const { isSignedIn, getToken } = useAuth()
  const { openSignIn } = useClerk()
  const { user } = useUser()
  const toast = useToast()
  const getErrorMessage = useErrorMessage()

  const currentUser = user
    ? { username: user.username ?? '', avatar: user.imageUrl ?? null }
    : null

  const [likedByMe, setLikedByMe] = useState(post.likedByMe)
  const [likeCount, setLikeCount] = useState(post.likeCount)
  const likeInFlightRef = useRef(false)

  const [sheetOpen, setSheetOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const commentSectionRef = useRef<HTMLDivElement>(null)

  const handleLikeToggle = useCallback(async () => {
    if (!isSignedIn) {
      openSignIn()
      return
    }
    if (likeInFlightRef.current) return
    likeInFlightRef.current = true
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
    } catch (err) {
      setLikedByMe(prev.likedByMe)
      setLikeCount(prev.likeCount)
      toast.error(getErrorMessage(err))
    } finally {
      likeInFlightRef.current = false
    }
  }, [isSignedIn, likedByMe, likeCount, post.id, getToken, openSignIn, toast, getErrorMessage])

  function handleCommentScroll() {
    commentSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  async function handleDelete() {
    if (isDeleting) return
    setIsDeleting(true)
    try {
      const token = await getToken()
      if (!token) throw new Error('no token')
      await deletePost(post.id, token)
      router.back()
    } catch (err) {
      toast.error(getErrorMessage(err))
      setIsDeleting(false)
    }
  }

  const bodyHtml = tiptapToHtml(post.body as Parameters<typeof tiptapToHtml>[0])

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-neutral-50 border-b border-neutral-200 h-[52px] flex items-center justify-between px-4">
        {!isWebView ? (
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
        ) : (
          <div />
        )}
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

      {/* 커버 이미지 */}
      {post.coverImage && (
        <div className="relative w-full aspect-video">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 560px) 100vw, 560px"
          />
        </div>
      )}

      {/* 아티클 본문 컨테이너 */}
      <div className="px-5">
        {/* 제목 */}
        <h1
          className="text-2xl font-bold text-neutral-900 leading-tight"
          style={{ marginTop: post.coverImage ? '24px' : '24px' }}
        >
          {post.title}
        </h1>

        {/* 메타 행 */}
        <div className="flex items-center gap-2 mt-4">
          <button
            type="button"
            onClick={() => router.push(`/${post.author.username}`)}
            className="flex items-center gap-2"
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
          </button>
          <span className="text-neutral-400 text-sm">·</span>
          <span className="text-sm text-neutral-500">{post.readingTime}분</span>
          <span className="text-neutral-400 text-sm">·</span>
          <span className="text-sm text-neutral-500">{formatDate(post.createdAt)}</span>
        </div>

        {/* 구분선 */}
        <div className="mt-6 border-t border-neutral-200" />

        {/* 본문 */}
        <div
          className="mt-6 font-serif article-body"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        {/* 액션 행 */}
        <div className="flex items-center gap-4 mt-8">
          <div className="flex items-center gap-1.5">
            <ArticleLikeButton isLiked={likedByMe} onToggle={handleLikeToggle} />
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

        <div className="pb-[72px]" />
      </div>

      {/* 수정/삭제 바텀시트 */}
      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)}>
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => {
              setSheetOpen(false)
              router.push(`/write/article?postId=${post.id}`)
            }}
            className="py-4 text-left text-[15px] text-neutral-900 font-medium border-b border-neutral-100"
          >
            아티클 수정
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

      {/* 아티클 본문 스타일 */}
      <style>{`
        .article-body {
          font-size: 16px;
          line-height: 1.8;
          color: #1C1917;
        }
        .article-body p {
          margin-bottom: 1em;
        }
        .article-body h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          color: #1C1917;
        }
        .article-body h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          color: #1C1917;
        }
        .article-body h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1.25em;
          margin-bottom: 0.5em;
          color: #1C1917;
        }
        .article-body blockquote {
          border-left: 3px solid #D4D1CA;
          padding-left: 1rem;
          color: #6B6760;
          margin: 1em 0;
          font-style: italic;
        }
        .article-body pre {
          background: #F5F4F0;
          border-radius: 6px;
          padding: 1rem;
          overflow-x: auto;
          margin: 1em 0;
        }
        .article-body code {
          background: #E8E6E1;
          border-radius: 4px;
          padding: 0.15em 0.35em;
          font-size: 14px;
          font-family: monospace;
        }
        .article-body pre code {
          background: transparent;
          padding: 0;
        }
        .article-body ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin: 1em 0;
        }
        .article-body ol {
          list-style: decimal;
          padding-left: 1.5rem;
          margin: 1em 0;
        }
        .article-body li {
          margin-bottom: 0.25em;
        }
        .article-body a {
          color: #1F4D3A;
          text-decoration: underline;
        }
        .article-body hr {
          border: none;
          border-top: 1px solid #E8E6E1;
          margin: 2em 0;
        }
        .article-body strong {
          font-weight: 700;
        }
        .article-body em {
          font-style: italic;
        }
      `}</style>
    </div>
  )
}
