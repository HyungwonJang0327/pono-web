import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

// 비로그인 직접 접근 차단 라우트 — 온보딩 username 설정은 인증 필수 (강제 플로우)
const isProtectedRoute = createRouteMatcher(['/onboarding(.*)'])

export default clerkMiddleware(async (auth, request: NextRequest) => {
  if (isProtectedRoute(request)) {
    await auth.protect()
  }

  const host = request.headers.get('host') ?? ''
  const userAgent = request.headers.get('user-agent') ?? ''

  const isWebView = host.startsWith('app.') || userAgent.includes('PonoApp')

  const response = NextResponse.next()
  response.headers.set('x-is-webview', isWebView ? 'true' : 'false')

  return response
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/__clerk/:path*',
  ],
}
