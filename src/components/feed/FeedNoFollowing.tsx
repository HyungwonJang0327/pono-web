'use client'

import { UserPlus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { FeedStateCard } from './FeedStateCard'

interface Creator {
  id: string
  name: string
  description: string
  avatarFrom: string
  avatarTo: string
  isFollowing: boolean
}

const MOCK_CREATORS: Creator[] = [
  {
    id: '1',
    name: '이도현',
    description: 'Slow Letters · 아티클 42',
    avatarFrom: '#2D8463',
    avatarTo: '#1F4D3A',
    isFollowing: false,
  },
  {
    id: '2',
    name: '김서연',
    description: '일상 스냅 · 팔로워 1.2K',
    avatarFrom: '#C9B79C',
    avatarTo: '#A88B6A',
    isFollowing: false,
  },
  {
    id: '3',
    name: '정우성',
    description: '도시를 떠나 · 아티클 18',
    avatarFrom: '#9DB0CE',
    avatarTo: '#5B6E8C',
    isFollowing: true,
  },
  {
    id: '4',
    name: '윤소희',
    description: '글쓰기 연구소 · 팔로워 860',
    avatarFrom: '#A7C4A0',
    avatarTo: '#6E9266',
    isFollowing: false,
  },
]

export function FeedNoFollowing() {
  const t = useTranslations('feed')
  const tFollow = useTranslations('follow')

  return (
    <FeedStateCard
      iconBg="bg-primary-50"
      iconNode={<UserPlus size={28} className="text-primary-500" strokeWidth={1.5} />}
      title={t('noFollowing.title')}
      description={t('noFollowing.description')}
      action={undefined}
    >
      {/* 구분선 + 헤더 */}
      <div className="border-t border-neutral-100 mt-2 pt-5 flex items-center justify-between mb-3">
        <span className="text-[13px] text-neutral-500 font-medium">{t('noFollowing.recommendedCreators')}</span>
        <button type="button" className="text-[13px] text-primary-500">
          {t('noFollowing.more')}
        </button>
      </div>

      {/* 크리에이터 목록 */}
      <ul className="flex flex-col gap-3">
        {MOCK_CREATORS.map((creator) => (
          <li key={creator.id} className="flex items-center gap-3">
            {/* 아바타 */}
            <div
              className="w-11 h-11 rounded-full flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${creator.avatarFrom}, ${creator.avatarTo})`,
              }}
            />

            {/* 이름 + 설명 */}
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-neutral-900 leading-tight truncate">
                {creator.name}
              </p>
              <p className="text-[13px] text-neutral-600 leading-tight truncate">
                {creator.description}
              </p>
            </div>

            {/* 팔로우 버튼 */}
            {creator.isFollowing ? (
              <button
                type="button"
                className="flex-shrink-0 border border-neutral-300 bg-neutral-200 text-neutral-600 rounded-[var(--radius-sm)] px-4 h-[34px] text-[13px]"
              >
                {tFollow('following')}
              </button>
            ) : (
              <button
                type="button"
                className="flex-shrink-0 border border-primary-700 text-primary-700 rounded-[var(--radius-sm)] px-4 h-[34px] text-[13px]"
              >
                {tFollow('follow')}
              </button>
            )}
          </li>
        ))}
      </ul>
    </FeedStateCard>
  )
}
