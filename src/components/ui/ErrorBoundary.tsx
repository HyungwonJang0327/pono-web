'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'

// ── 타입 ──────────────────────────────────────────────────────────────────────

interface ErrorBoundaryProps {
  children: ReactNode
  /** 커스텀 fallback UI. 제공하지 않으면 기본 fallback 렌더링 */
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

// ── 기본 Fallback UI ──────────────────────────────────────────────────────────

interface DefaultFallbackProps {
  onRetry: () => void
}

function DefaultFallback({ onRetry }: DefaultFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-[10px] py-10 px-6 text-center">
      <svg
        className="w-12 h-12 mb-1.5"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M24 6L44 40H4L24 6Z"
          stroke="#D4D1CA"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path d="M24 20V28" stroke="#D4D1CA" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="33" r="1.5" fill="#D4D1CA" />
      </svg>
      <p className="text-[15px] font-semibold text-neutral-700 tracking-[-0.2px]">
        문제가 생겼어요
      </p>
      <p className="text-[13px] text-neutral-500 leading-relaxed">
        잠시 후 다시 시도해 주세요.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 px-5 py-[10px] rounded-[var(--radius-md)] bg-primary-700 text-white text-[13px] font-semibold hover:bg-primary-800 transition-colors duration-200 ease-in-out"
      >
        다시 시도
      </button>
    </div>
  )
}

// ── ErrorBoundary ─────────────────────────────────────────────────────────────

/**
 * React class 컴포넌트 기반 에러 경계.
 *
 * 사용 예:
 *   <ErrorBoundary>
 *     <SomeComponent />
 *   </ErrorBoundary>
 *
 *   // 커스텀 fallback
 *   <ErrorBoundary fallback={<MyErrorUI />}>
 *     <SomeComponent />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
    this.handleRetry = this.handleRetry.bind(this)
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // 프로덕션에서는 에러 리포팅 서비스로 전송 가능
    if (process.env.NODE_ENV !== 'production') {
      console.error('[ErrorBoundary] caught:', error, info.componentStack)
    }
  }

  handleRetry() {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback
      }
      return <DefaultFallback onRetry={this.handleRetry} />
    }

    return this.props.children
  }
}
