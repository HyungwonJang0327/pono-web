'use client'

import { LogIn, Lock } from 'lucide-react'
import { SignInButton } from '@clerk/nextjs'
import { useTranslations } from 'next-intl'

export function FeedLoginRequired() {
  const t = useTranslations('feed')

  return (
    <div className="px-4 pt-2 pb-6">
      <div className="flex justify-center mb-4">
        <div className="w-[56px] h-[56px] rounded-full bg-primary-50 flex items-center justify-center">
          <Lock size={24} className="text-primary-500" strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="text-[16px] font-semibold text-neutral-900 text-center tracking-tight mb-2">
        {t('loginRequired.title')}
      </h3>
      <p className="text-[13px] text-neutral-600 text-center leading-relaxed mb-5 break-keep">
        {t('loginRequired.description')}
      </p>
      <SignInButton mode="modal">
        <button
          type="button"
          className="w-full h-12 bg-primary-700 text-white rounded-[var(--radius-md)] flex items-center justify-center gap-2 text-[15px] font-medium cursor-pointer"
        >
          <LogIn size={16} />
          {t('loginRequired.loginButton')}
        </button>
      </SignInButton>
    </div>
  )
}
