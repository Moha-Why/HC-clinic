import type { Metadata } from 'next'
import AboutPage from '@/app/components/AboutPage'

export const metadata: Metadata = {
  title: 'About',
}

export default function About() {
  return <AboutPage />
}
