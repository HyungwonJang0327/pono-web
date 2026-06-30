'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { useTranslations } from 'next-intl'
import { ChevronLeft, Camera } from 'lucide-react'
import { useToastContext } from '@/components/ui'
import { updateUserProfile } from '@/services/user.service'

interface ProfileEditClientProps {
  initialUsername: string
  initialBio: string | null
  initialAvatar: string | null
}

const BIO_MAX = 80

export default function ProfileEditClient({
  initialUsername,
  initialBio,
  initialAvatar,
}: ProfileEditClientProps) {
  const router = useRouter()
  const { getToken } = useAuth()
  const toast = useToastContext()
  const t = useTranslations('profileEdit')

  const [username, setUsername] = useState(initialUsername)
  const [bio, setBio] = useState(initialBio ?? '')

  const isDirty =
    username !== initialUsername || bio !== (initialBio ?? '')

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= BIO_MAX) {
      setBio(e.target.value)
    }
  }

  const handleSave = async () => {
    try {
      const token = (await getToken()) ?? ''
      await updateUserProfile({ username, bio }, token)
      toast.success(t('saveSuccess'))
      router.back()
    } catch {
      toast.error(t('saveError'))
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-neutral-50 border-b border-neutral-200">
        <div className="mx-auto w-full max-w-[560px] h-[52px] flex items-center px-5">
          <button
            type="button"
            aria-label={t('back')}
            onClick={() => router.back()}
            className="w-10 h-10 -ml-2 flex items-center justify-center text-neutral-900"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
          <span className="flex-1 text-center text-[17px] font-semibold text-neutral-900 -ml-8">
            {t('title')}
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
            {t('changePhoto')}
          </button>
        </div>

        {/* 닉네임 필드 */}
        <div className="mb-6">
          <label
            htmlFor="username"
            className="block text-[14px] text-[#57534E] mb-2"
          >
            {t('usernameLabel')}
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-[48px] px-4 rounded-[8px] bg-[#EFEDE6] text-neutral-900 text-[15px] outline-none"
          />
          <p className="mt-2 text-[12px] text-[#78716C]">
            {t('usernameHint')}
          </p>
        </div>

        {/* 한 줄 소개 필드 */}
        <div className="mb-6">
          <label
            htmlFor="bio"
            className="block text-[14px] text-[#57534E] mb-2"
          >
            {t('bioLabel')}
          </label>
          <textarea
            id="bio"
            aria-label={t('bioLabel')}
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
            <p className="text-[12px] text-[#78716C]">{t('bioMax')}</p>
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

        {/* 저장하기 버튼 */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty}
          className="w-full h-[48px] rounded-[12px] bg-primary-700 text-white text-[15px] font-medium disabled:opacity-50"
        >
          {t('save')}
        </button>
      </div>
    </div>
  )
}
