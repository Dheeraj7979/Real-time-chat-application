import React, { useContext, useState } from 'react'
import Navbar from './Navbar'
import { useEffect,useRef } from 'react'
import { findUnknownUsers, searchFriend } from '../services/friendsServices'
import { avatar } from '../assets/assests.js'
import { useFindUnknownUsersQuery } from '../services/apiSlice'
import Loader from './Loader'
import { Usercontext } from '../context/UserContext.jsx'
import { useCancelRequestMutation, useSendRequestMutation } from '../services/friendApis.js'
import { useDeleteNotificationMutation } from '../services/notificationApis.js'



const Addfriends = () => {
 const [lastId,updatelastId] = useState('')
 const [users,updateusers]=useState([])

 const {data,isLoading,isSuccess,isFetching, error} = useFindUnknownUsersQuery({limit:20,lastId})
 const {user} = useContext(Usercontext)
 

 useEffect(() => {
   const handleScroll = () => {

     if (isLoading || isFetching) return;
     const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100; 

     if (isAtBottom && users && users.length > 0) {
          const lastId = users[users.length - 1]._id;
          updatelastId(lastId);
          console.log(users.length)
          console.log("last id updated ", users[users.length-1])
     }
     };
   window.addEventListener('scroll', handleScroll);
 
   return () => window.removeEventListener('scroll', handleScroll);
 }, [isLoading, isFetching, users]);

  useEffect(()=>{
     if(!isLoading && data){
          updateusers(data.data)
          console.log('users updated ')
     }
},[isLoading,data])

if(isLoading || !users)
{
     return(
          <Loader></Loader>
     )
}

  return (
    <div className='w-screen h-screen flex flex-col bg-white'>
          <Navbar className=''/>
      <div className='bg-[#212121] flex-1 grid mx-auto justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-8 w-full'>
          {
               users.map((usr)=>{
                    if(usr.email!=user.email){
                         return(
                              <FriendCard name={usr.name} image={usr.profile} email={usr.email} requests={usr.requests}/>
                         )
                    }
                    
               })
          }
      </div>
       
    </div>
  )
}

export default Addfriends


const FriendCard = ({ image, name, email,requests }) => {
     const {user} = useContext(Usercontext)
      const [sendrequest] = useSendRequestMutation();
      const [cancelrequest] = useCancelRequestMutation();
     const [status,updatestatus] = useState('Add friend')
     const [deletenotification] = useDeleteNotificationMutation()

     useEffect(()=>{
          if(requests.includes(user.email)){
               updatestatus('Requested')
          }
     },[])

const togglestatus = (email)=>{
     if(status=='Add friend'){
          sendrequest({email:email}).then((response)=>{
               if(response.data){
                    updatestatus("Requested")
               } else{
                    console.log(response.error)
               }
          }).catch((err)=>{console.log(er)})

          
     } else{
          cancelrequest({email:email}).then((response)=>{
               if(response.data){
                    updatestatus("Add friend")
                    
               } else{
                    console.log(response.error)
               }
          })
          
     }
}


  return (
    <div className="bg-white p-4 py-8 h-68 w-60 rounded-2xl mx-auto">
      
      <div className=" h-24 w-24 mx-auto">
          {
               image==''?<img
          src={avatar}
          alt={name}
          className="w-full h-full object-cover rounded-full"
        />:<img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-full"
        />
          }
        
      </div>

      <h2 className="font-semibold font-mono text-xl my-0 text-center">
        {name}
      </h2>

      <h2 className=" text-sm text-center">
        {email}
      </h2>
      <button onClick={()=>{togglestatus(email)}}
       className={` ${status=='Requested'?'bg-gray-300 text-black':'bg-black text-white'} mt-4  font-mono font-semibold  py-3 w-full rounded-2xl cursor-pointer `}>
        {status}
      </button>
    </div>
  );
};











