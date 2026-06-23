import { AlignVerticalSpaceAroundIcon, Group, GroupIcon, Hamburger, LucideGroup, LucideHamburger, LucideMoreHorizontal, LucideMoreVertical, MoreHorizontal, PersonStanding, Plus, Search, User, View } from 'lucide-react'
import React, { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import { useState } from 'react'
import { useEffect } from 'react'
import { searchFriend } from '../services/friendsServices.js'
import { useContext } from 'react'
import { Usercontext } from '../context/UserContext.jsx'


const LeftSidebar = ({updatechat,socket}) => {
  const [isSmall,updateisSmall] = useState(window.innerWidth<=600)
  const {user,updateuser} = useContext(Usercontext)
  const [friends,updatefriends] = useState([])
  const navigate = useNavigate()
  let resizeref = useRef(null)

  useEffect(()=>{
    
    if(user.friends==undefined){
        const searchfriends = async()=>{
        try{
          const response = await searchFriend()
          console.log(response.data)
          updatefriends(response.data)
          updatechat((response.data)[0])
        } catch(error){
          console.log(error)
        }
        
      }
    searchfriends()
    } else{
        updatefriends(user.friends||[])
        updatechat(user.friends[0])
    }

  },[user])


  useEffect(()=>{
  
    resizeref=  window.addEventListener("resize",()=>{
      updateisSmall(window.innerWidth<=600)
    })
    
    return(()=>{
      window.removeEventListener("resize",resizeref);
    })
  },[])


  const moveToProfile = (e)=>{
    navigate('/profile')
  }

  return (
    <div className='w-full md:w-[40%] lg:w-[30%] flex flex-col bg-white p-4 gap-4 relative'>
    
      
        <Navbar></Navbar>
      
        <div id='search' className='h-10 w-full text-[16px] flex flex-row gap-4 rounded-3xl px-2 bg-gray-200'>
          <Search className='my-auto' height={'16px'} fill={'#EEEEEE'} />
          <input className='w-full hover:outline-none focus:outline-none' type='text' placeholder='Search'></input>
        </div>
        
      

      {/* all chat boxes  */}
      <div className='flex-1 flex flex-col gap-1 overflow-scroll scrollbar-none cursor-pointer'>
        {
          friends.map((frnd)=>{
            return(
              <Chatboxes frnd={frnd} updatechat={updatechat} name={frnd.name} email={frnd.email} />
            )
          })
        }

      </div>
    </div>
  )
}
export default LeftSidebar

const Chatboxes = ({name,email,updatechat,frnd})=>{
  return(
    <div onClick={()=>{
      updatechat(frnd)
      
    }}
     className=' p-2 flex flex-row gap-3 relative'>
      <img className='h-12 w-12 rounded-full bg-blue-400'></img>
      <div>
      <h3 className='font-semibold'>{name}</h3>
      <h5 className='text-sm overflow-scroll scrollbar-none'>{email}</h5>
      </div>
      <div className='absolute right-2 flex flex-col gap-1'>
        <p className='text-[12px]'>time</p>
        <div className='bg-green-400 rounded-full items-center text-center text-white'>1</div>
      </div>
    </div>
  )
}



