import type { UserPublicProfileDto } from '@/types/user'

// ── 목업 데이터 (Sofia Phase 8 API 구현 전 임시) ──────────────────────────────

const MOCK_PROFILE: UserPublicProfileDto = {
  id: 'mock-1',
  username: 'mock_user',
  avatar: null,
  bio: '기록하는 사람',
  followerCount: 128,
  followingCount: 43,
  postCount: 12,
  isFollowedByMe: false,
}

// ── 서비스 함수 ───────────────────────────────────────────────────────────────

/**
 * 유저 공개 프로필 조회
 * TODO: Sofia Phase 8 구현 후 GET /users/:username 실제 API 연동
 */
export async function getUserProfile(
  username: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _token?: string,
): Promise<UserPublicProfileDto> {
  return { ...MOCK_PROFILE, username }
}

/**
 * 팔로우
 * TODO: Sofia Phase 8 구현 후 POST /follows/:userId 실제 API 연동
 */
export async function followUser(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _userId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _token: string,
): Promise<void> {
  // stub
}

/**
 * 언팔로우
 * TODO: Sofia Phase 8 구현 후 DELETE /follows/:userId 실제 API 연동
 */
export async function unfollowUser(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _userId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _token: string,
): Promise<void> {
  // stub
}
