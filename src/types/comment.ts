export interface ReplyDto {
  id: string
  author: { id: string; username: string; avatar: string | null }
  body: string
  parentId: string
  isOwnedByMe: boolean
  createdAt: string
  updatedAt: string
}

export interface CommentDto {
  id: string
  author: { id: string; username: string; avatar: string | null }
  body: string
  parentId: string | null
  replies: ReplyDto[]
  isOwnedByMe: boolean
  createdAt: string
  updatedAt: string
}

export interface CommentListResponseDto {
  items: CommentDto[]
  nextCursor: string | null
  hasMore: boolean
}
