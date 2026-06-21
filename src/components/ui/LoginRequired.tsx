'use client'

import { useRouter } from 'next/navigation'

interface LoginRequiredProps {
  message?: string
  backLabel?: string
}

export function LoginRequired({
  message = '로그인이 필요한 페이지입니다.',
  backLabel = '뒤로가기',
}: LoginRequiredProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-[15px] text-neutral-700 font-medium">{message}</p>
      <button
        type="button"
        onClick={() => router.back()}
        className="text-[14px] text-primary-700 font-medium"
      >
        {backLabel}
      </button>
    </div>
  )
}
