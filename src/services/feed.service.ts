import { api } from '@/lib/api'
import { FeedItemDto } from '@/types/post'

export interface FeedResponse {
  items: FeedItemDto[]
  nextCursor: string | null
  hasMore: boolean
}

export async function fetchFeed(params: {
  tab: 'following' | 'recommended'
  cursor?: string
  token?: string | null
}): Promise<FeedResponse> {
  const { tab, cursor, token } = params
  const searchParams = new URLSearchParams({ tab })
  if (cursor) searchParams.set('cursor', cursor)

  // 공통 api 래퍼로 통합 → ApiError 형태 일관화
  return api.get<FeedResponse>(`/feed?${searchParams.toString()}`, token ?? undefined)
}
