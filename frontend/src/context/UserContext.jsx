import { createContext, useState,Children } from "react";

export const Usercontext = createContext(null)

export const UsercontextProvider = function({children}){
     const [user,updateuser] = useState({
          name:'Dheeraj kumar verma',
          email:'dheerajku357@gmail.com',
          phone:'8709788097',
          about:'sleeping...'
     })

     return (
          <Usercontext.Provider value={{user,updateuser}}>{children}</Usercontext.Provider>
     )
}