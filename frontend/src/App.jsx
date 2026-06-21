import { useMemo } from 'react'
import io from 'socket.io-client'
import { useState,useEffect,useRef } from 'react'
import Profile from './components/Profile.jsx'
import Home from './components/Home.jsx'
import Register from './components/Register.jsx'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import Login from './components/Login.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Addfriends from './components/Addfriends.jsx'


function App() {

  const [count, setCount] = useState(0)

  return (
    <>
    <ToastContainer/>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/register' element={<Register/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/profile' element={<Profile/>}></Route>
      <Route path='/add-friends' element={<Addfriends/>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
//  <Profile/>