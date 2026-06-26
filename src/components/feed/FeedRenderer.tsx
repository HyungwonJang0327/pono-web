import { FeedItemDto } from '@/types/post'
import { groupFeedItems } from '@/lib/feed'
import ArticleCard from './ArticleCard'
import SnapMiniCard from './SnapMiniCard'
import EmptySlot from './EmptySlot'

interface FeedRendererProps {
  items: FeedItemDto[]
}

export default function FeedRenderer({ items }: FeedRendererProps) {
  const groups = groupFeedItems(items)

  return (
    <div className="flex flex-col gap-2.5">
      {groups.map((group, idx) => {
        if (group.type === 'article') {
          return <ArticleCard key={group.item.id} post={group.item} />
        }

        const [first, second] = group.items
        return (
          <div key={`snap-row-${idx}`} className="grid grid-cols-2 gap-2">
            <SnapMiniCard post={first} aspectRatio={group.ratio} />
            {second
              ? <SnapMiniCard post={second} aspectRatio={group.ratio} />
              : <EmptySlot />
            }
          </div>
        )
      })}
    </div>
  )
}
