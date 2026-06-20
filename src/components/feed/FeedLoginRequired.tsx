'use client'

import { LogIn, Lock } from 'lucide-react'
import { SignInButton } from '@clerk/nextjs'

export function FeedLoginRequired() {
  return (
    <div className="px-4 pt-2 pb-6">
      <div className="flex justify-center mb-4">
        <div className="w-[56px] h-[56px] rounded-full bg-primary-50 flex items-center justify-center">
          <Lock size={24} className="text-primary-500" strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="text-[16px] font-semibold text-neutral-900 text-center tracking-tight mb-2">
        로그인이 필요해요
      </h3>
      <p className="text-[13px] text-neutral-600 text-center leading-relaxed mb-5">
        팔로잉 피드는 로그인 후 이용할 수 있어요.
      </p>
      <SignInButton mode="modal">
        <button
          type="button"
          className="w-full h-12 bg-primary-700 text-white rounded-[var(--radius-md)] flex items-center justify-center gap-2 text-[15px] font-medium"
        >
          <LogIn size={16} />
          로그인하기
        </button>
      </SignInButton>
    </div>
  )
}
