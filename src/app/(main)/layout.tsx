import { Header, BottomNav } from '@/components/layout'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      {/* 피드 */}
      <main className="mx-auto w-full max-w-[560px] px-3.5 py-3">
        {children}
      </main>

      <BottomNav />
    </div>
  )
}
