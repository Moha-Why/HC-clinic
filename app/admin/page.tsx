import type { Metadata } from 'next'
import DashboardAppointments from '@/app/components/DashboardAppointments'
import { getAppointments } from '@/app/admin/actions'
import type { Appointment } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Appointments',
}

export default async function Admin() {
  let appointments: Appointment[] = []
  let initialError: string | null = null
  try {
    appointments = await getAppointments()
  } catch (error) {
    initialError =
      error instanceof Error ? error.message : 'Failed to fetch appointments'
  }

  return (
    <DashboardAppointments
      initialAppointments={appointments}
      initialError={initialError}
    />
  )
}
