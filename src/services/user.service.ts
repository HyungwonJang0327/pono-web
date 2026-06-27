import { api } from '@/lib/api'
import type { UserPublicProfileDto, FollowUserDto } from '@/types/user'

// ── 서비스 함수 ───────────────────────────────────────────────────────────────

/**
 * 유저 공개 프로필 조회
 * GET /users/:username
 */
export async function getUserProfile(
  username: string,
  token?: string,
): Promise<UserPublicProfileDto> {
  return api.get<UserPublicProfileDto>(`/users/${username}`, token)
}

/**
 * 팔로우
 * POST /follow/:targetUserId
 */
export async function followUser(userId: string, token: string): Promise<void> {
  await api.post<{ followingId: string }>(`/follow/${userId}`, {}, token)
}

/**
 * 언팔로우
 * DELETE /follow/:targetUserId
 */
export async function unfollowUser(userId: string, token: string): Promise<void> {
  await api.delete<{ followingId: string }>(`/follow/${userId}`, token)
}

/**
 * 팔로워 목록 조회
 * GET /follow/:username/followers
 */
export async function getFollowers(
  username: string,
  token?: string,
): Promise<FollowUserDto[]> {
  return api.get<FollowUserDto[]>(`/follow/${username}/followers`, token)
}

/**
 * 팔로잉 목록 조회
 * GET /follow/:username/following
 */
export async function getFollowing(
  username: string,
  token?: string,
): Promise<FollowUserDto[]> {
  return api.get<FollowUserDto[]>(`/follow/${username}/following`, token)
}

/**
 * 내 프로필 수정
 * PATCH /users/me
 */
export async function updateUserProfile(
  data: { username?: string; bio?: string },
  token: string,
): Promise<void> {
  await api.patch<void>('/users/me', data, token)
}
