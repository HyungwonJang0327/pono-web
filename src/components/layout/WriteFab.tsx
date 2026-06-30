'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth, useUser } from '@clerk/nextjs'
import { useTranslations } from 'next-intl'
import { Camera, FileText, Plus } from 'lucide-react'
import { BottomSheet } from '@/components/ui'

export default function WriteFab() {
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('writeFab')
  const [isOpen, setIsOpen] = useState(false)

  const isHomeFeed = pathname === '/'
  const isMyProfile = !!user?.username && pathname === `/${user.username}`

  if (!isSignedIn) return null
  if (!isHomeFeed && !isMyProfile) return null

  function handleSnap() {
    setIsOpen(false)
    router.push('/write/snap')
  }

  function handleArticle() {
    setIsOpen(false)
    router.push('/write/article')
  }

  return (
    <>
      <div className="fixed bottom-6 z-30 w-full max-w-[560px] left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="flex justify-end pr-4 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-[52px] h-[52px] bg-primary-700 rounded-full flex items-center justify-center shadow-[var(--shadow-md)] text-white"
            aria-label={t('write')}
          >
            <Plus size={24} strokeWidth={2} />
          </button>
        </div>
      </div>

      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col gap-1">
          <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-widest mb-3">
            {t('sheetTitle')}
          </p>

          {/* 스냅 올리기 */}
          <button
            type="button"
            onClick={handleSnap}
            className="flex items-center gap-4 px-1 py-3 rounded-[var(--radius-md)] hover:bg-neutral-100 active:bg-neutral-100 transition-colors text-left w-full"
          >
            <div className="w-11 h-11 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0">
              <Camera size={22} strokeWidth={1.5} className="text-primary-500" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[15px] font-semibold text-neutral-900 leading-tight">
                {t('snapTitle')}
              </span>
              <span className="text-[12px] text-neutral-500 leading-tight">
                {t('snapDescription')}
              </span>
            </div>
          </button>

          {/* 아티클 쓰기 */}
          <button
            type="button"
            onClick={handleArticle}
            className="flex items-center gap-4 px-1 py-3 rounded-[var(--radius-md)] hover:bg-neutral-100 active:bg-neutral-100 transition-colors text-left w-full"
          >
            <div className="w-11 h-11 rounded-full bg-primary-700/10 flex items-center justify-center flex-shrink-0">
              <FileText size={22} strokeWidth={1.5} className="text-primary-700" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[15px] font-semibold text-neutral-900 leading-tight">
                {t('articleTitle')}
              </span>
              <span className="text-[12px] text-neutral-500 leading-tight">
                {t('articleDescription')}
              </span>
            </div>
          </button>
        </div>
      </BottomSheet>
    </>
  )
}
