'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Quote,
  Link as LinkIcon,
  ImageIcon,
  X,
} from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { compressImage } from '@/lib/image'
import {
  getPresignedUrl,
  uploadToS3,
  createArticlePost,
  updateArticlePost,
} from '@/services/post.service'

// ── 자동저장 디바운스 (30초) ──────────────────────────────────────────────────
const AUTOSAVE_DELAY_MS = 30_000

type SaveStatus = 'idle' | 'saving' | 'saved'

// ── 툴바 버튼 공통 컴포넌트 ──────────────────────────────────────────────────

interface ToolbarBtnProps {
  onClick: () => void
  isActive?: boolean
  label: string
  children: React.ReactNode
}

function ToolbarBtn({ onClick, isActive, label, children }: ToolbarBtnProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onMouseDown={(e) => {
        e.preventDefault()
        onClick()
      }}
      className={[
        'w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] transition-colors',
        isActive
          ? 'bg-primary-700 text-white'
          : 'text-neutral-600 hover:bg-neutral-200',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

export default function WriteArticlePage() {
  const router = useRouter()
  const toast = useToast()
  const { isLoaded, isSignedIn, getToken } = useAuth()

  const [title, setTitle] = useState('')
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [isPublishing, setIsPublishing] = useState(false)
  const [draftId, setDraftId] = useState<string | null>(null)
  const [isLinkInputOpen, setIsLinkInputOpen] = useState(false)
  const [linkHref, setLinkHref] = useState('')

  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const editorImageInputRef = useRef<HTMLInputElement>(null)

  // ── TipTap 에디터 ─────────────────────────────────────────────────────────

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
      }),
      Link.configure({ openOnClick: false, autolink: false }),
      Image.configure({ inline: false }),
      Placeholder.configure({
        placeholder: '내용을 입력하세요...',
      }),
    ],
    editorProps: {
      attributes: {
        class: [
          'prose prose-neutral max-w-none min-h-[300px] outline-none',
          'font-serif text-[16px] leading-relaxed text-neutral-900',
          '[&_.ProseMirror-focused]:outline-none',
          '[&_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
          '[&_p.is-editor-empty:first-child::before]:text-neutral-400',
          '[&_p.is-editor-empty:first-child::before]:float-left',
          '[&_p.is-editor-empty:first-child::before]:pointer-events-none',
          '[&_p.is-editor-empty:first-child::before]:h-0',
        ].join(' '),
      },
    },
  })

  // ── 자동저장 트리거 ───────────────────────────────────────────────────────

  const scheduleAutosave = useCallback(() => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current)
    }
    autosaveTimerRef.current = setTimeout(async () => {
      if (!title.trim() && !editor?.getText().trim()) return

      setSaveStatus('saving')
      try {
        const token = await getToken()
        if (!token) return

        const body = editor?.getJSON() ?? {}

        if (draftId) {
          await updateArticlePost(draftId, { title, body, isDraft: true }, token)
        } else {
          const result = await createArticlePost(
            { type: 'article', title, body, isDraft: true },
            token,
          )
          setDraftId(result.id)
        }
        setSaveStatus('saved')
      } catch {
        setSaveStatus('idle')
      }
    }, AUTOSAVE_DELAY_MS)
  }, [title, editor, getToken, draftId])

  // 제목 변경 시 자동저장 예약
  useEffect(() => {
    if (title) scheduleAutosave()
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title])

  // 에디터 내용 변경 시 자동저장 예약
  useEffect(() => {
    if (!editor) return undefined
    const handler = () => scheduleAutosave()
    editor.on('update', handler)
    return () => { editor.off('update', handler) }
  }, [editor, scheduleAutosave])

  // ── 커버 이미지 ───────────────────────────────────────────────────────────

  async function handleCoverImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    try {
      const token = await getToken()
      if (!token) { toast.error('로그인이 필요합니다.'); return }

      // 미리보기
      const localUrl = URL.createObjectURL(file)
      setCoverPreview(localUrl)

      const { blob } = await compressImage(file)
      const { uploadUrl, fileUrl } = await getPresignedUrl(file.name, file.type || 'image/jpeg', token)
      await uploadToS3(uploadUrl, blob, file.type || 'image/jpeg')

      URL.revokeObjectURL(localUrl)
      setCoverImage(fileUrl)
      setCoverPreview(fileUrl)
    } catch {
      toast.error('커버 이미지 업로드에 실패했습니다.')
      setCoverPreview(null)
    }
  }

  function removeCoverImage() {
    if (coverPreview && coverPreview !== coverImage) URL.revokeObjectURL(coverPreview)
    setCoverImage(null)
    setCoverPreview(null)
  }

  // ── 에디터 내 이미지 삽입 ─────────────────────────────────────────────────

  async function handleEditorImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !editor) return
    e.target.value = ''

    try {
      const token = await getToken()
      if (!token) { toast.error('로그인이 필요합니다.'); return }

      const { blob } = await compressImage(file)
      const { uploadUrl, fileUrl } = await getPresignedUrl(file.name, file.type || 'image/jpeg', token)
      await uploadToS3(uploadUrl, blob, file.type || 'image/jpeg')

      editor.chain().focus().setImage({ src: fileUrl }).run()
    } catch {
      toast.error('이미지 업로드에 실패했습니다.')
    }
  }

  // ── 링크 삽입 ─────────────────────────────────────────────────────────────

  function applyLink() {
    if (!editor) return
    const url = linkHref.trim()
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
    setIsLinkInputOpen(false)
    setLinkHref('')
  }

  // ── 게시 ─────────────────────────────────────────────────────────────────

  async function handlePublish() {
    if (!title.trim() || isPublishing) return

    setIsPublishing(true)
    try {
      const token = await getToken()
      if (!token) { toast.error('로그인이 필요합니다.'); return }

      const body = editor?.getJSON() ?? {}

      let result
      if (draftId) {
        result = await updateArticlePost(
          draftId,
          { title, body, coverImage: coverImage ?? undefined, isDraft: false },
          token,
        )
      } else {
        result = await createArticlePost(
          { type: 'article', title, body, coverImage: coverImage ?? undefined, isDraft: false },
          token,
        )
      }

      toast.success('아티클이 게시되었습니다.')
      // 포스트 상세 페이지로 이동
      router.push(`/${result.author.username}/${result.id}`)
    } catch {
      toast.error('게시에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setIsPublishing(false)
    }
  }

  const canPublish = title.trim().length > 0 && !isPublishing

  if (isLoaded && !isSignedIn) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-[15px] text-neutral-700 font-medium">로그인이 필요한 페이지입니다.</p>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-[14px] text-primary-700 font-medium"
        >
          뒤로가기
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* 상단 헤더 */}
      <div className="sticky top-0 z-10 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between px-4 h-14">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-[14px] text-neutral-600 font-medium"
        >
          취소
        </button>

        {/* 저장 상태 */}
        <span className="text-[12px] text-neutral-400">
          {saveStatus === 'saving' && '저장 중...'}
          {saveStatus === 'saved' && '저장됨'}
        </span>

        <button
          type="button"
          onClick={handlePublish}
          disabled={!canPublish}
          className={[
            'text-[14px] font-semibold px-3 py-1.5 rounded-[var(--radius-sm)] transition-colors',
            canPublish
              ? 'bg-primary-700 text-white'
              : 'bg-neutral-300 text-neutral-500 cursor-not-allowed',
          ].join(' ')}
        >
          {isPublishing ? '게시 중...' : '게시'}
        </button>
      </div>

      <div className="max-w-[560px] mx-auto px-4 pt-5 flex flex-col gap-4">
        {/* 커버 이미지 */}
        {coverPreview ? (
          <div className="relative w-full aspect-[16/9] rounded-[var(--radius-lg)] overflow-hidden bg-neutral-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverPreview} alt="커버 이미지" className="w-full h-full object-cover" />
            <button
              type="button"
              aria-label="커버 이미지 삭제"
              onClick={removeCoverImage}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-neutral-900/60 flex items-center justify-center text-white"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            className="w-full h-20 rounded-[var(--radius-lg)] border-2 border-dashed border-neutral-300 flex items-center justify-center gap-2 text-neutral-400 bg-white hover:bg-neutral-50 transition-colors"
          >
            <ImageIcon size={18} strokeWidth={1.5} />
            <span className="text-[13px] font-medium">커버 이미지 추가 (선택)</span>
          </button>
        )}
        <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverImageChange} />

        {/* 제목 */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="w-full bg-transparent text-[22px] font-bold text-neutral-900 placeholder:text-neutral-300 outline-none"
        />

        {/* 구분선 */}
        <hr className="border-neutral-200" />

        {/* 툴바 */}
        <div className="sticky top-14 z-10 bg-neutral-100 rounded-[var(--radius-sm)] flex flex-wrap items-center gap-0.5 p-1.5">
          <ToolbarBtn
            label="굵게"
            isActive={editor?.isActive('bold')}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <Bold size={15} strokeWidth={2} />
          </ToolbarBtn>
          <ToolbarBtn
            label="기울임"
            isActive={editor?.isActive('italic')}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <Italic size={15} strokeWidth={2} />
          </ToolbarBtn>
          <ToolbarBtn
            label="제목 1"
            isActive={editor?.isActive('heading', { level: 1 })}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            <Heading1 size={15} strokeWidth={2} />
          </ToolbarBtn>
          <ToolbarBtn
            label="제목 2"
            isActive={editor?.isActive('heading', { level: 2 })}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 size={15} strokeWidth={2} />
          </ToolbarBtn>
          <ToolbarBtn
            label="인용구"
            isActive={editor?.isActive('blockquote')}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          >
            <Quote size={15} strokeWidth={2} />
          </ToolbarBtn>
          <ToolbarBtn
            label="링크"
            isActive={editor?.isActive('link')}
            onClick={() => {
              const prev = editor?.getAttributes('link').href ?? ''
              setLinkHref(prev)
              setIsLinkInputOpen((v) => !v)
            }}
          >
            <LinkIcon size={15} strokeWidth={2} />
          </ToolbarBtn>
          <ToolbarBtn
            label="이미지 삽입"
            onClick={() => editorImageInputRef.current?.click()}
          >
            <ImageIcon size={15} strokeWidth={2} />
          </ToolbarBtn>

          {/* 링크 URL 입력 인라인 */}
          {isLinkInputOpen && (
            <div className="w-full flex gap-2 mt-1.5 px-1">
              <input
                type="url"
                value={linkHref}
                onChange={(e) => setLinkHref(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') applyLink() }}
                placeholder="https://..."
                className="flex-1 bg-white border border-neutral-300 rounded-[var(--radius-sm)] px-2.5 py-1 text-[13px] outline-none focus:border-primary-500"
                autoFocus
              />
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); applyLink() }}
                className="px-3 py-1 bg-primary-700 text-white text-[13px] font-medium rounded-[var(--radius-sm)]"
              >
                적용
              </button>
            </div>
          )}
        </div>

        <input ref={editorImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleEditorImageChange} />

        {/* 에디터 본문 */}
        <div className="font-serif">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  )
}

