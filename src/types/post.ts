// 피드 API 명세 기반 타입 (decisions/api-spec.md)

export interface FeedAuthorDto {
  id: string
  username: string | null
  avatar: string | null
}

export interface PostImageDto {
  url: string
  width: number
  height: number
}

export interface SnapFeedItemDto {
  id: string
  type: 'snap'
  createdAt: string
  author: FeedAuthorDto
  images: PostImageDto[]
  caption: string | null
  likeCount: number
  likedByMe: boolean
}

export interface ArticleFeedItemDto {
  id: string
  type: 'article'
  createdAt: string
  author: FeedAuthorDto
  title: string | null
  excerpt: string
  coverImage: string | null
  readingTime: number | null
  likeCount: number
  likedByMe: boolean
}

export type FeedItemDto = SnapFeedItemDto | ArticleFeedItemDto

// ── 포스트 상세 타입 (decisions/api-spec.md 기준) ─────────────────────────────

export interface PostDetailAuthorDto {
  id: string
  username: string
  avatar: string | null
}

/**
 * 스냅 포스트 상세 응답 (GET /posts/:id, PATCH /posts/:id)
 * isOwnedByMe: 서버에서 clerkId 비교 후 반환. 클라이언트 비교 금지.
 */
export interface SnapDetailDto {
  id: string
  type: 'snap'
  author: PostDetailAuthorDto
  images: PostImageDto[]
  caption: string | null
  likeCount: number
  likedByMe: boolean
  isOwnedByMe: boolean
  commentCount: number
  createdAt: string
  updatedAt: string
  /** 캡션 실변경 시 true. 서버에서 계산해 반환 (api-spec.md 기준). */
  isEdited: boolean
}

/**
 * 아티클 포스트 상세 응답 (GET /posts/:id, PATCH /posts/:id)
 * isOwnedByMe: 서버에서 clerkId 비교 후 반환. 클라이언트 비교 금지.
 */
export interface ArticleDetailDto {
  id: string
  type: 'article'
  author: PostDetailAuthorDto
  title: string
  body: object // TipTap JSON
  coverImage: string | null
  readingTime: number
  isDraft: boolean
  likeCount: number
  likedByMe: boolean
  isOwnedByMe: boolean
  commentCount: number
  createdAt: string
  updatedAt: string
  /** 본문 실변경 시 true. 서버에서 계산해 반환 (api-spec.md 기준). */
  isEdited: boolean
}

/** POST /likes/:postId, DELETE /likes/:postId 응답 */
export interface LikeResponseDto {
  postId: string
  likeCount: number
}

export type PostDetailDto = SnapDetailDto | ArticleDetailDto

// ── 유저 포스트 목록 타입 (GET /users/:username/posts) ───────────────────────

/**
 * 유저 포스트 목록의 스냅 항목
 * 피드 아이템(SnapFeedItemDto)과 달리 author 필드가 없음
 */
export interface SnapSummaryDto {
  id: string
  type: 'snap'
  images: PostImageDto[]
  caption: string | null
  likeCount: number
  createdAt: string
}

/**
 * 유저 포스트 목록의 아티클 항목
 * 피드 아이템(ArticleFeedItemDto)과 달리 author 필드가 없음
 */
export interface ArticleSummaryDto {
  id: string
  type: 'article'
  title: string
  excerpt: string
  coverImage: string | null
  readingTime: number
  isDraft: boolean
  likeCount: number
  createdAt: string
}

export type PostSummaryDto = SnapSummaryDto | ArticleSummaryDto
