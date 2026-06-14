'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

// ── 타입 ──────────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  type: ToastType
  message: string
  /** 등장 후 퇴장 애니메이션을 시작할지 여부 */
  exiting: boolean
}

type ToastAction =
  | { type: 'ADD'; payload: Omit<ToastItem, 'exiting'> }
  | { type: 'START_EXIT'; id: string }
  | { type: 'REMOVE'; id: string }

// ── 리듀서 ────────────────────────────────────────────────────────────────────

function toastReducer(state: ToastItem[], action: ToastAction): ToastItem[] {
  switch (action.type) {
    case 'ADD':
      return [...state, { ...action.payload, exiting: false }]
    case 'START_EXIT':
      return state.map((t) =>
        t.id === action.id ? { ...t, exiting: true } : t
      )
    case 'REMOVE':
      return state.filter((t) => t.id !== action.id)
    default:
      return state
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

interface ToastContextValue {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

// ── 아이콘 ────────────────────────────────────────────────────────────────────

function SuccessIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8.5L6.5 12L13 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 4L12 12M12 4L4 12" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="5" r="1" fill="white" />
      <path d="M8 7.5V12" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

const ICON: Record<ToastType, () => React.JSX.Element> = {
  success: SuccessIcon,
  error: ErrorIcon,
  info: InfoIcon,
}

// ── 개별 Toast 아이템 ─────────────────────────────────────────────────────────

const BG: Record<ToastType, string> = {
  success: 'bg-primary-700',
  error: 'bg-[#B54040]',
  info: 'bg-neutral-800',
}

interface ToastItemProps {
  item: ToastItem
  onExited: (id: string) => void
}

function ToastItemView({ item, onExited }: ToastItemProps) {
  const handleAnimationEnd = () => {
    if (item.exiting) {
      onExited(item.id)
    }
  }

  const Icon = ICON[item.type]

  return (
    <div
      onAnimationEnd={handleAnimationEnd}
      className={[
        'flex items-center gap-[10px]',
        'px-5 py-[14px] rounded-[var(--radius-md)] shadow-[var(--shadow-md)]',
        'text-white text-[14px] font-medium leading-snug',
        'min-w-[220px] max-w-[320px] w-max pointer-events-auto',
        BG[item.type],
        item.exiting ? 'animate-toast-out' : 'animate-toast-in',
      ].join(' ')}
    >
      <span className="flex items-center justify-center w-4 h-4 shrink-0">
        <Icon />
      </span>
      <span>{item.message}</span>
    </div>
  )
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, dispatch] = useReducer(toastReducer, [])
  const [mounted, setMounted] = useState(false)
  /** id별 타이머 ref. 언마운트 시 정리 */
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    dispatch({ type: 'ADD', payload: { id, type, message } })

    // 3초 후 퇴장 애니메이션 시작
    const timer = setTimeout(() => {
      dispatch({ type: 'START_EXIT', id })
    }, 3000)

    timers.current.set(id, timer)
  }, [])

  useEffect(() => { setMounted(true) }, [])

  // 언마운트 시 타이머 전체 정리
  useEffect(() => {
    const t = timers.current
    return () => {
      t.forEach(clearTimeout)
    }
  }, [])

  const handleExited = useCallback((id: string) => {
    dispatch({ type: 'REMOVE', id })
    const timer = timers.current.get(id)
    if (timer !== undefined) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const ctx: ToastContextValue = {
    success: (msg) => addToast('success', msg),
    error: (msg) => addToast('error', msg),
    info: (msg) => addToast('info', msg),
  }

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      {mounted &&
        createPortal(
          <div
            aria-live="polite"
            aria-atomic="false"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none"
          >
            {toasts.map((item) => (
              <ToastItemView
                key={item.id}
                item={item}
                onExited={handleExited}
              />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  )
}

// ── 내부 훅 (컴포넌트 트리 내에서만 사용) ────────────────────────────────────

export function useToastContext(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToastContext must be used within ToastProvider')
  }
  return ctx
}
