'use server'

import { timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_SESSION_COOKIE, createSessionToken } from '@/lib/admin-auth'

export type LoginState = { error: string } | undefined

function passwordsMatch(input: string, expected: string): boolean {
  const inputBuffer = Buffer.from(input)
  const expectedBuffer = Buffer.from(expected)
  if (inputBuffer.length !== expectedBuffer.length) return false
  return timingSafeEqual(inputBuffer, expectedBuffer)
}

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) {
    return { error: 'Admin password is not configured on the server.' }
  }

  const password = String(formData.get('password') ?? '')
  if (!passwordsMatch(password, expected)) {
    return { error: 'Incorrect password.' }
  }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  redirect('/admin')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_SESSION_COOKIE)
  redirect('/admin/login')
}
