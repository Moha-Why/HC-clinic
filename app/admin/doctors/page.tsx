import type { Metadata } from 'next'
import DoctorsAdmin from '@/app/components/DoctorsAdmin'
import { getAdminDoctors } from '@/app/admin/doctors/actions'
import type { Doctor } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Doctors',
}

export default async function AdminDoctorsPage() {
  let doctors: Doctor[] = []
  let initialError: string | null = null
  try {
    doctors = await getAdminDoctors()
  } catch (error) {
    initialError =
      error instanceof Error ? error.message : 'Failed to load doctors'
  }

  return (
    <DoctorsAdmin initialDoctors={doctors} initialError={initialError} />
  )
}
