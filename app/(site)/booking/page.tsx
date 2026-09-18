import type { Metadata } from 'next'
import BookingAltContact from '@/app/components/BookingAltContact'
import BookingForm from '@/app/components/BookingForm'
import BookingHero from '@/app/components/BookingHero'
import { getDoctorSlots, getPublicDoctors } from '@/app/booking/actions'
import type { Doctor, Slot } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Book Appointment',
}

function todayInTz(timeZone: string) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function addDaysIso(isoDate: string, days: number) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10)
}

export default async function Booking() {
  let doctors: Doctor[] = []
  try {
    doctors = await getPublicDoctors()
  } catch {
    doctors = []
  }

  let initialSlots: Slot[] = []
  let initialTimeZone = 'Africa/Cairo'
  if (doctors.length === 1) {
    try {
      const today = todayInTz(initialTimeZone)
      const result = await getDoctorSlots(
        doctors[0].id,
        today,
        addDaysIso(today, 13)
      )
      initialSlots = result.slots
      initialTimeZone = result.timeZone
    } catch {
      initialSlots = []
    }
  }

  return (
    <>
      <BookingHero />
      <BookingForm
        doctors={doctors}
        initialSlots={initialSlots}
        initialTimeZone={initialTimeZone}
      />
      <BookingAltContact />
    </>
  )
}
