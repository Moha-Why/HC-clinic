'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  ACCESS_TOKEN_COOKIE,
  accessTokenCookieOptions,
} from '@/lib/auth-cookie'
import { ClinicApiError, clinicFetch } from '@/lib/clinic-api'
import type { Appointment } from '@/lib/types'

export type LoginState = { error: string } | undefined

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  try {
    const json = await clinicFetch<{
      data: { token: string }
    }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })

    const token = json.data?.token
    if (!token) {
      return { error: 'Login did not return a session token.' }
    }

    const cookieStore = await cookies()
    cookieStore.set(ACCESS_TOKEN_COOKIE, token, accessTokenCookieOptions())
  } catch (error) {
    if (error instanceof ClinicApiError) {
      return { error: error.message }
    }
    return { error: 'Unable to sign in. Try again.' }
  }

  redirect('/admin')
}

export async function logout() {
  try {
    await clinicFetch('/api/auth/logout', { method: 'POST', auth: true })
  } catch {
    // Still drop the Next cookie so the browser session ends.
  }

  const cookieStore = await cookies()
  cookieStore.delete(ACCESS_TOKEN_COOKIE)
  redirect('/admin/login')
}

export async function getAppointments(): Promise<Appointment[]> {
  const json = await clinicFetch<{ data: { appointments: Appointment[] } }>(
    '/api/appointments',
    { auth: true }
  )
  return json.data.appointments
}

async function statusAction(
  path: string,
  fallback: string,
  body?: unknown
): Promise<{ error?: string }> {
  try {
    await clinicFetch(path, {
      method: 'PUT',
      auth: true,
      body,
    })
    return {}
  } catch (error) {
    if (error instanceof ClinicApiError) {
      return { error: error.message }
    }
    return { error: fallback }
  }
}

export async function cancelAppointment(
  id: string,
  cancellationReason: string
): Promise<{ error?: string }> {
  return statusAction(
    `/api/appointments/${id}/cancel`,
    'Failed to cancel appointment',
    { cancellation_reason: cancellationReason }
  )
}

export async function completeAppointment(
  id: string
): Promise<{ error?: string }> {
  return statusAction(
    `/api/appointments/${id}/complete`,
    'Failed to complete appointment'
  )
}

export async function markNoShow(id: string): Promise<{ error?: string }> {
  return statusAction(
    `/api/appointments/${id}/no-show`,
    'Failed to mark no-show'
  )
}
