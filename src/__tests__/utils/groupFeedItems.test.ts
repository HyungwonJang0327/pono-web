import { groupFeedItems, getAspectRatio } from '@/lib/feed'
import type { SnapFeedItemDto, ArticleFeedItemDto } from '@/types/post'

const makeSnap = (id: string, width = 100, height = 100): SnapFeedItemDto => ({
  id,
  type: 'snap',
  createdAt: '2026-01-01T00:00:00Z',
  author: { id: 'u1', username: 'user', avatar: null },
  images: [{ url: 'https://example.com/img.jpg', width, height }],
  caption: null,
  likeCount: 0,
  likedByMe: false,
})

const makeArticle = (id: string): ArticleFeedItemDto => ({
  id,
  type: 'article',
  createdAt: '2026-01-01T00:00:00Z',
  author: { id: 'u1', username: 'user', avatar: null },
  title: '제목',
  excerpt: '요약',
  coverImage: null,
  readingTime: 3,
  likeCount: 0,
  likedByMe: false,
})

describe('getAspectRatio', () => {
  it('height/width >= 1.15 이면 4/5 반환', () => {
    expect(getAspectRatio(100, 120)).toBe('4/5')
  })

  it('height/width < 1.15 이면 1/1 반환', () => {
    expect(getAspectRatio(100, 100)).toBe('1/1')
  })

  it('정확히 1.15 이면 4/5 반환', () => {
    expect(getAspectRatio(100, 115)).toBe('4/5')
  })
})

describe('groupFeedItems', () => {
  it('아티클 단독 → article 그룹 1개', () => {
    const result = groupFeedItems([makeArticle('a1')])
    expect(result).toHaveLength(1)
    expect(result[0].type).toBe('article')
  })

  it('스냅 2개 연속 → snap-row 1개 (second: SnapFeedItemDto)', () => {
    const result = groupFeedItems([makeSnap('s1'), makeSnap('s2')])
    expect(result).toHaveLength(1)
    expect(result[0].type).toBe('snap-row')
    if (result[0].type === 'snap-row') {
      expect(result[0].items[0].id).toBe('s1')
      expect(result[0].items[1]?.id).toBe('s2')
    }
  })

  it('스냅 1개 → snap-row 1개 (second: null)', () => {
    const result = groupFeedItems([makeSnap('s1')])
    expect(result).toHaveLength(1)
    expect(result[0].type).toBe('snap-row')
    if (result[0].type === 'snap-row') {
      expect(result[0].items[1]).toBeNull()
    }
  })

  it('스냅 3개 → snap-row 2개 ([s1,s2], [s3,null])', () => {
    const result = groupFeedItems([makeSnap('s1'), makeSnap('s2'), makeSnap('s3')])
    expect(result).toHaveLength(2)
    expect(result[0].type).toBe('snap-row')
    expect(result[1].type).toBe('snap-row')
    if (result[1].type === 'snap-row') {
      expect(result[1].items[0].id).toBe('s3')
      expect(result[1].items[1]).toBeNull()
    }
  })

  it('아티클+스냅+아티클 혼합 → 순서 유지', () => {
    const result = groupFeedItems([makeArticle('a1'), makeSnap('s1'), makeArticle('a2')])
    expect(result).toHaveLength(3)
    expect(result[0].type).toBe('article')
    expect(result[1].type).toBe('snap-row')
    expect(result[2].type).toBe('article')
    if (result[0].type === 'article') expect(result[0].item.id).toBe('a1')
    if (result[2].type === 'article') expect(result[2].item.id).toBe('a2')
  })

  it('홀수 마지막 스냅의 ratio는 항상 1/1', () => {
    // 세로 이미지(4:5 비율이 나올 법한 크기)여도 홀수 마지막이면 1/1
    const result = groupFeedItems([makeSnap('s1', 100, 130)])
    if (result[0].type === 'snap-row') {
      expect(result[0].ratio).toBe('1/1')
    }
  })
})
