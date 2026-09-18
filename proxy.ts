import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ACCESS_TOKEN_COOKIE } from '@/lib/auth-cookie'

function redirectToLogin(request: NextRequest) {
  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = '/admin/login'
  loginUrl.search = ''
  return NextResponse.redirect(loginUrl)
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
  const apiUrl = process.env.CLINIC_API_URL
  if (!token || !apiUrl) {
    return redirectToLogin(request)
  }

  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, '')}/api/auth/me`, {
      headers: {
        Accept: 'application/json',
        Cookie: `${ACCESS_TOKEN_COOKIE}=${token}`,
      },
      cache: 'no-store',
    })
    const json = (await response.json().catch(() => null)) as {
      data?: { user?: { role?: string } }
    } | null

    if (response.ok && json?.data?.user?.role === 'admin') {
      return NextResponse.next()
    }
  } catch {
    return redirectToLogin(request)
  }

  return redirectToLogin(request)
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
