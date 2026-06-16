'use client'

// 렌더링 전략: 클라이언트 컴포넌트 (hide-on-scroll 스크롤 리스너 필요)

import { useEffect, useRef, useState } from 'react'

export interface HeaderProps {
  isWebView?: boolean // 추후 WebView 분기용 (현재 미사용)
}

export default function Header({ isWebView }: HeaderProps) {
  const [isHidden, setIsHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (y > lastScrollY.current && y > 60) {
        setIsHidden(true)
      } else if (y < lastScrollY.current) {
        setIsHidden(false)
      }
      lastScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.headerHidden = isHidden ? 'true' : 'false'
  }, [isHidden])

  return (
    <header
      className={[
        'sticky top-0 z-20 bg-neutral-50 border-b border-neutral-200 transition-transform duration-200',
        isHidden ? '-translate-y-full' : 'translate-y-0',
      ].join(' ')}
    >
      <div className="mx-auto w-full max-w-[560px] px-5 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-700 italic tracking-tight">Pono</h1>
        <div className="flex items-center gap-3">
          {/* 알림 버튼 */}
          <button className="relative w-7 h-7 flex items-center justify-center text-neutral-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-primary-500 rounded-full border border-neutral-50" />
          </button>
          {/* 프로필 버튼 — 추후 Clerk avatar로 교체 예정 */}
          <button className="w-7 h-7 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center text-neutral-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
