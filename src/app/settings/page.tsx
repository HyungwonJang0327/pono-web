import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import SettingsClient from './SettingsClient'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3005'

export default async function SettingsPage() {
  const { userId, getToken } = await auth()
  if (!userId) redirect('/login')

  const token = await getToken()
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })

  if (!res.ok) redirect('/login')

  const user = await res.json() as { username: string; avatar: string | null; locale: string | null }

  return (
    <SettingsClient
      username={user.username}
      avatar={user.avatar}
      locale={user.locale}
    />
  )
}
