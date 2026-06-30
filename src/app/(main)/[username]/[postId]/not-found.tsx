import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function NotFound() {
  const t = await getTranslations('errors')
  const tNav = await getTranslations('nav')
  return (
    <div className="mx-auto w-full max-w-[560px] px-4 pt-20 flex flex-col items-center text-center">
      <h2 className="text-[17px] font-semibold text-neutral-900">{t('POST_NOT_FOUND')}</h2>
      <Link
        href="/"
        className="mt-5 h-11 px-5 inline-flex items-center justify-center rounded-[var(--radius-md)] bg-primary-700 text-white text-[15px] font-medium"
      >
        {tNav('home')}
      </Link>
    </div>
  )
}
