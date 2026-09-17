import type { Metadata } from 'next'
import ServicesCTA from '@/app/components/ServicesCTA'
import ServicesHero from '@/app/components/ServicesHero'
import ServicesList from '@/app/components/ServicesList'
import ServiceProcess from '@/app/components/ServicesProcess'

export const metadata: Metadata = {
  title: 'Services',
}

export default function Services() {
  return (
    <>
      <ServicesHero />
      <ServicesList />
      <ServiceProcess />
      <ServicesCTA />
    </>
  )
}
