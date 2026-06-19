'use client'

import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'

export default function WriteFab() {
  const { isSignedIn } = useAuth()
  if (!isSignedIn) return null

  return (
    <div className="fixed bottom-6 z-30 w-full max-w-[560px] left-1/2 -translate-x-1/2 pointer-events-none">
      <div className="flex justify-end pr-4 pointer-events-auto">
        <Link
          href="/write"
          className="w-[52px] h-[52px] bg-primary-700 rounded-full flex items-center justify-center shadow-[var(--shadow-md)] text-white"
          aria-label="글 작성"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </Link>
      </div>
    </div>
  )
}
