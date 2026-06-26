import { auth } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { getUserProfile } from '@/services/user.service'
import { getUserPosts } from '@/services/post.service'
import ProfileClient from './ProfileClient'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3005'

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const { userId, getToken } = await auth()
  const token = userId ? (await getToken()) ?? undefined : undefined

  const headersList = await headers()
  const isWebView = headersList.get('x-is-webview') === 'true'

  // Pono DB의 내 username으로 본인 여부 판단
  let myPonoUsername: string | null = null
  if (userId && token) {
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      })
      if (res.ok) {
        const me = await res.json()
        myPonoUsername = me.username ?? null
      }
    } catch {}
  }
  const isOwnedByMe = myPonoUsername === username

  const [profile, snapPosts, articlePosts] = await Promise.all([
    getUserProfile(username, token),
    getUserPosts(username, 'snap', token),
    getUserPosts(username, 'article', token),
  ])

  return (
    <ProfileClient
      profile={profile}
      snapPosts={snapPosts.items}
      articlePosts={articlePosts.items}
      isOwnedByMe={isOwnedByMe}
      isWebView={isWebView}
    />
  )
}
