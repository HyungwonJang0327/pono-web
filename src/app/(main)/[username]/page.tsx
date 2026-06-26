import { auth, currentUser } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { getUserProfile } from '@/services/user.service'
import { getUserPosts } from '@/services/post.service'
import ProfileClient from './ProfileClient'

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const { userId, getToken } = await auth()
  const token = userId ? (await getToken()) ?? undefined : undefined

  const headersList = await headers()
  const isWebView = headersList.get('x-is-webview') === 'true'

  const [profile, clerkUser] = await Promise.all([
    getUserProfile(username, token),
    userId ? currentUser() : null,
  ])

  // TODO: Sofia Phase 8 이후 profile.isOwnedByMe 서버 응답 값으로 대체
  const isOwnedByMe = clerkUser?.username === username

  const [snapPosts, articlePosts] = await Promise.all([
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
