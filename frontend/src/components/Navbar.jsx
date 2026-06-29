import React from 'react'
import {Activity, AlignVerticalSpaceAroundIcon, Bell, Bot, BotIcon, BotMessageSquare, ChartArea, Cpu, CpuIcon, Group, GroupIcon, Hamburger, Home, Link2, List, LogOut, LucideGroup, LucideHamburger, LucideMoreHorizontal, LucideMoreVertical, MoreHorizontal, PersonStanding, Plus, Search, Sparkle, Sparkles, User, User2, User2Icon, UserCog, UserRoundSearch, View, Wand2, Zap } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Profile from './Profile'



const Navbar = () => {
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

     <Bot onClick={()=>{alert("bot is not developed yet thanks")}}  className='cursor-pointer'/>

     <Bell onClick={()=>{handleNavigation('/notification')}}  className='cursor-pointer'/>
     <UserCog onClick={()=>{handleNavigation('/profile')}} className='cursor-pointer'/>

      </div>
  )
}



export default Navbar
