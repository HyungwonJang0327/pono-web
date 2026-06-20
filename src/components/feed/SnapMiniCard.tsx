import { SnapFeedItemDto } from '@/types/post'
import { SnapLikeButton } from '@/components/ui'

interface SnapMiniCardProps {
  post: SnapFeedItemDto
  aspectRatio: '1/1' | '4/5'
}

function AvatarFallback({ username }: { username: string }) {
  return (
    <div className="w-4 h-4 rounded-full bg-neutral-200 flex items-center justify-center flex-shrink-0">
      <span className="text-[9px] font-semibold text-neutral-600 leading-none">
        {username.charAt(0).toUpperCase()}
      </span>
    </div>
  )
}

export default function SnapMiniCard({ post, aspectRatio }: SnapMiniCardProps) {
  const image = post.images[0]
  const aspectClass = aspectRatio === '4/5' ? 'aspect-[4/5]' : 'aspect-square'

  return (
    <div className="bg-white rounded-[var(--radius-md)] overflow-hidden shadow-[var(--shadow-card)]">
      {/* 이미지 */}
      <div className={`relative w-full ${aspectClass} bg-neutral-200`}>
        {image?.url && (
          <img
            src={image.url}
            alt={post.caption ?? undefined}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* 캡션 + 메타 */}
      <div className="px-2.5 pt-2 pb-2.5">
        {post.caption && (
          <p className="text-[11px] text-neutral-800 leading-[1.4] mb-1.5 line-clamp-2">
            {post.caption}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 min-w-0">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.username}
                className="w-4 h-4 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <AvatarFallback username={post.author.username} />
            )}
            <span className="text-[10px] text-neutral-500 truncate max-w-[60px]">
              {post.author.username}
            </span>
          </div>
          <SnapLikeButton
            isLiked={post.likedByMe}
            count={post.likeCount}
            onToggle={() => {}}
          />
        </div>
      </div>
    </div>
  )
}
