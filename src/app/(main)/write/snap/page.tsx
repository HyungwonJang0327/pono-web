'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { X, ImagePlus } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { LoginRequired } from '@/components/ui'
import { compressImage } from '@/lib/image'
import {
  getPresignedUrl,
  uploadToS3,
  createSnapPost,
} from '@/services/post.service'

const MAX_IMAGES = 5
const MAX_CAPTION = 500

interface SelectedImage {
  /** 브라우저 preview URL (createObjectURL) */
  previewUrl: string
  file: File
  contentType: string
}

export default function WriteSnapPage() {
  const router = useRouter()
  const toast = useToast()
  const { isLoaded, isSignedIn, getToken } = useAuth()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [images, setImages] = useState<SelectedImage[]>([])
  const [caption, setCaption] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ── 이미지 선택 핸들러 ─────────────────────────────────────────────────────

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    const remaining = MAX_IMAGES - images.length
    const toAdd = files.slice(0, remaining)

    const newImages: SelectedImage[] = toAdd.map((file) => ({
      previewUrl: URL.createObjectURL(file),
      file,
      contentType: file.type || 'image/jpeg',
    }))

    setImages((prev) => [...prev, ...newImages])
    // input 초기화 (같은 파일 재선택 허용)
    e.target.value = ''
  }

  function removeImage(idx: number) {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].previewUrl)
      return prev.filter((_, i) => i !== idx)
    })
  }

  // ── 게시 ───────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (images.length === 0 || isSubmitting) return

    setIsSubmitting(true)
    try {
      const token = await getToken()
      if (!token) {
        toast.error('로그인이 필요합니다.')
        return
      }

      // 1) 각 이미지를 압축 + presigned URL 발급 + S3 업로드
      const uploadedImages = await Promise.all(
        images.map(async (img) => {
          const { blob, width, height } = await compressImage(img.file)
          const { uploadUrl, fileUrl } = await getPresignedUrl(
            img.file.name,
            img.contentType,
            token,
          )
          await uploadToS3(uploadUrl, blob, img.contentType)
          return { url: fileUrl, width, height }
        }),
      )

      // 2) POST /posts
      await createSnapPost(
        {
          type: 'snap',
          images: uploadedImages,
          caption: caption.trim() || undefined,
        },
        token,
      )

      toast.success('스냅이 게시되었습니다.')
      router.push('/')
    } catch {
      toast.error('게시에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const canSubmit = images.length > 0 && !isSubmitting

  if (isLoaded && !isSignedIn) return <LoginRequired />

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
        <span className="text-[15px] font-semibold text-neutral-900">새 스냅</span>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={[
            'text-[14px] font-semibold px-3 py-1.5 rounded-[var(--radius-sm)] transition-colors',
            canSubmit
              ? 'bg-primary-700 text-white'
              : 'bg-neutral-300 text-neutral-500 cursor-not-allowed',
          ].join(' ')}
        >
          {isSubmitting ? '게시 중...' : '게시'}
        </button>
      </div>

      <div className="max-w-[560px] mx-auto px-4 pt-5 flex flex-col gap-5">
        {/* 이미지 선택 영역 */}
        <div className="flex flex-col gap-3">
          {/* 트레이: 선택된 이미지 썸네일 + 추가 버튼 */}
          <div className="flex flex-wrap gap-2">
            {images.map((img, idx) => (
              <div
                key={img.previewUrl}
                className="relative w-[calc(33.333%-6px)] aspect-square rounded-[var(--radius-xl)] overflow-hidden bg-neutral-200 shrink-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.previewUrl}
                  alt={`선택된 이미지 ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  aria-label={`이미지 ${idx + 1} 삭제`}
                  onClick={() => removeImage(idx)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-neutral-900/60 flex items-center justify-center text-white"
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
              </div>
            ))}

            {/* 추가 버튼 (이미지가 있고 최대 장수 미만일 때만 노출) */}
            {images.length > 0 && images.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-[calc(33.333%-6px)] aspect-square rounded-[var(--radius-xl)] border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center gap-1.5 text-neutral-400 bg-white hover:bg-neutral-50 transition-colors"
              >
                <ImagePlus size={22} strokeWidth={1.5} />
                <span className="text-[11px] font-medium">
                  {images.length === 0 ? '사진 추가' : `${images.length}/${MAX_IMAGES}`}
                </span>
              </button>
            )}
          </div>

          {/* 안내 텍스트 */}
          {images.length === 0 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-52 rounded-[var(--radius-xl)] border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center gap-2.5 text-neutral-400 bg-white hover:bg-neutral-50 transition-colors"
            >
              <ImagePlus size={32} strokeWidth={1.5} />
              <div className="text-center">
                <p className="text-[14px] font-medium text-neutral-600">사진을 추가하세요</p>
                <p className="text-[12px] text-neutral-400 mt-0.5">최대 {MAX_IMAGES}장</p>
              </div>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* 캡션 입력 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-neutral-600" htmlFor="caption">
            캡션
          </label>
          <div className="relative">
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value.slice(0, MAX_CAPTION))}
              placeholder="이 순간에 대해 써보세요..."
              rows={4}
              className="w-full bg-neutral-200 rounded-[var(--radius-sm)] px-3.5 py-3 text-[14px] text-neutral-900 placeholder:text-neutral-400 resize-none outline-none focus:ring-2 focus:ring-primary-500/30"
            />
            <span
              className={[
                'absolute bottom-2.5 right-3 text-[11px]',
                caption.length >= MAX_CAPTION ? 'text-red-400' : 'text-neutral-400',
              ].join(' ')}
            >
              {caption.length}/{MAX_CAPTION}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

