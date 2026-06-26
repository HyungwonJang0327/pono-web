import { api } from '@/lib/api'
import type { UserPublicProfileDto } from '@/types/user'

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
