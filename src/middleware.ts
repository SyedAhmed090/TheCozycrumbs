import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/admin-session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  const session = request.cookies.get('admin_session')?.value
  const secret = process.env.ADMIN_PASSWORD

  if (!session || !secret || !(await verifySessionToken(session, secret))) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
