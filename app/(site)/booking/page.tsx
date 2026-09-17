import type { Metadata } from 'next'
import BookingAltContact from '@/app/components/BookingAltContact'
import BookingForm from '@/app/components/BookingForm'
import BookingHero from '@/app/components/BookingHero'

export const metadata: Metadata = {
  title: 'Book Appointment',
}

export default function Booking() {
  return (
    <>
      <BookingHero />
      <BookingForm />
      <BookingAltContact />
    </>
  )
}
