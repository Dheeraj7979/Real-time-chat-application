import React, { useContext } from 'react'
import { Usercontext } from '../context/UserContext'
import { Navigate } from 'react-router-dom'
import Loader from './Loader'

const ProtectedRoute = ({children,isloading}) => {
     const {isLoggedin} = useContext(Usercontext) 
     console.log(!isLoggedin)
     if(isloading){
          return <Loader/>
     }
     if(isLoggedin==false){
          return(
               <Navigate to='/' replace></Navigate>
          )
     } else{
          return children
     }
}

export default ProtectedRoute
