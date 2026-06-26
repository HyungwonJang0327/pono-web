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

export interface UserPublicProfileDto {
  id: string
  username: string
  avatar: string | null
  bio: string | null
  followerCount: number
  followingCount: number
  postCount: number
  isFollowedByMe: boolean  // 비로그인 시 false
}
