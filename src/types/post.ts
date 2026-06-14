// 피드 API 명세 기반 타입 (decisions/api-spec.md)

export interface FeedAuthorDto {
  id: string
  username: string
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
  title: string
  excerpt: string
  coverImage: string | null
  readingTime: number
  likeCount: number
  likedByMe: boolean
}

export type FeedItemDto = SnapFeedItemDto | ArticleFeedItemDto
