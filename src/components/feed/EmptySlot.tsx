'use client'

import { UserPlus } from 'lucide-react'

const MOCK_USER = {
  username: 'pono_user',
  avatar: null,
  bio: '포노에서 글을 씁니다',
}

function Avatar({ username }: { username: string }) {
  return (
    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
      <span className="text-sm font-semibold text-primary-700 leading-none">
        {username.charAt(0).toUpperCase()}
      </span>
    </div>
  )
}

export default function EmptySlot() {
  return (
    <div className="rounded-[var(--radius-md)] bg-white shadow-[var(--shadow-card)] flex flex-col items-center justify-center gap-3 p-4 text-center">
      <p className="text-[10px] text-neutral-400 font-medium tracking-wide">팔로우할 사람</p>
      {MOCK_USER.avatar ? (
        <img src={MOCK_USER.avatar} alt={MOCK_USER.username} className="w-10 h-10 rounded-full object-cover" />
      ) : (
        <Avatar username={MOCK_USER.username} />
      )}
      <div>
        <p className="text-xs font-semibold text-neutral-900 leading-tight">{MOCK_USER.username}</p>
        {MOCK_USER.bio && (
          <p className="text-[10px] text-neutral-500 mt-0.5 line-clamp-2 leading-tight">{MOCK_USER.bio}</p>
        )}
      </div>
      <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary-700 text-white text-[11px] font-semibold">
        <UserPlus size={11} strokeWidth={2} />
        팔로우
      </button>
    </div>
  )
}
