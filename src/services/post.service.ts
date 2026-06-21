import { api } from '@/lib/api'

// ── DTO 타입 ──────────────────────────────────────────────────────────────────

export interface PostImageDto {
  url: string
  width: number
  height: number
}

export interface PostAuthorDto {
  id: string
  username: string
  avatar: string | null
}

export interface SnapDetailDto {
  id: string
  type: 'snap'
  author: PostAuthorDto
  images: PostImageDto[]
  caption: string | null
  likeCount: number
  likedByMe: boolean
  commentCount: number
  createdAt: string
  updatedAt: string
}

export interface ArticleDetailDto {
  id: string
  type: 'article'
  author: PostAuthorDto
  title: string
  body: object
  coverImage: string | null
  readingTime: number
  isDraft: boolean
  likeCount: number
  likedByMe: boolean
  commentCount: number
  createdAt: string
  updatedAt: string
}

export type PostDetailDto = SnapDetailDto | ArticleDetailDto

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
