import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'

const SUPPORTED = ['ko', 'en', 'ja'] as const
type Locale = (typeof SUPPORTED)[number]

function parseAcceptLanguage(value: string | null): Locale {
  if (!value) return 'ko'
  const lang = value.split(',')[0].split('-')[0].trim()
  return (SUPPORTED as readonly string[]).includes(lang) ? (lang as Locale) : 'ko'
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const headerStore = await headers()

  const isWebView = headerStore.get('x-is-webview') === 'true'

  let locale: Locale
  if (isWebView) {
    const xLocale = headerStore.get('x-locale') ?? ''
    locale = (SUPPORTED as readonly string[]).includes(xLocale) ? (xLocale as Locale) : 'ko'
  } else {
    const cookie = cookieStore.get('locale')?.value
    locale =
      cookie && (SUPPORTED as readonly string[]).includes(cookie)
        ? (cookie as Locale)
        : parseAcceptLanguage(headerStore.get('accept-language'))
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
