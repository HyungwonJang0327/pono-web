import { Newspaper, Search } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { FeedStateCard } from './FeedStateCard'

export async function FeedEmptyState() {
  const t = await getTranslations('feed')
  const descriptionLines = t('empty.description').split('\n')
  const description = (
    <>
      {descriptionLines.map((line, i) => (
        <span key={i}>{line}{i < descriptionLines.length - 1 && <br />}</span>
      ))}
    </>
  )

  return (
    <FeedStateCard
      iconBg="bg-primary-50"
      iconNode={<Newspaper size={28} className="text-primary-500" strokeWidth={1.5} />}
      title={t('empty.title')}
      description={description}
      action={
        <button
          type="button"
          className="w-full h-12 bg-primary-700 text-white rounded-[var(--radius-md)] flex items-center justify-center gap-2 text-[15px] font-medium"
        >
          <Search size={16} />
          {t('empty.exploreButton')}
        </button>
      }
    />
  )
}
