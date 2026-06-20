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
    <div className="px-4 pt-2 pb-6">
      {/* 아이콘 */}
      <div className="flex justify-center mb-4">
        <div
          className={`w-[56px] h-[56px] rounded-full flex items-center justify-center ${iconBg}`}
        >
          {iconNode}
        </div>
      </div>

      {/* 제목 */}
      <h3 className="text-[16px] font-semibold text-neutral-900 text-center tracking-tight mb-2">
        {title}
      </h3>

      {/* 설명 */}
      <p className="text-[13px] text-neutral-600 text-center leading-relaxed mb-5 break-keep">
        {description}
      </p>

      {/* 버튼 */}
      {action}

      {/* 추가 콘텐츠 */}
      {children}
    </div>
  )
}
