'use client'

// 렌더링 전략: 클라이언트 컴포넌트
// usePathname()으로 활성 탭 하이라이트 처리.
// FAB는 /write 라우트로 이동하는 Link로 교체.

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

export interface BottomNavProps {
  isWebView?: boolean // 추후 WebView 숨김 처리용 (현재 미사용)
}

export default function BottomNav({ isWebView: _isWebView }: BottomNavProps) {
  const pathname = usePathname()
  const t = useTranslations('nav')

  const isHomeActive = pathname === '/'
  const isExploreActive = pathname === '/explore'
  const isProfileActive = pathname.startsWith('/') && pathname !== '/' && pathname !== '/explore' && !pathname.startsWith('/write')

  return (
    <nav className="sticky bottom-0 z-10 bg-neutral-50 border-t border-neutral-300 lg:hidden">
      <div className="mx-auto w-full max-w-[560px] flex items-center justify-around px-5 pt-2.5 pb-6">
        <button className={`flex flex-col items-center gap-0.5 ${isHomeActive ? 'text-primary-700' : 'text-neutral-400'}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className="text-[9px] font-medium">{t('home')}</span>
        </button>

        <button className={`flex flex-col items-center gap-0.5 ${isExploreActive ? 'text-primary-700' : 'text-neutral-400'}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <span className="text-[9px] font-medium">{t('explore')}</span>
        </button>

        {/* FAB */}
        <Link
          href="/write"
          className="w-12 h-12 -mt-5 bg-primary-700 rounded-full flex items-center justify-center shadow-[var(--shadow-md)] text-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </Link>

        <button className={`flex flex-col items-center gap-0.5 ${isProfileActive ? 'text-primary-700' : 'text-neutral-400'}`}>
          <div className="w-5.5 h-5.5 rounded-full bg-neutral-300" />
          <span className="text-[9px] font-medium">{t('profile')}</span>
        </button>

        <div className="w-10" />
      </div>
    </nav>
  )
}
