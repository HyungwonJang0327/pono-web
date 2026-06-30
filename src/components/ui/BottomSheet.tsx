'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

/**
 * 바텀 시트 레이아웃 공통 껍데기 (UI only).
 * 내부 content는 children으로 주입.
 *
 * - 오버레이: rgba(28,25,23,0.4), 클릭 시 닫힘
 * - 시트 본체: white, border-radius 16px 16px 0 0, shadow-md
 * - 핸들 바: 32×4px, neutral-300, rounded-full
 * - 콘텐츠 패딩: 16px 20px + safe-area-inset-bottom
 * - 진입: translateY(100%) → 0, 300ms ease-out
 * - 퇴장: translateY(0) → 100%, 250ms ease-in
 *
 * 사용 예:
 *   <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *     <p>시트 내용</p>
 *   </BottomSheet>
 */
export function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  // isOpen이 true가 되면 즉시 마운트(파생값), 퇴장 애니메이션 동안엔 isClosing으로 유지
  // isAnimating: 진입 클래스 적용 여부 (false면 퇴장 애니메이션)
  const [isClosing, setIsClosing] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)
  // 한 번이라도 열린 적이 있는지 (초기 닫힘 상태에서 퇴장 애니메이션 오발동 방지)
  const wasOpenRef = useRef(false)

  // 마운트 여부는 effect의 동기 setState 없이 props/state에서 파생
  const isVisible = isOpen || isClosing

  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true
      // 마운트된 다음 프레임에 진입 애니메이션 적용 (rAF 콜백 = 비동기 setState)
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsClosing(false)
          setIsAnimating(true)
        })
      })
      return () => cancelAnimationFrame(raf)
    }
    // 처음부터 닫혀 있던 경우엔 아무 것도 하지 않는다
    if (!wasOpenRef.current) return
    // 열려 있던 시트가 닫힐 때: 다음 프레임에 퇴장 애니메이션 시작, 마운트는 transitionend까지 유지
    const raf = requestAnimationFrame(() => {
      setIsClosing(true)
      setIsAnimating(false)
    })
    return () => cancelAnimationFrame(raf)
  }, [isOpen])

  // 퇴장 애니메이션 끝난 후 DOM 제거
  function handleTransitionEnd() {
    if (!isAnimating) {
      setIsClosing(false)
    }
  }

  // ESC 키로 닫기
  useEffect(() => {
    if (!isVisible) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVisible, onClose])

  // 시트 열려있을 때 body 스크롤 잠금
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isVisible])

  if (!isVisible) return null

  return createPortal(
    <>
      {/* 딤드 오버레이 */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          background: 'rgba(28, 25, 23, 0.4)',
          opacity: isAnimating ? 1 : 0,
          transition: isAnimating
            ? 'opacity 300ms ease-out'
            : 'opacity 250ms ease-in',
        }}
      />

      {/* 시트 본체 */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        onTransitionEnd={handleTransitionEnd}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 51,
          background: '#FFFFFF',
          borderRadius: '16px 16px 0 0',
          boxShadow: '0 4px 16px rgba(28,25,23,0.10)',
          transform: isAnimating ? 'translateY(0)' : 'translateY(100%)',
          transition: isAnimating
            ? 'transform 300ms ease-out'
            : 'transform 250ms ease-in',
        }}
      >
        {/* 핸들 영역 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '12px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '4px',
              background: '#D4D1CA',
              borderRadius: '9999px',
            }}
          />
        </div>

        {/* 콘텐츠 영역 */}
        <div
          style={{
            padding: '16px 20px',
            paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
          }}
        >
          {children}
        </div>
      </div>
    </>,
    document.body,
  )
}
