import { auth } from '@clerk/nextjs/server'
import { cookies } from 'next/headers'
import SettingsClient from './SettingsClient'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3005'

export default async function SettingsPage() {
  const { userId, getToken } = await auth()

  let username: string | null = null
  let avatar: string | null = null
  let locale: string | null = (await cookies()).get('locale')?.value ?? null
  let loadFailed = false

  if (userId) {
    try {
      const token = await getToken()
      const res = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      })
      if (res.ok) {
        const user = await res.json() as { username: string; avatar: string | null; locale: string | null }
        username = user.username
        avatar = user.avatar
        locale = user.locale
      } else {
        // 로그인 상태인데 프로필 조회 실패 → 비로그인 카드로 새지 않도록 분기
        loadFailed = true
      }
    } catch {
      loadFailed = true
    }
  }

  return (
    <SettingsClient
      username={username}
      avatar={avatar}
      locale={locale}
      loadFailed={loadFailed}
    />
  )
}
