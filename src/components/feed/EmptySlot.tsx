'use client'

import { useState } from 'react'

const MOCK_CREATORS = [
  { id: '1', username: '이도현', desc: 'Slow Letters · 아티클 42', color: '#1F4D3A' },
  { id: '2', username: '김서연', desc: '일상 스냅 · 팔로워 1.2K', color: '#B8A898' },
  { id: '3', username: '정우성', desc: '도시를 떠나 · 아티클 18', color: '#8A9BB0' },
  { id: '4', username: '윤소희', desc: '글쓰기 연구소 · 팔로워 860', color: '#7A9E7A' },
]

function CreatorRow({ creator }: { creator: typeof MOCK_CREATORS[0] }) {
  const [following, setFollowing] = useState(creator.id === '3')

  return (
    <div className="flex items-center gap-2">
      <div
        className="w-9 h-9 rounded-full flex-shrink-0"
        style={{ backgroundColor: creator.color }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-neutral-900 truncate">{creator.username}</p>
        <p className="text-[10px] text-neutral-500 truncate">{creator.desc}</p>
      </div>
      <button
        onClick={() => setFollowing(f => !f)}
        className={[
          'text-[10px] font-semibold px-2.5 py-1 rounded flex-shrink-0',
          following
            ? 'bg-neutral-100 text-neutral-500'
            : 'border border-primary-700 text-primary-700',
        ].join(' ')}
      >
        {following ? '팔로잉' : '팔로우'}
      </button>
    </div>
  )
}

export default function EmptySlot() {
  return (
    <div className="flex flex-col p-3 gap-2.5">
      <span className="text-xs font-semibold text-neutral-900">추천 크리에이터</span>
      {MOCK_CREATORS.map(c => <CreatorRow key={c.id} creator={c} />)}
    </div>
  )
}
