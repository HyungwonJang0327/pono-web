'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth, useUser } from '@clerk/nextjs'
import { Camera, FileText } from 'lucide-react'
import { BottomSheet } from '@/components/ui'

export default function WriteFab() {
  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const router = useRouter()
  const pathname = usePathname()
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
            aria-label="글 작성"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col gap-1">
          <p className="text-[12px] font-semibold text-neutral-400 uppercase tracking-widest mb-3">
            무엇을 올릴까요?
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
                스냅 올리기
              </span>
              <span className="text-[12px] text-neutral-500 leading-tight">
                사진 한 장으로 순간을 기록해요
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
                아티클 쓰기
              </span>
              <span className="text-[12px] text-neutral-500 leading-tight">
                생각을 긴 글로 풀어보세요
              </span>
            </div>
          </button>
        </div>
      </BottomSheet>
    </>
  )
}
