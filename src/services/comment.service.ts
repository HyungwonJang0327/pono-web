import { api } from '@/lib/api'
import type { CommentDto, CommentListResponseDto } from '@/types/comment'

export async function getComments(postId: string, token?: string): Promise<CommentListResponseDto> {
  return api.get<CommentListResponseDto>(`/comments/${postId}`, token)
}

export async function createComment(
  postId: string,
  body: string,
  token: string,
  parentId?: string,
): Promise<CommentDto> {
  return api.post<CommentDto>(`/comments/${postId}`, { body, parentId }, token)
}

export async function deleteComment(
  postId: string,
  commentId: string,
  token: string,
): Promise<{ id: string }> {
  return api.delete<{ id: string }>(`/comments/${postId}/${commentId}`, token)
}
