import React from 'react'
import {Activity, AlignVerticalSpaceAroundIcon, Bell, Bot, BotIcon, BotMessageSquare, Cpu, CpuIcon, Group, GroupIcon, Hamburger, Link2, LucideGroup, LucideHamburger, LucideMoreHorizontal, LucideMoreVertical, MoreHorizontal, PersonStanding, Plus, Search, Sparkle, Sparkles, User, User2, User2Icon, UserCog, UserRoundSearch, View, Wand2, Zap } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Profile from './Profile'



const Navbar = () => {
const navigate = useNavigate()


 const moveToSearchfriend = async()=>{
     window.alert("search-friend")
}
const moveToBot = async()=>{
     window.alert("moved to bot")
}
const showNotification = async()=>{
     window.alert("notifications appeared")
}
const moveToProfile= async()=>{
     navigate("/profile")
}
  return (
    
    <div className='m-4 flex flex-row justify-between px-6 md:px-20'>

     <UserRoundSearch onClick={moveToSearchfriend}  className='cursor-pointer'/>

     <Bot onClick={moveToBot}  className='cursor-pointer'/>
     

     <Bell onClick={showNotification}  className='cursor-pointer'/>
     <UserCog onClick={moveToProfile} className='cursor-pointer'/>

      </div>
  )
}



export default Navbar
