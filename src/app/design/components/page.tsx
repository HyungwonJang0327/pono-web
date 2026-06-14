'use client'

import { useState } from 'react'
import { BookmarkButton } from '@/components/ui/BookmarkButton'
import { Skeleton } from '@/components/ui/Skeleton'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { SnapLikeButton } from '@/components/ui/SnapLikeButton'
import { ArticleLikeButton } from '@/components/ui/ArticleLikeButton'
import { useToast } from '@/hooks/useToast'

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-16">

        <div>
          <h1 className="text-2xl font-bold text-primary-700 italic mb-1">Pono</h1>
          <p className="text-sm text-neutral-500">Common Components · UI Kit</p>
        </div>

        <ToastSection />
        <SkeletonSection />
        <BookmarkSection />
        <ErrorBoundarySection />
        <BottomSheetSection />
        <SnapLikeButtonSection />
        <ArticleLikeButtonSection />

      </div>
    </div>
  )
}

/* ── Toast ── */
function ToastSection() {
  const toast = useToast()
  return (
    <section className="space-y-4">
      <SectionTitle>Toast</SectionTitle>
      <div className="bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(28,25,23,0.06)] space-y-6">

        <div className="space-y-2">
          <Label>트리거 버튼</Label>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => toast.success('포스트가 게시됐어요.')}
              className="h-10 px-5 rounded-[10px] bg-primary-700 text-white text-[13px] font-semibold hover:bg-primary-800 transition-colors"
            >
              Success Toast
            </button>
            <button
              onClick={() => toast.error('오류가 발생했어요. 다시 시도해 주세요.')}
              className="h-10 px-5 rounded-[10px] bg-[#B54040] text-white text-[13px] font-semibold hover:opacity-90 transition-opacity"
            >
              Error Toast
            </button>
            <button
              onClick={() => toast.info('임시저장되었습니다.')}
              className="h-10 px-5 rounded-[10px] bg-neutral-800 text-white text-[13px] font-semibold hover:bg-neutral-900 transition-colors"
            >
              Info Toast
            </button>
          </div>
          <p className="text-[11px] text-neutral-400">버튼 클릭 시 화면 하단 중앙에 3초 뒤 자동 사라짐</p>
        </div>

        <div className="space-y-2">
          <Label>외관 미리보기 (Static)</Label>
          <div className="flex flex-col gap-2 items-start">
            {[
              { bg: 'bg-primary-700', icon: <CheckIcon />, msg: '포스트가 게시됐어요.' },
              { bg: 'bg-[#B54040]',  icon: <XIcon />,     msg: '오류가 발생했어요. 다시 시도해 주세요.' },
              { bg: 'bg-neutral-800',icon: <InfoIcon />,  msg: '임시저장되었습니다.' },
            ].map(({ bg, icon, msg }) => (
              <div
                key={msg}
                className={`flex items-center gap-[10px] px-5 py-[14px] rounded-[10px] shadow-[0_4px_16px_rgba(28,25,23,0.10)] text-white text-[14px] font-medium min-w-[220px] max-w-[320px] ${bg}`}
              >
                <span className="w-4 h-4 shrink-0 flex items-center justify-center">{icon}</span>
                <span>{msg}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

/* ── Skeleton ── */
function SkeletonSection() {
  return (
    <section className="space-y-4">
      <SectionTitle>Skeleton</SectionTitle>
      <div className="bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(28,25,23,0.06)] space-y-6">

        <div className="space-y-2">
          <Label>아티클 카드 스켈레톤</Label>
          <div className="bg-white rounded-[16px] overflow-hidden shadow-[0_1px_4px_rgba(28,25,23,0.06)]">
            <Skeleton className="w-full aspect-[16/9]" />
            <div className="px-3 pt-3 pb-3.5 space-y-2">
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-3 w-[75%]" />
              <Skeleton className="h-3 w-[60%]" />
              <div className="flex items-center gap-2 pt-1">
                <Skeleton variant="circle" className="w-4 h-4" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-12 ml-auto" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>스냅 카드 스켈레톤 × 2열</Label>
          <div className="grid grid-cols-2 gap-2">
            {[0, 1].map((i) => (
              <div key={i} className="bg-white rounded-[10px] overflow-hidden shadow-[0_1px_4px_rgba(28,25,23,0.06)]">
                <Skeleton className="w-full aspect-square" />
                <div className="px-2.5 pt-2 pb-2.5 space-y-1.5">
                  <Skeleton className="h-3 w-[80%]" />
                  <Skeleton className="h-3 w-[60%]" />
                  <div className="flex items-center gap-1 pt-0.5">
                    <Skeleton variant="circle" className="w-4 h-4" />
                    <Skeleton className="h-2.5 w-14" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>variant</Label>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <Skeleton className="w-24 h-6" />
              <span className="text-[10px] text-neutral-400">rect (기본)</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Skeleton variant="circle" className="w-10 h-10" />
              <span className="text-[10px] text-neutral-400">circle</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

/* ── BookmarkButton ── */
function BookmarkSection() {
  const [saved, setSaved] = useState(false)
  return (
    <section className="space-y-4">
      <SectionTitle>BookmarkButton</SectionTitle>
      <div className="bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(28,25,23,0.06)] space-y-4">

        <div className="space-y-2">
          <Label>인터랙티브 (클릭해보세요)</Label>
          <div className="flex items-center gap-3">
            <BookmarkButton isBookmarked={saved} onToggle={() => setSaved(v => !v)} />
            <span className="text-[12px] text-neutral-500">{saved ? '저장됨 (primary-700)' : '미저장 (neutral-400)'}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>상태 비교</Label>
          <div className="flex gap-8">
            <div className="flex flex-col items-center gap-1.5">
              <BookmarkButton isBookmarked={false} onToggle={() => {}} />
              <span className="text-[10px] text-neutral-400">비활성</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <BookmarkButton isBookmarked={true} onToggle={() => {}} />
              <span className="text-[10px] text-neutral-400">활성</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

/* ── ErrorBoundary Fallback ── */
function ErrorBoundarySection() {
  return (
    <section className="space-y-4">
      <SectionTitle>ErrorBoundary Fallback</SectionTitle>
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(28,25,23,0.06)] overflow-hidden">
        <div className="flex flex-col items-center justify-center gap-[10px] py-10 px-6 text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4D1CA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p className="text-[15px] font-semibold text-neutral-700">문제가 생겼어요</p>
          <p className="text-[13px] text-neutral-500 leading-relaxed">잠시 후 다시 시도해 주세요.</p>
          <button
            type="button"
            className="mt-1 px-5 py-[10px] rounded-[10px] bg-primary-700 text-white text-[13px] font-semibold hover:bg-primary-800 transition-colors duration-200"
          >
            다시 시도
          </button>
        </div>
      </div>
    </section>
  )
}

/* ── BottomSheet ── */
function BottomSheetSection() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="space-y-4">
      <SectionTitle>BottomSheet</SectionTitle>
      <div className="bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(28,25,23,0.06)] space-y-4">

        <div className="space-y-2">
          <Label>인터랙티브 (클릭해보세요)</Label>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="h-10 px-5 rounded-[10px] bg-primary-700 text-white text-[13px] font-semibold hover:bg-primary-800 transition-colors"
          >
            작성 진입점 열기
          </button>
          <p className="text-[11px] text-neutral-400">오버레이 클릭 또는 ESC 키로 닫힘</p>
        </div>

        <div className="space-y-2">
          <Label>스펙</Label>
          <div className="flex flex-wrap gap-1.5">
            {[
              'overlay: rgba(28,25,23,0.4)',
              'sheet bg: #FFFFFF',
              'border-radius: 16px 16px 0 0',
              'handle: 32×4px · #D4D1CA · rounded-full',
              'body padding: 16px 20px + safe-area-inset-bottom',
              'enter: translateY(100%) → 0 · 300ms ease-out',
              'exit: translateY(0) → 100% · 250ms ease-in',
            ].map((spec) => (
              <span
                key={spec}
                className="inline-block text-[11px] font-medium text-neutral-600 bg-neutral-100 rounded-[6px] px-2 py-0.5"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

      </div>

      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <p className="text-[13px] font-semibold text-neutral-600 mb-3">무엇을 올릴까요?</p>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-3.5 w-full px-4 py-3.5 rounded-[10px] hover:bg-neutral-100 transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-[6px] bg-neutral-100 flex items-center justify-center shrink-0">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#4A4742" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-semibold text-neutral-900 tracking-tight">스냅 올리기</span>
            <span className="text-[12px] text-neutral-500">사진 한 장으로 순간을 기록해요</span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-3.5 w-full px-4 py-3.5 rounded-[10px] hover:bg-neutral-100 transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-[6px] bg-neutral-100 flex items-center justify-center shrink-0">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#4A4742" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-semibold text-neutral-900 tracking-tight">아티클 쓰기</span>
            <span className="text-[12px] text-neutral-500">생각을 글로 풀어보세요</span>
          </div>
        </button>
      </BottomSheet>
    </section>
  )
}

/* ── SnapLikeButton ── */
function SnapLikeButtonSection() {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(24)

  function handleToggle() {
    setLiked((v) => {
      const next = !v
      setCount(next ? 25 : 24)
      return next
    })
  }

  return (
    <section className="space-y-4">
      <SectionTitle>SnapLikeButton</SectionTitle>
      <div className="bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(28,25,23,0.06)] space-y-6">

        <div className="space-y-2">
          <Label>인터랙티브 (클릭해보세요)</Label>
          <div className="flex items-center gap-3">
            <SnapLikeButton isLiked={liked} count={count} onToggle={handleToggle} />
            <span className="text-[12px] text-neutral-500">
              {liked ? '활성 (primary-500 · #2D8463)' : '비활성 (neutral-400)'}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>상태 비교</Label>
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col items-center gap-1.5">
              <SnapLikeButton isLiked={false} onToggle={() => {}} />
              <span className="text-[10px] text-neutral-400">비활성</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <SnapLikeButton isLiked={true} onToggle={() => {}} />
              <span className="text-[10px] text-neutral-400">활성</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <SnapLikeButton isLiked={false} count={24} onToggle={() => {}} />
              <span className="text-[10px] text-neutral-400">비활성 + 숫자</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <SnapLikeButton isLiked={true} count={25} onToggle={() => {}} />
              <span className="text-[10px] text-neutral-400">활성 + 숫자</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>스냅 카드 내 배치 예시</Label>
          <div className="bg-white rounded-[10px] border border-neutral-200 overflow-hidden shadow-[0_1px_4px_rgba(28,25,23,0.06)] w-40">
            <div className="w-full aspect-square bg-neutral-200" />
            <div className="px-2.5 py-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-neutral-300" />
                <span className="text-[12px] font-medium text-neutral-700">username</span>
              </div>
              <SnapLikeButton isLiked={liked} count={count} onToggle={handleToggle} />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

/* ── ArticleLikeButton ── */
function ArticleLikeButtonSection() {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(128)

  function handleToggle() {
    setLiked((v) => {
      const next = !v
      setCount(next ? 129 : 128)
      return next
    })
  }

  return (
    <section className="space-y-4">
      <SectionTitle>ArticleLikeButton</SectionTitle>
      <div className="bg-white rounded-2xl p-6 shadow-[0_1px_4px_rgba(28,25,23,0.06)] space-y-6">

        <div className="space-y-2">
          <Label>인터랙티브 (클릭해보세요)</Label>
          <div className="flex items-center gap-3">
            <ArticleLikeButton isLiked={liked} count={count} onToggle={handleToggle} />
            <span className="text-[12px] text-neutral-500">
              {liked ? '활성 (primary-700 · #1F4D3A)' : '비활성 (neutral-400)'}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>상태 비교</Label>
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col items-center gap-1.5">
              <ArticleLikeButton isLiked={false} onToggle={() => {}} />
              <span className="text-[10px] text-neutral-400">비활성</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <ArticleLikeButton isLiked={true} onToggle={() => {}} />
              <span className="text-[10px] text-neutral-400">활성</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <ArticleLikeButton isLiked={false} count={128} onToggle={() => {}} />
              <span className="text-[10px] text-neutral-400">비활성 + 숫자</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <ArticleLikeButton isLiked={true} count={129} onToggle={() => {}} />
              <span className="text-[10px] text-neutral-400">활성 + 숫자</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>아티클 카드 내 배치 예시</Label>
          <div className="bg-white rounded-[10px] border border-neutral-200 overflow-hidden shadow-[0_1px_4px_rgba(28,25,23,0.06)] w-72">
            <div className="w-full aspect-video bg-neutral-200" />
            <div className="px-3.5 py-3">
              <p className="text-[14px] font-bold text-neutral-900 leading-snug mb-1.5 tracking-tight">아티클 제목이 여기에 들어가요</p>
              <p className="text-[12px] text-neutral-500 leading-relaxed mb-3">요약 텍스트가 한두 줄 정도 들어갑니다.</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-[18px] h-[18px] rounded-full bg-neutral-300" />
                  <span className="text-[12px] font-medium text-neutral-600">작가 이름</span>
                  <span className="text-[11px] text-neutral-400">· 3분</span>
                </div>
                <ArticleLikeButton isLiked={liked} count={count} onToggle={handleToggle} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

/* ── 공통 레이아웃 컴포넌트 ── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[13px] font-semibold text-neutral-400 uppercase tracking-widest">
      {children}
    </h2>
  )
}
function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] text-neutral-400">{children}</p>
}

/* ── Toast 아이콘 ── */
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}
function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}
function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><line x1="12" y1="12" x2="12" y2="16"/>
    </svg>
  )
}
