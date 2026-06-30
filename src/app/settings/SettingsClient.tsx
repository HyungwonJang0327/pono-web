'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useClerk } from '@clerk/nextjs'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { BottomSheet, useToastContext } from '@/components/ui'
import { NetworkErrorState } from '@/components/ui/NetworkErrorState'
import { updateUserProfile } from '@/services/user.service'

const LOCALE_LABELS: Record<string, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
}

const LOCALES = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
] as const

function persistLocaleCookie(value: string) {
  document.cookie = `locale=${value}; path=/; max-age=31536000; SameSite=Lax`
}

const CARD_SHADOW = '0 1px 4px rgba(28,25,23,0.06)'

interface SettingsClientProps {
  username: string | null
  avatar: string | null
  locale: string | null
  /** 로그인 상태인데 /users/me 조회가 실패한 경우 true */
  loadFailed?: boolean
}

export default function SettingsClient({
  username,
  avatar,
  locale,
  loadFailed = false,
}: SettingsClientProps) {
  const router = useRouter()
  const { isSignedIn, getToken } = useAuth()
  const { openSignIn } = useClerk()
  const toast = useToastContext()

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [currentLocale, setCurrentLocale] = useState(locale ?? 'ko')

  const localeLabel = LOCALE_LABELS[currentLocale] ?? '한국어'

  const handleSelectLocale = async (selected: string) => {
    if (selected === currentLocale) {
      setIsSheetOpen(false)
      return
    }
    const previous = currentLocale
    setCurrentLocale(selected)
    try {
      if (isSignedIn) {
        const token = (await getToken()) ?? ''
        await updateUserProfile({ locale: selected }, token)
      }
      persistLocaleCookie(selected)
      router.refresh()
      setIsSheetOpen(false)
    } catch {
      setCurrentLocale(previous)
      toast.error('오류가 발생했어요')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-neutral-50 border-b border-[#D4D1CA]">
        <div className="mx-auto w-full max-w-[560px] h-[52px] flex items-center px-4">
          <button
            type="button"
            aria-label="뒤로 가기"
            onClick={() => router.back()}
            className="w-10 h-10 -ml-2 flex items-center justify-center text-neutral-900"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
          <span className="flex-1 text-center text-[17px] font-semibold text-neutral-900 -ml-8">
            설정
          </span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[560px] px-4">
        {/* 프로필 요약 카드 (로그인) / 로그인하기 row (비로그인) */}
        {username ? (
          <button
            type="button"
            aria-label="프로필 편집"
            onClick={() => router.push('/settings/profile')}
            className="mt-6 w-full h-[72px] rounded-[10px] bg-white px-4 flex items-center text-left"
            style={{ boxShadow: CARD_SHADOW }}
          >
            <div
              className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-white text-[15px] font-semibold shrink-0"
              style={{
                background: avatar
                  ? undefined
                  : 'linear-gradient(135deg, #7FA68C, #3F6B53)',
              }}
            >
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span>{username[0]?.toUpperCase()}</span>
              )}
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-neutral-900 truncate">
                {username}
              </p>
              <p className="mt-1 text-[13px] text-[#6B6760] truncate">
                @{username}
              </p>
            </div>
            <ChevronRight size={20} strokeWidth={1.5} className="text-[#B5B1A8] shrink-0" />
          </button>
        ) : loadFailed ? (
          <div
            className="mt-6 w-full rounded-[10px] bg-white"
            style={{ boxShadow: CARD_SHADOW }}
          >
            <NetworkErrorState onRetry={() => router.refresh()} />
          </div>
        ) : (
          <button
            type="button"
            aria-label="로그인하기"
            onClick={() => openSignIn()}
            className="mt-6 w-full h-[72px] rounded-[10px] bg-white px-4 flex items-center text-left"
            style={{ boxShadow: CARD_SHADOW }}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-neutral-200 text-neutral-500 shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-neutral-900 truncate">
                로그인하기
              </p>
              <p className="mt-1 text-[13px] text-[#6B6760] truncate">
                로그인하고 프로필을 관리하세요
              </p>
            </div>
            <ChevronRight size={20} strokeWidth={1.5} className="text-[#B5B1A8] shrink-0" />
          </button>
        )}

        {/* 앱 설정 섹션 */}
        <div className="mt-7">
          <p className="text-[12px] text-[#6B6760] mb-2">앱 설정</p>
          <button
            type="button"
            onClick={() => setIsSheetOpen(true)}
            className="w-full h-[52px] rounded-[10px] bg-white px-4 flex items-center text-left"
            style={{ boxShadow: CARD_SHADOW }}
          >
            <span className="flex-1 text-[15px] text-neutral-900">언어</span>
            <span className="text-[13px] text-[#6B6760]">{localeLabel}</span>
            <ChevronRight size={16} strokeWidth={1.5} className="ml-1 text-[#B5B1A8]" />
          </button>
        </div>
      </div>

      {/* 언어 선택 바텀시트 */}
      <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
        <p className="text-[17px] font-semibold text-[#1C1917]">언어 선택</p>
        <div className="mt-3 -mx-5 border-t border-[#D4D1CA]">
          {LOCALES.map((l, i) => {
            const isSelected = l.value === currentLocale
            return (
              <button
                key={l.value}
                type="button"
                onClick={() => handleSelectLocale(l.value)}
                className={[
                  'w-full h-[56px] px-5 flex items-center text-left',
                  i > 0 ? 'border-t border-[#E8E6E1]' : '',
                  isSelected ? 'bg-[#F0F7F4]' : 'bg-transparent',
                ].join(' ')}
              >
                <span className="flex-1 text-[15px] text-[#1C1917]">{l.label}</span>
                {isSelected && (
                  <Check
                    data-testid="locale-check"
                    size={20}
                    strokeWidth={1.5}
                    className="text-[#1F4D3A]"
                  />
                )}
              </button>
            )
          })}
        </div>
      </BottomSheet>
    </div>
  )
}
