import { auth } from '@clerk/nextjs/server'
import { getFollowers } from '@/services/user.service'
import FollowListClient from '../FollowListClient'

export default async function FollowersPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const { userId, getToken } = await auth()
  const token = userId ? (await getToken()) ?? undefined : undefined

  const list = await getFollowers(username, token)

  return <FollowListClient list={list} activeTab="followers" username={username} />
}
