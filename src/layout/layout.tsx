import { Outlet } from 'react-router'
import Header from '../components/Header'
import Footer from '../components/Footer'

const layout = () => {
  return (
    <>
      <Header/>
      <Outlet></Outlet>
      <Footer/>
    </>
  )
}

export default layout
