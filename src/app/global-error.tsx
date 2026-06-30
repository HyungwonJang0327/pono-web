'use client'

import { useEffect } from 'react'

// 루트 레이아웃을 대체하므로 i18n Provider가 없다 → 고정 카피 사용.
// global-error는 자체 <html>/<body>를 정의해야 한다.
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="ko">
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
            문제가 생겼어요
          </h2>
          <p style={{ fontSize: '14px', color: '#57534E', margin: 0 }}>
            잠시 후 다시 시도해 주세요.
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
            다시 시도
          </button>
        </div>
      </body>
    </html>
  )
}

