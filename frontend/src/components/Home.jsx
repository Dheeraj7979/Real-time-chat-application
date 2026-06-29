import React, { useCallback} from 'react'
import { useMemo } from 'react'
import io from 'socket.io-client'
import { useState,useEffect,useRef } from 'react'
import MessageContainer from './MessageContainer.jsx'
import LeftSidebar from './LeftSidebar.jsx'
import { useContext } from 'react'
import { Usercontext } from '../context/UserContext.jsx'
import Loader from './Loader.jsx'
import { useGetAllfriendsQuery } from '../services/friendApis.js'
import { useDispatch } from 'react-redux'
import { api } from '../services/apiSlice.js'
import { useFetchChatHistoryQuery } from '../services/HistoryApis.js'

export let socket = io('http://localhost:8000',{
     reconnection:true,
     reconnectionAttempts:5,
     reconnectionDelay:1000,
})

const Home = () => {
  const dispatch = useDispatch()
const [isChatOpen,updateIsChatOpen] = useState(false)
const {user}= useContext(Usercontext)
const [chat,updatechat] = useState(null)
const {data:allfriends,isLoading,isFetching,isError} = useGetAllfriendsQuery()


  const {data:messagedata,isLoading:messageisLoading,isFetching:messageisFetching} = useFetchChatHistoryQuery({email:chat?.email},{skip:!chat ||!chat.email})



  useEffect(()=>{
    if(user.email){
      try{
       socket.emit('join_room',user.email)
    } catch(error){
      console.log(error)
    }
    }

    return ()=> socket.emit('leave_room',user.email)
  },[user.email])

  useEffect(()=>{
    const handlemessageupdate = (messageData)=>{
      console.log(messageData)
      const targetEmail = messageData.sender === user.email 
      ? messageData.receiver 
      : messageData.sender;
      console.log(targetEmail)
      dispatch(
        api.util.updateQueryData(
          'fetchChatHistory',
          {email:targetEmail},
          (draft)=>{
            draft.push(messageData)
          }
        )
      )
    }

    socket.on('receive_message',handlemessageupdate)
    return ()=> {
      socket.off('receive_message',handlemessageupdate)
    }
  },[dispatch])


  return (
    <div className='max-w-screen h-screen max-h-screen flex flex-row flex-1'>
      {
        isChatOpen==false?<LeftSidebar updatechat={updatechat} socket={socket} isLoading={isLoading} allfriends={allfriends} isChatOpen={isChatOpen} updateIsChatOpen={updateIsChatOpen}/>:
        <MessageContainer socket={socket} chat={chat} isChatOpen={isChatOpen} updateIsChatOpen={updateIsChatOpen} data={messagedata} isLoading={messageisLoading}></MessageContainer>
      }
       
    </div>
  )
}

export default Home
