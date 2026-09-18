import { cookies } from 'next/headers'
import { ACCESS_TOKEN_COOKIE } from '@/lib/auth-cookie'

export class ClinicApiError extends Error {
  status: number
  errors?: string[]

  constructor(status: number, message: string, errors?: string[]) {
    super(message)
    this.name = 'ClinicApiError'
    this.status = status
    this.errors = errors
  }
}

function getClinicApiUrl() {
  const url = process.env.CLINIC_API_URL
  if (!url) {
    throw new ClinicApiError(500, 'CLINIC_API_URL is not configured')
  }
  return url.replace(/\/$/, '')
}

type ClinicFetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  auth?: boolean
}

export async function clinicFetch<T>(
  path: string,
  options: ClinicFetchOptions = {}
): Promise<T> {
  const { auth = false, body, headers: initHeaders, ...rest } = options
  const headers = new Headers(initHeaders)
  headers.set('Accept', 'application/json')

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (auth) {
    const cookieStore = await cookies()
    const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value
    if (token) {
      headers.set('Cookie', `${ACCESS_TOKEN_COOKIE}=${token}`)
    }
  }

  let response: Response
  try {
    response = await fetch(`${getClinicApiUrl()}${path}`, {
      ...rest,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store',
    })
  } catch {
    throw new ClinicApiError(503, 'Clinic API is unreachable')
  }

  const json = (await response.json().catch(() => null)) as {
    success?: boolean
    message?: string
    errors?: string[]
  } | null

  if (!response.ok || json?.success === false) {
    throw new ClinicApiError(
      response.status,
      json?.message || 'Request failed',
      json?.errors
    )
  }

  return json as T
}

export async function getSessionUser() {
  const cookieStore = await cookies()
  if (!cookieStore.get(ACCESS_TOKEN_COOKIE)?.value) return null

  try {
    const json = await clinicFetch<{
      data: { user: { id: string; email: string; role: string; fullName: string | null; phone: string | null; isActive: boolean } }
    }>('/api/auth/me', { auth: true })
    return json.data.user
  } catch {
    return null
  }
}
