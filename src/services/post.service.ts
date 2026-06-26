import { api } from '@/lib/api'
import type {
  SnapDetailDto,
  ArticleDetailDto,
  PostDetailDto,
  LikeResponseDto,
  PostImageDto,
  PostSummaryDto,
} from '@/types/post'

// re-export so existing importers of post.service.ts don't break
export type { SnapDetailDto, ArticleDetailDto, PostDetailDto, PostImageDto, PostSummaryDto }

export interface PresignedUrlResponseDto {
  uploadUrl: string
  fileUrl: string
}

export interface CreateSnapDto {
  type: 'snap'
  images: PostImageDto[]
  caption?: string
}

export interface CreateArticleDto {
  type: 'article'
  title: string
  body?: object
  coverImage?: string
  isDraft?: boolean
}

export interface UpdateArticleDto {
  title?: string
  body?: object
  coverImage?: string
  isDraft?: boolean
}

export interface UpdateSnapDto {
  caption?: string
}

// ── 서비스 함수 ───────────────────────────────────────────────────────────────

/**
 * S3 presigned URL 발급
 * POST /posts/presigned-url
 */
export async function getPresignedUrl(
  filename: string,
  contentType: string,
  token: string,
): Promise<PresignedUrlResponseDto> {
  return api.post<PresignedUrlResponseDto>(
    '/posts/presigned-url',
    { filename, contentType },
    token,
  )
}

/**
 * S3에 직접 PUT 업로드
 * presigned URL을 사용해 Blob을 업로드한다.
 */
export async function uploadToS3(uploadUrl: string, blob: Blob, contentType: string): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    body: blob,
    headers: { 'Content-Type': contentType },
  })
  if (!res.ok) {
    throw new Error(`S3 업로드 실패: ${res.status}`)
  }
}

/**
 * 스냅 포스트 생성
 * POST /posts
 */
export async function createSnapPost(dto: CreateSnapDto, token: string): Promise<SnapDetailDto> {
  return api.post<SnapDetailDto>('/posts', dto, token)
}

/**
 * 아티클 포스트 생성
 * POST /posts
 */
export async function createArticlePost(
  dto: CreateArticleDto,
  token: string,
): Promise<ArticleDetailDto> {
  return api.post<ArticleDetailDto>('/posts', dto, token)
}

/**
 * 아티클 포스트 수정 (임시저장 포함)
 * PATCH /posts/:id
 */
export async function updateArticlePost(
  postId: string,
  dto: UpdateArticleDto,
  token: string,
): Promise<ArticleDetailDto> {
  return api.patch<ArticleDetailDto>(`/posts/${postId}`, dto, token)
}

/**
 * 포스트 상세 조회
 * GET /posts/:id
 * 비로그인 허용. token 없으면 isOwnedByMe: false, likedByMe: false 고정
 */
export async function getPostDetail(postId: string, token?: string): Promise<PostDetailDto> {
  return api.get<PostDetailDto>(`/posts/${postId}`, token)
}

/**
 * 포스트 수정
 * PATCH /posts/:id
 * 스냅: caption만, 아티클: title/body/coverImage/isDraft
 */
export async function updatePost(
  postId: string,
  dto: UpdateSnapDto | UpdateArticleDto,
  token: string,
): Promise<PostDetailDto> {
  return api.patch<PostDetailDto>(`/posts/${postId}`, dto, token)
}

/**
 * 포스트 삭제
 * DELETE /posts/:id
 */
export async function deletePost(postId: string, token: string): Promise<{ id: string }> {
  return api.delete<{ id: string }>(`/posts/${postId}`, token)
}

export interface PostListResponseDto {
  items: PostSummaryDto[]
  nextCursor: string | null
  hasMore: boolean
}

/**
 * 유저 포스트 목록 조회
 * GET /users/:username/posts?type=snap|article&cursor=&limit=30
 */
export async function getUserPosts(
  username: string,
  type: 'snap' | 'article',
  token?: string,
  cursor?: string,
): Promise<PostListResponseDto> {
  const params = new URLSearchParams({ type, limit: '30' })
  if (cursor) params.set('cursor', encodeURIComponent(cursor))
  return api.get<PostListResponseDto>(`/users/${username}/posts?${params.toString()}`, token)
}

/**
 * 좋아요 추가
 * POST /likes/:postId
 */
export async function addLike(postId: string, token: string): Promise<LikeResponseDto> {
  return api.post<LikeResponseDto>(`/likes/${postId}`, {}, token)
}

/**
 * 좋아요 취소
 * DELETE /likes/:postId
 */
export async function removeLike(postId: string, token: string): Promise<LikeResponseDto> {
  return api.delete<LikeResponseDto>(`/likes/${postId}`, token)
}
