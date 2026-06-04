import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const userAgent = request.headers.get('user-agent') ?? ''

  const isWebView = host.startsWith('app.') || userAgent.includes('PonoApp')

  const response = NextResponse.next()
  response.headers.set('x-is-webview', isWebView ? 'true' : 'false')

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
