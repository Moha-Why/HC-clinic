import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router'
import './App.css'
import Layout from '../src/layout/layout'
import Home from '../src/pages/Home'
import Contact from '../src/pages/Contact'
import AboutPage from './pages/About'
import Services from './pages/Services'
import Booking from './pages/Booking'

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route path='about' element={<AboutPage/>}/>
          <Route path='services' element={<Services/>}/>
          <Route path='contact' element={<Contact/>}/>
          <Route path='booking' element={<Booking/>}/>
        </Route>
      </>
    )
  )

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
