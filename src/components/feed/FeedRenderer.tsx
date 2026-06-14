import { FeedItemDto, SnapFeedItemDto, ArticleFeedItemDto } from '@/types/post'
import ArticleCard from './ArticleCard'
import SnapMiniCard from './SnapMiniCard'
import EmptySlot from './EmptySlot'

type AspectRatio = '1/1' | '4/5'

function getAspectRatio(width: number, height: number): AspectRatio {
  return height / width >= 1.15 ? '4/5' : '1/1'
}

type FeedGroup =
  | { type: 'article'; item: ArticleFeedItemDto }
  | { type: 'snap-row'; items: [SnapFeedItemDto, SnapFeedItemDto | null]; ratio: AspectRatio }

function groupFeedItems(items: FeedItemDto[]): FeedGroup[] {
  const groups: FeedGroup[] = []
  let i = 0

  while (i < items.length) {
    if (items[i].type === 'article') {
      groups.push({ type: 'article', item: items[i] as ArticleFeedItemDto })
      i++
    } else {
      const snaps: SnapFeedItemDto[] = []
      while (i < items.length && items[i].type === 'snap') {
        snaps.push(items[i++] as SnapFeedItemDto)
      }
      for (let j = 0; j < snaps.length; j += 2) {
        const first = snaps[j]
        const second = snaps[j + 1] ?? null
        const firstImage = first.images[0]
        const ratio = firstImage
          ? getAspectRatio(firstImage.width, firstImage.height)
          : '1/1'
        // 홀수 마지막 스냅은 항상 1:1
        const finalRatio: AspectRatio = second === null ? '1/1' : ratio
        groups.push({ type: 'snap-row', items: [first, second], ratio: finalRatio })
      }
    }
  }

  return groups
}

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
