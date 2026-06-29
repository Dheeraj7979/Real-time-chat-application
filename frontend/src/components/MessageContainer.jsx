import { ArrowLeft, CornerLeftUpIcon, Cross, Crosshair, CrossIcon, DraftingCompass, Icon, LucideMoreVertical, Plus, Search, Send, Smile } from 'lucide-react'
import React, { useState,useEffect,useMemo, useContext } from 'react'
import io from 'socket.io-client'
import Navbar from './Navbar'
import { avatar } from '../assets/assests.js'
import { Usercontext } from '../context/UserContext.jsx'
import socket from './Home.jsx'
import { fetchHistory } from '../services/friendsServices.js'
import Loader from './Loader.jsx'
import { Skeleton } from './Skeleton.jsx'
import { useFetchChatHistoryQuery } from '../services/HistoryApis.js'
import { useDispatch } from 'react-redux'
import { api } from '../services/apiSlice.js'

const MessageContainer = ({chat,socket,isChatOpen,updateIsChatOpen,data,isLoading}) => {
     // const dispatch = useDispatch()
     const {user} = useContext(Usercontext)
     const [message,updatemessage] = useState([])
     

  useEffect(()=>{
     if(data!=undefined){
          updatemessage(data.toReversed())
     }
     
  },[data])


  return (
     
     <div className='w-full flex h-screen flex-col py-4 justify-between '>
          <div className='flex flex-row justify-between shadow-lg py-2 rounded-xl mx-2'>
          <div className='flex  flex-row w-full gap-3'>
               <ArrowLeft 
                    onClick={()=>{updateIsChatOpen(false)}}
                    color='white' className=' my-auto'
                ></ArrowLeft>
                <div className='h-12 w-12 bg-blue-400 rounded-full'>
                    {
                            chat.profile==''?<img src={avatar} className='h-12 w-12 rounded-full'></img>:<img src={`${frnd.profile}`} className='h-12 w-12 rounded-full'></img>
                          }
                </div>
               
               {
                    isLoading?<div className='my-auto'>
                         <Skeleton ></Skeleton>
                    </div>:<div className='my-auto'>
               <p className='text-md text-white my-auto capitalize'>{chat.name}</p>
               <p className='text-sm text-green-400 overflow-hidden'>{chat.email}</p>
               </div>
               }
               
          </div>
          <div className='flex flex-row my-auto gap-4 '>
               <Search color='white' className='cursor-pointer'/>
               <LucideMoreVertical color='white' className='cursor-pointer'/>  
          </div>
          </div>

          <div className=' relative flex flex-col-reverse py-2 bg-[#212121] flex-1 overflow-scroll scrollbar-none my-1'>
          {
               isLoading?<Loader/>:<>{
      message.map((msg,idx)=>{
          return( <Message key={msg.createdAt} data={msg} sender={msg.sender} user={user} isLoading={isLoading}/>)
      })
     }
     </>
          }
          
          </div>
          
          <div className=''>
          <TypeMessage socket={socket} chat={chat}/>
          </div>
     </div>
    
  )
}

const convertedtime = (time)=>{
    
     let timeins = (time)
     let precisetime = time.split(':')
     if(precisetime[2].includes('PM')){
          precisetime[0] = Number(precisetime[0]) + 12
     } else if(precisetime[0]=='12'){
          precisetime[0] = '00'
     }
     precisetime.pop()

     const newtime = precisetime.join(':')
     return newtime
}

export default MessageContainer


const Message = ({data,sender,user})=>{
     const time = convertedtime((new Date(data.createdAt)).toLocaleTimeString({hour12:false}))
     
     return(
          <div className={`${(sender==user.email?'bg-slate-700 text-white ml-auto':'bg-white')} p-1 rounded-md  max-w-[50%] sm:max-w-[50%]  mx-3 mb-1 min-w-16 flex flex-row w-fit gap-1`}>
               
               <p className='text-[12px] font-normal max-w-[85%] md:max-w-[95%] wrap-break-word'>{data.message}</p>
               <div className='flex flex-row w-full text-[8px] flex-1 items-end'>
                    <p className='text-right w-full '>{time}</p>
               </div>
          </div>
     )
}

const TypeMessage = ({chat,socket})=>{
     const {user,updateuser} = useContext(Usercontext)
     const [message,updatemessage] = useState('')
     const sendmessage = async(e)=>{
     e.preventDefault()
     if(message!==''){
          const data = {
               message:message,
               sender:user.email,
               receiver:chat.email,
               email:[chat.email,user.email],
               time:Date.now()
          }
          socket.emit('send_message',data)
          updatemessage('')
     }
}
     const updatemsg = (e)=>{
          e.preventDefault()
          updatemessage(e.target.value)
     }

     return(
          <div className=' bottom-4 w-full bg-transparent'>
          <div className='gap-2 bg-white m-auto w-[95%]  flex flex-row px-4 py-3 rounded-4xl'>
               {/* <Plus/> */}
               <Smile/>
               <input
                    value={message}
                    onChange={updatemsg}
               type='text' placeholder='Type your message...' className='flex-1  active:outline-none hover:outline-none focus:outline-none'></input>
               <Send 
                onClick={sendmessage}/>
          </div>
          </div>   
     )
}