import React, { useEffect } from 'react'
import {Activity, AlignVerticalSpaceAroundIcon, Bell, BellDot, Bot, BotIcon, BotMessageSquare, ChartArea, Cpu, CpuIcon, Dot, DotIcon, Group, GroupIcon, Hamburger, Home, Link2, List, LogOut, LucideGroup, LucideHamburger, LucideMoreHorizontal, LucideMoreVertical, MoreHorizontal, PersonStanding, Plus, Search, Sparkle, Sparkles, User, User2, User2Icon, UserCog, UserRoundSearch, View, Wand2, Zap } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Profile from './Profile'
import { useFetchNotificationQuery } from '../services/notificationApis'
import { useSelector } from 'react-redux'



const Navbar = () => {
     const notification = useSelector((state)=> state.notification.isNotification)
     const navigate = useNavigate()
     const location = useLocation()

     const handleNavigation = (pathname)=>{
          if(location.pathname != pathname){
               navigate(pathname)
          }
          
     }


  return (
    
    <div className='m-4 flex flex-row justify-between px-2'>
     <Home onClick={()=>{
          handleNavigation('/home')
     }} className='cursor-pointer'
     />
     <UserRoundSearch onClick={()=>{handleNavigation('/add-friends')}}  className='cursor-pointer'/>

     <Bot onClick={()=>{handleNavigation('/agent')}}  className='cursor-pointer'/>

     <div className='relative'>
     <Bell onClick={()=>{handleNavigation('/notification')}}  className='cursor-pointer relative bg-transparent'/> 
          {
               notification?<div className='w-2 h-2 bg-red-600 rounded-full absolute top-0 right-1'></div>:<></>
          }
     
     </div>
     
     <UserCog onClick={()=>{handleNavigation('/profile')}} className='cursor-pointer'/>

      </div>
  )
}



export default Navbar
