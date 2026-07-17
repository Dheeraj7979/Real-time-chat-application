import React, { useContext, useState } from 'react'
import { Usercontext } from '../context/UserContext.jsx'

const updateProfile = () => {
     const {user} = useContext(Usercontext)
     const [name,setname] = useState(user.name)
     const [about,updateabout] = useState(user.about)
     const [profile,updateprofile] = useState(user.profile)
     return (
          <form className='w-full h-full bg-white'>
               <div className='h-36 w-36 rounded-full m-auto'>
                    {
                         profile==''?<img
                              src={avatar}
                              alt={name}
                              className="w-full h-full object-cover rounded-full"
                              />:<img
                              src={profile}
                              alt={name}
                              className="w-full h-full object-cover rounded-full"
                         />
                    }
               </div>
               <input type='file' ></input>

               <label htmlFor='name'>Name</label>
               <input type='text' value={name}></input>
               <lable htmlFor='About'>About</lable>
               <input type='text' value={about}></input>
          </form>
     )
}

export default updateProfile
