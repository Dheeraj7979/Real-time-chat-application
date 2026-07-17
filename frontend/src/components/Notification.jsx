import { ArrowLeft, Bell, ChevronLeft, IterationCcw } from 'lucide-react'
import React, { useState } from 'react'
import { Navigate,useNavigate } from 'react-router-dom'
import { useDeleteNotificationMutation, useFetchNotificationQuery } from '../services/notificationApis.js'
import Loader from './Loader.jsx'
import { useEffect,useRef } from 'react'
import { useAcceptRequestMutation, useRejectRequestMutation } from '../services/friendApis.js'
import { io } from 'socket.io-client'
import { socket } from './Home.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { makeNotificationFalse } from '../services/NotificationSlice.js'



const Notification = () => {
     const dispatch = useDispatch()
     const sentinelRef = useRef(null);

     const [tab,switchtab] = useState('all')
     const navigate = useNavigate()
     const [limit,setlimit] = useState(6)
     let [allnotifications,setallnotifications] = useState([])
     const [id,setid] = useState('')
     let {data, error, isLoading, isFetching} = useFetchNotificationQuery({id,limit})
     const [acceptrequest] = useAcceptRequestMutation()
     const [rejectrequest] = useRejectRequestMutation()
     const [deletenotification] = useDeleteNotificationMutation()


useEffect(() => {
  const handleScroll = () => {
    if (isLoading || isFetching) return;
    const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100; 

     if (isAtBottom && allnotifications && allnotifications.length > 0) {
     const lastId = allnotifications[allnotifications.length - 1]._id;
     setid(lastId);
     }
     };
  window.addEventListener('scroll', handleScroll);

  return () => window.removeEventListener('scroll', handleScroll);
}, [isLoading, isFetching, allnotifications]);

     useEffect(()=>{
          if(!isLoading && data){
               setallnotifications(data.data)
               console.log('notification updated ')
          }
     },[isLoading,data])

     // useEffect(()=>{
     //      if(tab=='all'  && !isLoading){
     //           setallnotifications(data.data)
     //      } else{
     //           const newnotifications = allnotifications.filter((elem)=>{
     //                if(elem.type=='request'||elem.type=='friend_request') {
     //                     return elem;
     //                }
     //           })
     //           console.log(newnotifications)
     //           setallnotifications(newnotifications)
     //      }
     // },[tab])

     useEffect(()=>{
          dispatch(makeNotificationFalse())
          console.log(makeNotificationFalse())
     },[isLoading,isFetching])

     
     const deletenoti = async({id})=>{
          const response = await deletenotification({id})
          console.log(response)
     }

     const acceptreq = async({noti,idx})=>{
          try{
               const response  = await acceptrequest({email:noti.requestemail})
               deletenoti({id:noti._id})
               setallnotifications(allnotifications.filter((_,index)=> index!=idx))

          }catch(error){
               console.log(error)
          }
     }

     const rejectreq = async({noti,idx})=>{
          try{
               const response = await rejectrequest({email:noti.requestemail})
               deletenoti({id:noti._id})
               setallnotifications(allnotifications.filter((_,index)=> index!=idx))
          }catch(err){
               console.log(err)
          }
     }

  return (
    <div className='bg-white min-h-screen w-screen p-4 sm:p-8 gap-4 flex flex-col'>
      <div className='flex flex-row justify-between'>
          <ChevronLeft
               onClick={()=>{
                    navigate('/home')
               }}
           />
          <h3 className='font-bold text-lg md:text-xl md:font-bold'>Notifications</h3>
          <Bell className='animate-bounce'/>
      </div>
      <div className='flex flex-row gap-2 mx-auto'>
          <button
           onClick={()=>{switchtab('all')}}
           className={`${tab=='all'?'bg-gray-300':'bg-gray-200'} px-4 py-1 rounded-lg min-w-24 md:text-lg md:min-w-40 hover:scale-105 cursor-pointer ` }>All</button>
          <button
           onClick={()=>{switchtab('request')}}
           className={`${tab!='all'?'bg-gray-300':'bg-gray-200'} px-4 py-1 rounded-lg min-w-24 md:text-lg md:min-w-40 hover:scale-105 cursor-pointer` } >Request</button>
      </div>
      <div>
               {
                    isLoading?<Loader/>:<div className='flex flex-col'>

                    {
                         allnotifications.map((noti,idx)=>{
                              if(tab=='request' && (noti.type=='request'||noti.type=='friend_request') ){
                                   
                              return(
                              <div key={noti._id} className='px-8 py-6 text-md font-semibold rounded-xl shadow-md flex flex-col gap-4 text-justify'>
                                   <p className='text-sm md:text-lg'>{noti.message}</p>

                                   {
                                        noti.type=='request'||noti.type=='friend_request' && noti.checked==false?<div className=' flex gap-4 justify-center md:justify-start'>
                                            <button 
                                             onClick={()=>{acceptreq({noti,idx})}}
                                             class="bg-green-500 hover:bg-green-700 text-white  font-semibold py-2 px-6 border border-green-700 rounded-lg cursor-pointer">Accept</button>
                                            <button
                                             onClick={()=>{rejectreq({noti,idx})}}
                                             class="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-6 border border-red-700 rounded-lg cursor-pointer">Reject</button>
                                        </div>:<></>
                                   }
                              </div>
                              )
                         } else{
                              return(
                              <div className='px-8 py-6 text-md font-semibold rounded-xl shadow-md flex flex-col gap-4 text-justify'>
                                   <p className='text-sm md:text-lg'>{noti.message}</p>

                                   {
                                        noti.type=='request'||noti.type=='friend_request' && noti.checked==false?<div className=' flex gap-4 justify-center md:justify-start'>
                                             <button 
                                             onClick={()=>{acceptreq({noti,idx})}}
                                             class="bg-green-500 hover:bg-green-700 text-white  font-semibold py-2 px-6 border border-green-700 rounded-lg cursor-pointer">Accept</button>
                                             <button
                                             onClick={()=>{rejectreq({noti,idx})}}
                                             class="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-6 border border-red-700 rounded-lg cursor-pointer">Reject</button>
                                        </div>:<></>
                                   }
                              </div>
                              )
                         }
                         })
                    }
                    </div>
               }
     </div>
     </div>
)
}
export default Notification
