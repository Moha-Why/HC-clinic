import type { Metadata } from 'next'
import ContactCard from '@/app/components/ContactCard'
import ContactHero from '@/app/components/ContactHero'

export const metadata: Metadata = {
  title: 'Contact',
}

export default function Contact() {
  return (
    <>
      <ContactHero />
      <ContactCard />
    </>
  )
}
