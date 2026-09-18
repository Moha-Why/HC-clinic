'use server'

import { ClinicApiError, clinicFetch } from '@/lib/clinic-api'
import type { Doctor, Slot } from '@/lib/types'

export async function getPublicDoctors(): Promise<Doctor[]> {
  const json = await clinicFetch<{ data: { doctors: Doctor[] } }>(
    '/api/doctors'
  )
  return (json.data.doctors || []).filter((doctor) => doctor.is_active)
}

export async function getDoctorSlots(
  doctorId: string,
  from: string,
  to: string
): Promise<{ timeZone: string; slots: Slot[] }> {
  const params = new URLSearchParams({ from, to })
  const json = await clinicFetch<{
    data: { timeZone: string; slots: Slot[] }
  }>(`/api/doctors/${doctorId}/slots?${params.toString()}`)
  return json.data
}

export async function bookAppointment(input: {
  fullName: string
  phoneNumber: string
  doctorId: string
  appointmentStartAt: string
  notes?: string
}): Promise<{ error?: string }> {
  try {
    await clinicFetch('/api/appointments', {
      method: 'POST',
      body: {
        patient: {
          full_name: input.fullName,
          phone: input.phoneNumber,
        },
        appointment: {
          doctor_id: input.doctorId,
          appointment_start_at: input.appointmentStartAt,
          notes: input.notes || undefined,
        },
      },
    })
    return {}
  } catch (error) {
    if (error instanceof ClinicApiError) {
      return {
        error: error.errors?.join(' ') || error.message,
      }
    }
    return { error: 'Booking failed. Please try again or call us directly.' }
  }
}
