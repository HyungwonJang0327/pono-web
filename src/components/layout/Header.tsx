// 렌더링 전략: 서버 컴포넌트
// 현재 버튼 클릭 핸들러 없음. 추후 알림 기능 추가 시 'use client' 전환 필요.

export interface HeaderProps {
  isWebView?: boolean // 추후 WebView 분기용 (현재 미사용)
}

export default function Header({ isWebView }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-neutral-50 border-b border-neutral-200">
      <div className="mx-auto w-full max-w-[560px] px-5 py-3 flex items-center justify-between">
        <div className="w-6" />
        <h1 className="text-xl font-bold text-primary-700 italic tracking-tight">Pono</h1>
        <button className="relative w-6 h-6 flex items-center justify-center text-neutral-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-primary-500 rounded-full border border-neutral-50" />
        </button>
      </div>
    </header>
  )
}
