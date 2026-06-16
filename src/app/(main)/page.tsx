'use client'

import { useState } from 'react'
import FeedRenderer from '@/components/feed/FeedRenderer'
import { FeedItemDto } from '@/types/post'

const MOCK_FEED_ITEMS: FeedItemDto[] = [
  {
    id: '1',
    type: 'article',
    createdAt: '2026-06-01T09:00:00.000Z',
    author: { id: 'u1', username: 'dohyun_l', avatar: null },
    title: '느리게 사는 법에 대하여',
    excerpt: '빠름이 미덕이 된 세상에서, 의도적으로 느려지기로 했다. 그 선택이 내 하루를 어떻게 바꿨는지에 대한 이야기.',
    coverImage: null,
    readingTime: 7,
    likeCount: 1200,
    likedByMe: false,
  },
  {
    id: '2',
    type: 'snap',
    createdAt: '2026-06-02T08:30:00.000Z',
    author: { id: 'u2', username: 'seoyeon_k', avatar: null },
    images: [{ url: '', width: 1080, height: 1350 }],
    caption: '아침 햇살이 가장 좋은 자리. 커피 한 잔과 책 한 권이면 충분한 주말. #느린아침 #홈카페',
    likeCount: 248,
    likedByMe: false,
  },
  {
    id: '3',
    type: 'snap',
    createdAt: '2026-06-02T10:00:00.000Z',
    author: { id: 'u3', username: 'jiwoo_h', avatar: null },
    images: [{ url: '', width: 1080, height: 1350 }],
    caption: '제철 채소로 차린 저녁. #집밥',
    likeCount: 301,
    likedByMe: true,
  },
  {
    id: '4',
    type: 'article',
    createdAt: '2026-06-03T11:00:00.000Z',
    author: { id: 'u4', username: 'woosung_j', avatar: null },
    title: '도시를 떠나 살기로 했다',
    excerpt: '귀농도 귀촌도 아닌, 그냥 도시 바깥. 선택의 이유와 6개월간의 솔직한 기록.',
    coverImage: null,
    readingTime: 12,
    likeCount: 892,
    likedByMe: false,
  },
  {
    id: '5',
    type: 'article',
    createdAt: '2026-06-03T14:00:00.000Z',
    author: { id: 'u5', username: 'sohee_y', avatar: null },
    title: '매일 글을 쓴다는 것',
    excerpt: '완성된 글보다 쓰는 행위 자체에 의미를 두기로 한 이후의 변화들.',
    coverImage: null,
    readingTime: 5,
    likeCount: 543,
    likedByMe: false,
  },
  {
    id: '6',
    type: 'snap',
    createdAt: '2026-06-04T09:00:00.000Z',
    author: { id: 'u6', username: 'minjun_p', avatar: null },
    images: [{ url: '', width: 1080, height: 1080 }],
    caption: '오늘의 독서. #책스타그램',
    likeCount: 184,
    likedByMe: false,
  },
  {
    id: '7',
    type: 'snap',
    createdAt: '2026-06-04T11:00:00.000Z',
    author: { id: 'u7', username: 'yuna_c', avatar: null },
    images: [{ url: '', width: 1080, height: 1080 }],
    caption: '주말 산책 루트. #걷기좋은날',
    likeCount: 97,
    likedByMe: false,
  },
  {
    id: '8',
    type: 'snap',
    createdAt: '2026-06-05T08:00:00.000Z',
    author: { id: 'u8', username: 'jaewon_l', avatar: null },
    images: [{ url: '', width: 1080, height: 1080 }],
    caption: '비 오는 날 창가 자리. #카페',
    likeCount: 412,
    likedByMe: false,
  },
  {
    id: '9',
    type: 'snap',
    createdAt: '2026-06-05T10:00:00.000Z',
    author: { id: 'u9', username: 'daeun_j', avatar: null },
    images: [{ url: '', width: 1080, height: 1080 }],
    caption: '손으로 쓴 오늘 일기. #손글씨',
    likeCount: 226,
    likedByMe: true,
  },
  {
    id: '10',
    type: 'snap',
    createdAt: '2026-06-06T07:30:00.000Z',
    author: { id: 'u2', username: 'seoyeon_k', avatar: null },
    images: [{ url: '', width: 1080, height: 1080 }],
    caption: '장마 전 마지막 맑은 날. #하늘',
    likeCount: 139,
    likedByMe: false,
  },
]

type TabType = 'following' | 'recommended'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('recommended')

  return (
    <>
      {/* 서브탭 */}
      <div className="sticky top-0 z-10 bg-neutral-50 -mx-3.5 px-3.5 pt-3 pb-2 mb-3 border-b border-neutral-200 flex items-center justify-between">
        {/* 왼쪽: 탭 버튼 */}
        <div className="flex gap-4">
          {(['following', 'recommended'] as const).map((tab) => {
            const isActive = activeTab === tab
            const label = tab === 'following' ? '팔로잉' : '추천'
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={[
                  'text-[14px] font-semibold pb-1.5 border-b-2 transition-colors',
                  isActive
                    ? 'text-primary-700 border-primary-700'
                    : 'text-neutral-500 border-transparent',
                ].join(' ')}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* 오른쪽: 헤더 숨김 시 노출되는 아이콘 */}
        <div className="tab-secondary-actions flex items-center gap-3">
          {/* 알림 버튼 */}
          <button className="relative w-7 h-7 flex items-center justify-center text-neutral-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-primary-500 rounded-full border border-neutral-50" />
          </button>
          {/* 프로필 버튼 — 추후 Clerk avatar로 교체 예정 */}
          <button className="w-7 h-7 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center text-neutral-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 피드 */}
      <FeedRenderer items={MOCK_FEED_ITEMS} />
    </>
  )
}
