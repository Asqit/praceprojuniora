import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'admin_session'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get(COOKIE_NAME)?.value
  const isSignin = pathname.startsWith('/admin/signin')

  if (!token && !isSignin) {
    return NextResponse.redirect(new URL('/admin/signin', req.url))
  }

  if (token && isSignin) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
