import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Dashboard from './Pages/Dashboard'
import About from './Pages/About'
import Signin from './Pages/Signin'
import Signup from './Pages/Signup'
import Projects from './Pages/Projects'
import Header from './components/Header'
import Footer from './components/Footer'
import privateRoute from './components/privateRoute'


export default function App() {
  return (
    // <h1 className='text-3xl text-red-500'>app</h1>
    <BrowserRouter>
      <Header/>
       <Routes>
          <Route path="/" element={<Home/>} />
          
          <Route path="/about" element={<About/>} />
          <Route path="/sign-in" element={<Signin/>} />
          <Route path="/sign-up" element={<Signup/>} />
          <Route path="/projects" element={<Projects/>} />
          <Route element = {<privateRoute/>}>
                 <Route path="/dashboard" element={<Dashboard/>} />
          </Route>
       </Routes>  
       <Footer/>
    </BrowserRouter>
  )
}

