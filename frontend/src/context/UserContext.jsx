import { createContext, useState,Children } from "react";

export const Usercontext = createContext(null)

export const UsercontextProvider = function({children}){
     const [isLoggedin,updateisLoggedin] = useState(false)

     const [user,updateuser] = useState({
          
     })


     const logout = ()=>{
          localStorage.removeItem('token')
          updateuser({})
          updateisLoggedin(false)
     }

     return (
          <Usercontext.Provider value={{user,updateuser,logout,isLoggedin,updateisLoggedin}}>{children}</Usercontext.Provider>
     )
}