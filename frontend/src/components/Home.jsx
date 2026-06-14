import React from 'react'
import { useMemo } from 'react'
import io from 'socket.io-client'
import { useState,useEffect,useRef } from 'react'
import MessageContainer from './MessageContainer.jsx'
import LeftSidebar from './LeftSidebar.jsx'


const Home = () => {
  return (
    <div className='w-screen h-screen flex flex-row flex-1'>
       <LeftSidebar/>
      <MessageContainer/> 
     
    </div>
  )
}

export default Home
