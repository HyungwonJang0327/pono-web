import React from 'react'

interface FeedStateCardProps {
  iconBg: string
  iconNode: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
  children?: React.ReactNode
}

export function FeedStateCard({
  iconBg,
  iconNode,
  title,
  description,
  action,
  children,
}: FeedStateCardProps) {
  return (
    <div className="px-6 pt-10 pb-8">
      {/* 아이콘 */}
      <div className="flex justify-center mb-6">
        <div
          className={`w-[76px] h-[76px] rounded-full flex items-center justify-center ${iconBg}`}
        >
          {iconNode}
        </div>
      </div>

      {/* 제목 */}
      <h3 className="text-[18px] font-semibold text-neutral-900 text-center tracking-tight mb-3">
        {title}
      </h3>

      {/* 설명 */}
      <p className="text-[14px] text-neutral-600 text-center leading-relaxed mb-6">
        {description}
      </p>

      {/* 버튼 */}
      {action}

      {/* 추가 콘텐츠 */}
      {children}
    </div>
  )
}
