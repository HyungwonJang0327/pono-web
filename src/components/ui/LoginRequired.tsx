'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface LoginRequiredProps {
  message?: string
  backLabel?: string
}

export function LoginRequired({
  message,
  backLabel,
}: LoginRequiredProps) {
  const router = useRouter()
  const t = useTranslations('loginRequired')

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-[15px] text-neutral-700 font-medium">{message ?? t('message')}</p>
      <button
        type="button"
        onClick={() => router.back()}
        className="text-[14px] text-primary-700 font-medium"
      >
        {backLabel ?? t('back')}
      </button>
    </div>
  )
}
