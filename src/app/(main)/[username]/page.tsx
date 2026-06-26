import { auth } from '@clerk/nextjs/server'
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

  const [profile, snapPosts, articlePosts] = await Promise.all([
    getUserProfile(username, token),
    getUserPosts(username, 'snap', token),
    getUserPosts(username, 'article', token),
  ])

  const isOwnedByMe = profile.isOwnedByMe

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
