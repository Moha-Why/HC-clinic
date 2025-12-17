import DoctorHighlight from "../components/DoctorHighlight"
import Hero from "../components/Hero"
import Services from "../components/Services"
import ClinicDetails from "../components/ClinicDetails"

const home = () => {
  return (
    <>
      <Hero/>
      <Services/>
      <DoctorHighlight/>
      <ClinicDetails/>
      
    </>
  )
}

export default home
