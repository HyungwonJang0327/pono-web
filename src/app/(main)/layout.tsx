import { auth } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout'
import WriteFab from '@/components/layout/WriteFab'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3005'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const { userId, getToken } = await auth()

  if (userId) {
    const token = await getToken()
    let needsOnboarding = false
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      })
      if (res.ok) {
        const user = await res.json()
        if (!user.username) needsOnboarding = true
      } else {
        needsOnboarding = true
      }
    } catch {
      // 네트워크 오류 시 통과 (온보딩 차단 안 함)
    }
    if (needsOnboarding) redirect('/onboarding/username')
  }

  const headersList = await headers()
  const isWebView = headersList.get('x-is-webview') === 'true'

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header isWebView={isWebView} />
      <main className="mx-auto w-full max-w-[560px] px-3.5 pb-24">
        {children}
      </main>
      <WriteFab />
    </div>
  )
}
