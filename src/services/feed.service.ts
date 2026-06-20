import { FeedItemDto } from '@/types/post'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3005'

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

  const res = await fetch(`${API_BASE}/feed?${searchParams}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const err = new Error(`Feed API error: ${res.status}`) as Error & { status: number }
    err.status = res.status
    throw err
  }

  return res.json()
}
