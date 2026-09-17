import { cookies } from 'next/headers'
import { ADMIN_SESSION_COOKIE, isValidSessionToken } from '@/lib/admin-auth'

export async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  return isValidSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)
}
