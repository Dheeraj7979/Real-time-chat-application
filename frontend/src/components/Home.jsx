import React from 'react'
import { useMemo } from 'react'
import io from 'socket.io-client'
import { useState,useEffect,useRef } from 'react'
import MessageContainer from './MessageContainer.jsx'
import LeftSidebar from './LeftSidebar.jsx'
import { useContext } from 'react'

let socket = io('http://localhost:8000',{
     reconnection:true,
     reconnectionAttempts:5,
     reconnectionDelay:1000,
})
const Home = () => {
  
  const [chat,updatechat] = useState(null)
  return (
    <div className='w-screen h-screen flex flex-row flex-1'>
       <LeftSidebar updatechat={updatechat} socket={socket}/>
      <MessageContainer socket={socket} chat={chat} /> 
     
    </div>
  )
}

export default Home
