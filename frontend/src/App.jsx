import { useMemo } from 'react'
import io from 'socket.io-client'
import { useState,useEffect,useRef } from 'react'
import Profile from './components/Profile.jsx'
import Home from './components/Home.jsx'
import Register from './components/Register.jsx'
import { BrowserRouter, Route,Routes ,Navigate } from 'react-router-dom'
import Login from './components/Login.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Addfriends from './components/Addfriends.jsx'
import { useContext } from 'react'
import { Usercontext } from './context/UserContext.jsx'
import { axiosInstance } from './utils/axiosInstance.jsx'
import {contextStateHolder} from '../src/utils/axiosInstance.jsx'
import { getuserdetails } from './services/AuthServices.js'
import Loader from './components/Loader.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import NotFound from './components/Notfound.jsx'
import Notification from './components/Notification.jsx'
import Agent from './components/Agent.jsx'

function App() {
  const {user,updateuser} = useContext(Usercontext)
  const [token,updatetoken] = useState(localStorage.getItem('token')||'')
  const [count, setCount] = useState(0)
  const {isLoggedin,updateisLoggedin} = useContext(Usercontext)
  const hasToken = !!localStorage.getItem('token')
  const [isloading, setisloading] = useState(hasToken)
 
  
  useEffect(() => {
    contextStateHolder.updateuser = updateuser;
    contextStateHolder.setisLoggedin = updateisLoggedin
    
  }, []);

  useEffect(()=>{

      const fetchuser = async()=>{
        if(Object.keys(user).length==0){
          try{
            const response =await getuserdetails();
            console.log(response.data)
            updateuser(response.data
            )
          }catch(err){
            console.log(err.response)
          } finally{
            setisloading(false)
          }
        } else{
          setisloading(false)
        }
    }

    if(Object.keys(user).length > 0){
      console.log("updated")
      updateisLoggedin(true)
    }

    fetchuser()
  },[])

  useEffect(() => {
  if (user && Object.keys(user).length > 0) {
    updateisLoggedin(true);
  }
}, [user]);


      return (
    <>
    <ToastContainer/>
    <BrowserRouter>
    <Routes>
     
            <Route
             path='/'
              element={isLoggedin?<Navigate to='/home' replace/>:<Navigate to='/login' replace/>}></Route>
              {/* open routes */}
            <Route path='/register' element={<Register/>}></Route>
            <Route path='/login' element={<Login/>}></Route>


            <Route path='/home' element={<ProtectedRoute isloading={isloading}>
                    <Home/>
             </ProtectedRoute>}></Route>
           
            <Route
             path='/profile'
             element={<ProtectedRoute isloading={isloading}>
                    <Profile/>
             </ProtectedRoute>}></Route>
             
            <Route
             path='/add-friends'
              element={<ProtectedRoute isloading={isloading}>
                    <Addfriends/>
             </ProtectedRoute>}></Route>
             
             <Route 
             path='/notification'
             element={
             <ProtectedRoute isloading={isloading}>
                <Notification/>
             </ProtectedRoute>}
             >
             </Route>
             <Route 
             path='/agent'
             element={
             <ProtectedRoute isloading={isloading}>
                <Agent/>
             </ProtectedRoute>}
             >
             </Route>
             {/* <Route path='/notification' element={<Notification/>}></Route> */}


            <Route path='/:abcd' element={<NotFound/>}></Route>
            <Route path='/:abcd/:abcd' element={<NotFound/>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  )
  }

export default App