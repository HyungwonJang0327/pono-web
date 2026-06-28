'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { ChevronLeft, Camera } from 'lucide-react'
import { useToastContext } from '@/components/ui'
import { updateUserProfile } from '@/services/user.service'

const LOCALES = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
] as const

interface ProfileEditClientProps {
  initialUsername: string
  initialBio: string | null
  initialAvatar: string | null
  initialLocale: string | null
}

const BIO_MAX = 80

export default function ProfileEditClient({
  initialUsername,
  initialBio,
  initialAvatar,
  initialLocale,
}: ProfileEditClientProps) {
  const router = useRouter()
  const { getToken } = useAuth()
  const toast = useToastContext()

  const [username, setUsername] = useState(initialUsername)
  const [bio, setBio] = useState(initialBio ?? '')
  const [locale, setLocale] = useState(initialLocale ?? 'ko')

  const isDirty =
    username !== initialUsername ||
    bio !== (initialBio ?? '') ||
    locale !== (initialLocale ?? 'ko')

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= BIO_MAX) {
      setBio(e.target.value)
    }
  }

  const handleSave = async () => {
    try {
      const token = (await getToken()) ?? ''
      await updateUserProfile({ username, bio, locale }, token)
      document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`
      toast.success('저장되었어요')
      router.refresh()
      router.back()
    } catch {
      toast.error('저장에 실패했어요')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-neutral-50 border-b border-neutral-200">
        <div className="mx-auto w-full max-w-[560px] h-[52px] flex items-center px-5">
          <button
            type="button"
            aria-label="뒤로 가기"
            onClick={() => router.back()}
            className="w-10 h-10 -ml-2 flex items-center justify-center text-neutral-900"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
          <span className="flex-1 text-center text-[17px] font-semibold text-neutral-900 -ml-8">
            프로필 편집
          </span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[560px] px-[18px]">
        {/* 아바타 영역 */}
        <div className="flex flex-col items-center mt-8 mb-8">
          <div className="relative">
            <div
              className="w-[72px] h-[72px] rounded-full overflow-hidden flex items-center justify-center text-white text-2xl font-semibold"
              style={{
                background: initialAvatar
                  ? undefined
                  : 'linear-gradient(135deg, #7FA68C 0%, #3F6B53 100%)',
              }}
            >
              {initialAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={initialAvatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span>{initialUsername[0]?.toUpperCase()}</span>
              )}
            </div>
            {/* 카메라 배지 */}
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary-700 flex items-center justify-center">
              <Camera size={13} strokeWidth={1.5} className="text-white" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              // TODO: S3 업로드
            }}
            className="mt-2 text-[14px] text-primary-700"
          >
            사진 변경
          </button>
        </div>

        {/* 닉네임 필드 */}
        <div className="mb-6">
          <label
            htmlFor="username"
            className="block text-[14px] text-[#57534E] mb-2"
          >
            닉네임
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-[48px] px-4 rounded-[8px] bg-[#EFEDE6] text-neutral-900 text-[15px] outline-none"
          />
          <p className="mt-2 text-[12px] text-[#78716C]">
            다른 사람에게 보여지는 이름이에요
          </p>
        </div>

        {/* 한 줄 소개 필드 */}
        <div className="mb-6">
          <label
            htmlFor="bio"
            className="block text-[14px] text-[#57534E] mb-2"
          >
            한 줄 소개
          </label>
          <textarea
            id="bio"
            aria-label="한 줄 소개"
            value={bio}
            onChange={handleBioChange}
            rows={4}
            className={[
              'w-full px-4 py-3 rounded-[8px] text-neutral-900 text-[15px] outline-none resize-none',
              bio.length > 0
                ? 'bg-neutral-50 border border-primary-700'
                : 'bg-[#EFEDE6] border-none',
            ].join(' ')}
            style={{ height: 88 }}
          />
          <div className="flex items-center justify-between mt-1">
            <p className="text-[12px] text-[#78716C]">최대 80자</p>
            <p
              className={[
                'text-[12px]',
                bio.length > 0 ? 'text-primary-700' : 'text-[#A8A29E]',
              ].join(' ')}
            >
              {bio.length} / {BIO_MAX}
            </p>
          </div>
        </div>

        {/* 언어 선택 */}
        <div className="mb-6">
          <p className="block text-[14px] text-[#57534E] mb-2">언어</p>
          <div className="flex gap-2">
            {LOCALES.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => setLocale(l.value)}
                className={[
                  'flex-1 h-[48px] rounded-[8px] text-[15px] font-medium',
                  locale === l.value
                    ? 'bg-primary-700 text-white'
                    : 'bg-[#EFEDE6] text-neutral-700',
                ].join(' ')}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* 저장하기 버튼 */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty}
          className="w-full h-[48px] rounded-[12px] bg-primary-700 text-white text-[15px] font-medium disabled:opacity-50"
        >
          저장하기
        </button>
      </div>
    </div>
  )
}
