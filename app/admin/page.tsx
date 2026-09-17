import type { Metadata } from 'next'
import DashboardAppointments from '@/app/components/DashboardAppointments'

export const metadata: Metadata = {
  title: 'Appointments',
}

export default function Admin() {
  return <DashboardAppointments />
}
