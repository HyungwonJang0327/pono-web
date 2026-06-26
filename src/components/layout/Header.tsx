'use client'

// 렌더링 전략: 클라이언트 컴포넌트 (hide-on-scroll 스크롤 리스너, usePathname 필요)

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth, useUser, SignInButton } from '@clerk/nextjs'
import { ChevronLeft } from 'lucide-react'

export interface HeaderProps {
  isWebView?: boolean
  myUsername?: string | null
}

// 뒤로가기 버튼을 항상 숨기는 경로 목록
const NO_BACK_PATHS = ['/', '/onboarding/username']

export default function Header({ isWebView, myUsername }: HeaderProps) {
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const pathname = usePathname()
  const router = useRouter()
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

  // write 페이지는 자체 헤더를 가지고 있으므로 레이아웃 헤더를 렌더링하지 않음
  if (pathname.startsWith('/write/')) return null

  // 좌측 영역 결정
  // - WebView: 로고 고정 (네이티브 백 처리)
  // - NO_BACK_PATHS: 로고 표시 (뒤로가기 없음)
  // - 그 외: ChevronLeft 버튼
  const showLogo = isWebView === true || NO_BACK_PATHS.includes(pathname)

  return (
    <header
      className={[
        'sticky top-0 z-20 bg-neutral-50 border-b border-neutral-200 transition-transform duration-200',
        isHidden ? '-translate-y-full' : 'translate-y-0',
      ].join(' ')}
    >
      <div className="mx-auto w-full max-w-[560px] px-5 py-3 flex items-center justify-between">
        {/* 좌측: 로고 or 뒤로가기 버튼 */}
        {showLogo ? (
          <h1 className="text-xl font-bold text-primary-700 italic tracking-tight">Pono</h1>
        ) : (
          <button
            type="button"
            aria-label="뒤로 가기"
            onClick={() => router.back()}
            className="w-11 h-11 -ml-2 flex items-center justify-center text-neutral-900"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
        )}

        {/* 우측: 알림 + 프로필 */}
        <div className="flex items-center gap-3">
          {/* 알림 버튼 — MVP에서 알림 기능 없음, 뱃지 미표시 */}
          <button className="w-7 h-7 flex items-center justify-center text-neutral-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          {/* 프로필 버튼 */}
          {isSignedIn && myUsername && user ? (
            <button
              type="button"
              aria-label="내 프로필"
              onClick={() => router.push(`/${myUsername}`)}
              className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center bg-neutral-200 text-neutral-700 text-xs font-semibold flex-shrink-0"
            >
              {user.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.imageUrl} alt={user.username ?? '프로필'} className="w-full h-full object-cover" />
              ) : (
                <span>{(user.username ?? user.firstName ?? '?')[0].toUpperCase()}</span>
              )}
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="w-7 h-7 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center text-neutral-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  )
}
