import { Outlet } from 'react-router'
import Header from '../components/Header'

const layout = () => {
  return (
    <>
      <Header/>
      <Outlet></Outlet>
    </>
  )
}

export default layout
