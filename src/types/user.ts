export interface User {
  id: string
  username: string
  displayName: string
  bio?: string
  avatarUrl?: string
  followersCount: number
  followingCount: number
  createdAt: string
}
