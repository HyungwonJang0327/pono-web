// Global manual mock for next-intl (ESM module).
//
// Jest cannot transform next-intl's ESM build, and tests assert on namespaced
// translation keys (e.g. "profile.noPost", "follow.followerCount:{...}").
//
// useTranslations(namespace) returns a translator that echoes the fully
// qualified key. When params are passed, they are appended as JSON so tests can
// assert interpolation arguments.
//
//   const t = useTranslations('error')
//   t('networkTitle')              -> "error.networkTitle"
//   t('foo', { count: 3 })         -> "error.foo:{\"count\":3}"
//
// A namespace-less call (useTranslations()) just returns the bare key.

function useTranslations(namespace) {
  const prefix = namespace ? `${namespace}.` : ''
  return (key, params) => {
    const fullKey = `${prefix}${key}`
    if (params !== undefined) return `${fullKey}:${JSON.stringify(params)}`
    return fullKey
  }
}

function useFormatter() {
  return {
    dateTime: (value) => String(value),
    number: (value) => String(value),
    relativeTime: (value) => String(value),
    list: (value) => String(value),
  }
}

function useLocale() {
  return 'ko'
}

const NextIntlClientProvider = ({ children }) => children

module.exports = {
  useTranslations,
  useFormatter,
  useLocale,
  NextIntlClientProvider,
}
