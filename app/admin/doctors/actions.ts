'use server'

import { ClinicApiError, clinicFetch } from '@/lib/clinic-api'
import type { AvailabilityWindow, Doctor } from '@/lib/types'

export async function getAdminDoctors(): Promise<Doctor[]> {
  const json = await clinicFetch<{ data: { doctors: Doctor[] } }>(
    '/api/doctors',
    { auth: true }
  )
  return json.data.doctors || []
}

export async function createDoctor(input: {
  doctor: {
    full_name: string
    specialty?: string
    phone?: string
    appointment_duration_minutes?: number
    is_active?: boolean
  }
  availability: AvailabilityWindow[]
}): Promise<{ error?: string }> {
  try {
    await clinicFetch('/api/doctors', {
      method: 'POST',
      auth: true,
      body: input,
    })
    return {}
  } catch (error) {
    if (error instanceof ClinicApiError) {
      return { error: error.errors?.join(' ') || error.message }
    }
    return { error: 'Failed to create doctor' }
  }
}

export async function updateDoctor(
  id: string,
  input: {
    doctor?: {
      full_name?: string
      specialty?: string
      phone?: string
      appointment_duration_minutes?: number
      is_active?: boolean
    }
    availability?: AvailabilityWindow[]
  }
): Promise<{ error?: string }> {
  try {
    await clinicFetch(`/api/doctors/${id}`, {
      method: 'PUT',
      auth: true,
      body: input,
    })
    return {}
  } catch (error) {
    if (error instanceof ClinicApiError) {
      return { error: error.errors?.join(' ') || error.message }
    }
    return { error: 'Failed to update doctor' }
  }
}

export async function deleteDoctor(id: string): Promise<{ error?: string }> {
  try {
    await clinicFetch(`/api/doctors/${id}`, {
      method: 'DELETE',
      auth: true,
    })
    return {}
  } catch (error) {
    if (error instanceof ClinicApiError) {
      return { error: error.message }
    }
    return { error: 'Failed to delete doctor' }
  }
}
