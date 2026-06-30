'use client'

import { useCallback, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

interface LikeButtonProps {
  isLiked: boolean
  count?: number
  onToggle: () => void
  /** 활성 상태 색상 (stroke + fill) */
  activeColor: string
  /** 활성 상태 카운트 텍스트 색상 */
  activeCountColor: string
}

const HEART_PATH =
  'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'

/**
 * 공통 LikeButton 내부 구현.
 * SnapLikeButton / ArticleLikeButton에서 activeColor만 달리해서 사용.
 */
function LikeButtonBase({
  isLiked,
  count,
  onToggle,
  activeColor,
  activeCountColor,
}: LikeButtonProps) {
  const t = useTranslations('like')
  const [isPopping, setIsPopping] = useState(false)
  const prevIsLikedRef = useRef(isLiked)

  const handleClick = useCallback(() => {
    const wasLiked = prevIsLikedRef.current
    onToggle()
    prevIsLikedRef.current = !wasLiked

    // 비활성 → 활성 전환 시에만 팝 애니메이션
    if (!wasLiked) {
      setIsPopping(true)
    }
  }, [onToggle])

  function handleAnimationEnd() {
    setIsPopping(false)
  }

  const strokeColor = isLiked ? activeColor : '#B5B1A8'
  const fillColor = isLiked ? activeColor : 'transparent'
  const countColor = isLiked ? activeCountColor : '#908C83'

  const hasCount = count !== undefined

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isLiked ? t('unlike') : t('like')}
      aria-pressed={isLiked}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3px',
        width: '32px',
        height: hasCount ? 'auto' : '32px',
        minHeight: hasCount ? '32px' : undefined,
        padding: hasCount ? '4px 0' : '0',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        borderRadius: '6px',
        transition: 'background 200ms ease-in-out',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.background = '#F5F4F0'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width={20}
        height={20}
        fill={fillColor}
        xmlns="http://www.w3.org/2000/svg"
        onAnimationEnd={handleAnimationEnd}
        style={{
          display: 'block',
          strokeWidth: 1.5,
          stroke: strokeColor,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          transition: 'stroke 200ms ease-in-out, fill 200ms ease-in-out',
          animation: isPopping ? 'var(--animate-like-pop)' : undefined,
        }}
      >
        <path d={HEART_PATH} />
      </svg>

      {hasCount && (
        <span
          style={{
            fontSize: '12px',
            fontWeight: 500,
            lineHeight: 1,
            color: countColor,
            transition: 'color 200ms ease-in-out',
          }}
        >
          {count}
        </span>
      )}
    </button>
  )
}

/* ─────────────────────────────────────────
   SnapLikeButton — 활성 색상: primary-500 (#2D8463)
───────────────────────────────────────── */

interface SnapLikeButtonProps {
  isLiked: boolean
  count?: number
  onToggle: () => void
}

/**
 * 스냅 카드용 좋아요 버튼.
 * 활성 색상: primary-500 (#2D8463)
 *
 * 사용 예:
 *   <SnapLikeButton
 *     isLiked={isLiked}
 *     count={24}
 *     onToggle={() => setIsLiked(v => !v)}
 *   />
 */
export function SnapLikeButton({ isLiked, count, onToggle }: SnapLikeButtonProps) {
  return (
    <LikeButtonBase
      isLiked={isLiked}
      count={count}
      onToggle={onToggle}
      activeColor="#2D8463"
      activeCountColor="#2D8463"
    />
  )
}
