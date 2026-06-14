'use client'

import { Bookmark } from 'lucide-react'

interface BookmarkButtonProps {
  isBookmarked: boolean
  onToggle: () => void
  /** 접근성 레이블 (선택, 기본값 제공) */
  label?: string
}

/**
 * 북마크 토글 버튼 (UI only).
 *
 * 사용 예:
 *   <BookmarkButton
 *     isBookmarked={isBookmarked}
 *     onToggle={() => setIsBookmarked((v) => !v)}
 *   />
 */
export function BookmarkButton({
  isBookmarked,
  onToggle,
  label,
}: BookmarkButtonProps) {
  const ariaLabel = label ?? (isBookmarked ? '북마크 해제' : '북마크 추가')

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={ariaLabel}
      aria-pressed={isBookmarked}
      className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-sm)] transition-colors duration-200 ease-in-out hover:bg-neutral-100"
    >
      <Bookmark
        size={20}
        strokeWidth={1.5}
        className={
          isBookmarked
            ? 'fill-primary-700 stroke-primary-700'
            : 'fill-transparent stroke-neutral-400'
        }
      />
    </button>
  )
}
