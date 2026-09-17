import ClinicDetails from '@/app/components/ClinicDetails'
import DoctorHighlight from '@/app/components/DoctorHighlight'
import Hero from '@/app/components/Hero'
import Services from '@/app/components/Services'

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <DoctorHighlight />
      <ClinicDetails />
    </>
  )
}
