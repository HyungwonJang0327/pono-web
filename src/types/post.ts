export type PostType = 'snap' | 'article'

export interface Post {
  id: string
  authorId: string
  type: PostType

  // 스냅 전용
  images?: string[]
  caption?: string

  // 아티클 전용
  title?: string
  body?: object
  coverImage?: string
  readingTime?: number

  // 공통
  tags: string[]
  likesCount: number
  commentsCount: number
  createdAt: string
}
