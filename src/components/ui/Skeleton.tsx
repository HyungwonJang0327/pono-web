// 서버 컴포넌트로 사용 가능 (인터랙션 없음)

interface SkeletonProps {
  /** rect(기본): 직사각형 스켈레톤 / circle: 원형 스켈레톤 */
  variant?: 'rect' | 'circle'
  /** 크기·모양을 외부에서 제어하는 Tailwind 클래스 (예: "w-full h-4") */
  className?: string
}

/**
 * 로딩 스켈레톤 컴포넌트.
 *
 * 사용 예:
 *   <Skeleton className="w-full h-48" />                  // rect (기본)
 *   <Skeleton variant="circle" className="w-10 h-10" />   // 원형
 */
export function Skeleton({ variant = 'rect', className = '' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        'animate-skeleton-pulse bg-neutral-200',
        variant === 'circle' ? 'rounded-full' : 'rounded-[var(--radius-sm)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
