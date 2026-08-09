import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Domain migration: carlocksmithdubai.com → locksmith-dubai.com
// Belt-and-suspenders alongside next.config.mjs redirects.
// Middleware runs at the Vercel edge and guarantees an explicit HTTP 301.
const OLD_DOMAINS = new Set(['carlocksmithdubai.com', 'www.carlocksmithdubai.com'])

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''

  // Old domain → new domain (path + query string preserved)
  if (OLD_DOMAINS.has(host)) {
    const { pathname, search } = request.nextUrl
    return NextResponse.redirect(
      `https://locksmith-dubai.com${pathname}${search}`,
      { status: 301 },
    )
  }

  const { pathname } = request.nextUrl

  // 301: /en → /   and   /en/* → /*
  // English is the default locale — no /en prefix needed.
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname === '/en' ? '/' : pathname.slice(3)
    return NextResponse.redirect(url, { status: 301 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/'],
}
