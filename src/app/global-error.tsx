'use client'

import { useEffect, useState } from 'react'

// 루트 레이아웃을 대체하므로 next-intl Provider가 없다.
// 쿠키/브라우저 언어로 로케일을 추정해 자체 사전에서 카피를 고른다.
// global-error는 자체 <html>/<body>를 정의해야 한다.
const COPY = {
  ko: { title: '문제가 생겼어요', description: '잠시 후 다시 시도해 주세요.', retry: '다시 시도' },
  en: { title: 'Something went wrong', description: 'Please try again in a moment.', retry: 'Try again' },
  ja: { title: '問題が発生しました', description: 'しばらくしてからもう一度お試しください。', retry: '再試行' },
} as const

type Locale = keyof typeof COPY

function detectLocale(): Locale {
  if (typeof document !== 'undefined') {
    const cookie = document.cookie.split('; ').find((c) => c.startsWith('locale='))?.split('=')[1]
    if (cookie && cookie in COPY) return cookie as Locale
  }
  if (typeof navigator !== 'undefined') {
    const lang = navigator.language.split('-')[0]
    if (lang in COPY) return lang as Locale
  }
  return 'ko'
}

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  // 초기 SSR은 ko로 렌더하고 마운트 후 추정 로케일로 보정 (hydration 안전)
  const [locale, setLocale] = useState<Locale>('ko')

  useEffect(() => {
    console.error(error)
    setLocale(detectLocale())
  }, [error])

  const copy = COPY[locale]

  return (
    <html lang={locale}>
      <body style={{ margin: 0 }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            padding: '24px',
            background: '#FDFCF9',
            fontFamily: 'system-ui, sans-serif',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#1C1917', margin: 0 }}>
            {copy.title}
          </h2>
          <p style={{ fontSize: '14px', color: '#57534E', margin: 0 }}>
            {copy.description}
          </p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            style={{
              height: '44px',
              padding: '0 20px',
              borderRadius: '12px',
              border: 'none',
              background: '#1F4D3A',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            {copy.retry}
          </button>
        </div>
      </body>
    </html>
  )
}

