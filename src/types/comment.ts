export interface ReplyDto {
  id: string
  author: { id: string; username: string; avatar: string | null }
  body: string
  parentId: string
  createdAt: string
  updatedAt: string
}

export interface CommentDto {
  id: string
  author: { id: string; username: string; avatar: string | null }
  body: string
  parentId: string | null
  replies: ReplyDto[]
  createdAt: string
  updatedAt: string
}

export interface CommentListResponseDto {
  items: CommentDto[]
  nextCursor: string | null
  hasMore: boolean
}
