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

  return (
    <header
      className={[
        'sticky top-0 z-20 bg-neutral-50 border-b border-neutral-200 transition-transform duration-200',
        isHidden ? '-translate-y-full' : 'translate-y-0',
      ].join(' ')}
    >
      <div className="mx-auto w-full max-w-[560px] px-5 py-3 flex items-center justify-between">
        <div className="w-6" />
        <h1 className="text-xl font-bold text-primary-700 italic tracking-tight">Pono</h1>
        <button className="relative w-6 h-6 flex items-center justify-center text-neutral-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-primary-500 rounded-full border border-neutral-50" />
        </button>
      </div>
    </header>
  )
}
