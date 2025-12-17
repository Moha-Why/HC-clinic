import DoctorHighlight from "../components/DoctorHighlight"
import Hero from "../components/Hero"
import Services from "../components/Services"
import Footer from "../components/Footer"
import ClinicDetails from "../components/ClinicDetails"

const home = () => {
  return (
    <>
      <Hero/>
      <Services/>
      <DoctorHighlight/>
      <ClinicDetails/>
      <Footer/>
    </>
  )
}

export default home
