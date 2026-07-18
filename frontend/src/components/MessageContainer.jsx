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
import { axiosInstance } from '../utils/axiosInstance.jsx'

const MessageContainer = ({chat,socket,isChatOpen,updateIsChatOpen,data,isLoading}) => {
     // const dispatch = useDispatch()
     const {user} = useContext(Usercontext)
     const [message,updatemessage] = useState([])
     const [isonline,updateisonline] = useState(false)
     const [istyping,updateistyping] = useState(false)
     useEffect(()=>{
          const checkIsOnline = async()=>{
               const response = await axiosInstance.get('/rooms/isonline',{
                    params:{email:chat.email}
               })
               const data = response.data
               updateisonline(data.data)
          }
          checkIsOnline()
     },[])
     

  useEffect(()=>{
     if(data!=undefined){
          updatemessage(data.toReversed())
     }
     
  },[data])


//   for receiving typing update in chat box 
  useEffect(()=>{
     let cnt1=0,cnt2=0;
     const handleTypingConfirmation = async(data)=>{
          if(data.senderemail==chat.email){
               cnt1++;
               updateistyping(true)
               setTimeout(()=>{
               cnt2++;
               if(cnt1==cnt2){
                    updateistyping(false)
               }
               
               },1000)
          }
          
     }
     socket.on('typing',handleTypingConfirmation)
     return ()=> socket.off('typing',handleTypingConfirmation)
  },[])


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
                         chat.profile==''?<img src={avatar} className='h-12 w-12 rounded-full'></img>:<img src={`${chat.profile}`} className='h-12 w-12 rounded-full'></img>
                    }
               </div>
               
               {
                    isLoading?<div className='my-auto'>
                         <Skeleton ></Skeleton>
                    </div>:<div className='my-auto'>
               <p className='text-md text-white my-auto capitalize'>{chat.name}</p>
               {
                    isonline==true?<div className="flex items-center gap-2 text-sm text-gray-500">
                         <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
                         <span className="text-green-600 font-medium">Online</span>
                    </div>:<></>
               }
               
               </div>
               }
               
          </div>
          <div className='flex flex-row my-auto gap-4 '>
               <Search color='white' className='cursor-pointer'/>
               <LucideMoreVertical color='white' className='cursor-pointer'/>  
          </div>
          </div>
          
          <div className={`${istyping?'mb-0':'mb-1'} relative flex flex-col-reverse py-2 bg-[#212121] flex-1 overflow-scroll scrollbar-none mt-1 focus-within:bottom-0`}>
          {
               isLoading?<Loader/>:<>{
          message.map((msg,idx)=>{
          return( <Message key={msg.createdAt} data={msg} sender={msg.sender} user={user} isLoading={isLoading}/>)
      })
     }
     </>
          }
          </div>
          {
               istyping?<div className=" flex items-center gap-2 px-3 py-2 text-sm text-gray-500 bg-[#212121] mt-0">
      <div className="flex gap-1">
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]"/>
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]"/>
      </div>
     
      <span>{chat.name} is typing...</span>
    </div>:<></>
               }
          
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
                    <p className='text-right w-full'>{time}</p>
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

     const sentTypingConfirmation = ()=>{
          const data = {
               receiveremail:chat.email,
               senderemail:user.email
          }
          socket.emit('typing',data)
     }

     return(
          <div className=' bottom-4 w-full bg-transparent'>
          <div className='gap-2 bg-white m-auto w-[95%]  flex flex-row px-4 py-3 rounded-4xl'>
               {/* <Plus/> */}
               <Smile/>
               <input 

                    rows={1}
                    value={message}
                    onChange={updatemsg}
                    onKeyDown={()=>{sentTypingConfirmation()}}
               type='text' placeholder='Type your message...' className='flex-1 active:outline-none hover:outline-none focus:outline-none'></input>
               <Send 
                onClick={sendmessage}/>
          </div>
          </div>   
     )
}