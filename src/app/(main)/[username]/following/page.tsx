import { auth } from '@clerk/nextjs/server'
import { getFollowing } from '@/services/user.service'
import FollowListClient from '../FollowListClient'

export default async function FollowingPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const { userId, getToken } = await auth()
  const token = userId ? (await getToken()) ?? undefined : undefined

  const list = await getFollowing(username, token)

  return <FollowListClient list={list} title="팔로잉" />
}
