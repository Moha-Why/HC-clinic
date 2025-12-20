import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router'
import './App.css'
import Layout from '../src/layout/layout'
import Home from '../src/pages/Home'
import Contact from '../src/pages/Contact'
import AboutPage from './pages/About'
import Services from './pages/Services'
import Booking from './pages/Booking'
import PlainLayout from './layout/PlainLayout'
import Dashboard from './pages/Dashboard'

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
        <Route element={<PlainLayout/>}>
          <Route path='/admin' element={<Dashboard/>}/>
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
