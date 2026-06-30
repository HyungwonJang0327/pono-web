'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const LOCALE_LABELS: Record<string, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
}

const CARD_SHADOW = '0 1px 4px rgba(28,25,23,0.06)'

interface SettingsClientProps {
  username: string
  avatar: string | null
  locale: string | null
}

export default function SettingsClient({
  username,
  avatar,
  locale,
}: SettingsClientProps) {
  const router = useRouter()

  const localeLabel = LOCALE_LABELS[locale ?? 'ko'] ?? '한국어'

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
        {/* 프로필 요약 카드 */}
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

        {/* 앱 설정 섹션 */}
        <div className="mt-7">
          <p className="text-[12px] text-[#6B6760] mb-2">앱 설정</p>
          <button
            type="button"
            // TODO: 언어 선택 바텀시트 (Figma 노드 확정 후 구현)
            onClick={() => {}}
            className="w-full h-[52px] rounded-[10px] bg-white px-4 flex items-center text-left"
            style={{ boxShadow: CARD_SHADOW }}
          >
            <span className="flex-1 text-[15px] text-neutral-900">언어</span>
            <span className="text-[13px] text-[#6B6760]">{localeLabel}</span>
            <ChevronRight size={16} strokeWidth={1.5} className="ml-1 text-[#B5B1A8]" />
          </button>
        </div>
      </div>
    </div>
  )
}
