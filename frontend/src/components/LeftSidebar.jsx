import { AlignVerticalSpaceAroundIcon, Circle, CircleAlert, Dot, Group, GroupIcon, Hamburger, LucideGroup, LucideHamburger, LucideMoreHorizontal, LucideMoreVertical, MoreHorizontal, PersonStanding, Plus, PlusCircle, Search, User, View } from 'lucide-react'
import React, { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import { avatar } from '../assets/assests.js'
import { useState } from 'react'
import { useEffect } from 'react'
import { searchFriend } from '../services/friendsServices.js'
import { useContext } from 'react'
import { Usercontext } from '../context/UserContext.jsx'
import Loader from './Loader.jsx'
import { all } from 'axios'

export const typingcount = new Map()

const LeftSidebar = ({updatechat,socket,allfriends,isLoading,isError, isChatOpen, updateIsChatOpen}) => {
  const [isSmall,updateisSmall] = useState(window.innerWidth<=600)
  const {user,updateuser} = useContext(Usercontext)
  const [friends,updatefriends] = useState([])
  const [query,updatequery] = useState('')
  const [typingstatus,updatetypingstatus] = useState(new Map())
  const navigate = useNavigate()
  let resizeref = useRef(null)

  useEffect(() => {
  if (!allfriends) return;

  updatetypingstatus(prev => {
    const newmap = new Map(prev);

    allfriends.forEach(friend => {
      const email = friend.email.trim().toLowerCase();

      if (!newmap.has(email)) {
        newmap.set(email, 0);
      }
    });

    return newmap;
  });
}, [allfriends]);

  useEffect(()=>{
    if(allfriends!=undefined){
      updatefriends(allfriends)
    }
  },[allfriends])

  useEffect(()=>{
      if(!isLoading && !isError){
        const filteredItems = allfriends.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase().trim())
        );
       updatefriends(filteredItems)
      }
  },[query])
  

  useEffect(() => {
  if (!allfriends) return;

  const handletypingupdate = (data) => {
    const sendermail = data.senderemail.trim().toLowerCase();

    updatetypingstatus(prev => {
      const newmap = new Map(prev);

      const currentvalue = newmap.get(sendermail) ?? 0;

      newmap.set(sendermail, currentvalue + 1);

      return newmap;
    });

    setTimeout(()=>{
      updatetypingstatus(prev=>{
        const newmap = new Map(prev);
        const currentvalue = newmap.get(sendermail)??0;
        newmap.set(sendermail,currentvalue-1);
        return newmap
      }

      )
    },1000)
  };

  socket.on("typing", handletypingupdate);

  return () => socket.off("typing", handletypingupdate);

}, [socket, allfriends]);


  const moveToProfile = (e)=>{
    navigate('/profile')
  }

  if(isLoading || isError){
    return (
      <Loader/>
    )
  }

  return (
    <div className='w-full flex flex-col md:px-16 bg-white p-4 gap-4 relative'>
        <Navbar></Navbar>
      
        <div id='search' className='h-10 w-full text-[16px] flex flex-row gap-4 rounded-3xl px-2 bg-gray-200'>
          <Search className='my-auto' height={'16px'} fill={'#EEEEEE'} />
          <input value={query} onChange={(e)=>{updatequery(e.target.value)}} className='w-full hover:outline-none focus:outline-none' type='text' placeholder='Search'></input>
        </div>
        
      {

        friends.length==0?<div><p className='font-bold font-mono text-lg pt-4 text-justify e'> You have no friends yet please add friends...</p>
        {/* <PlusCircle/> */}
        </div>:<></>
      }
      <div className='flex-1 flex flex-col gap-1 overflow-scroll scrollbar-none cursor-pointer'>
        {
          friends.map((frnd)=>{
            return(
              
              <Chatboxes frnd={frnd} updatechat={updatechat} isLoading={isLoading} updateIsChatOpen={updateIsChatOpen} typingstatus={typingstatus}/>
            )
          })
        }

      </div>
    </div>
  )
}
export default LeftSidebar

const Chatboxes = ({name,email,updatechat,frnd,isLoading,updateIsChatOpen,typingstatus})=>{
  return(
    <div onClick={()=>{
      updatechat(frnd)
      updateIsChatOpen(true)
      console.log("chat open updated but not updated in home")
    }}
     className=' p-2 flex flex-row gap-3 relative'>
      {
        frnd.profile==''?<img src={avatar} className='h-12 w-12 rounded-full'></img>:<img src={`${frnd.profile}`} className='h-12 w-12 rounded-full'></img>
      }
      
      <div>
      <h3 className='font-semibold'>{frnd.name}</h3>
      {
        
        (typingstatus.get(frnd.email.trim().toLowerCase())??0)>0?<span className="text-green-700 font-medium">typing...</span>:<></>
      }
      
      {/* <h5 className='text-sm overflow-scroll scrollbar-none'>{frnd.email}</h5> */}

      </div>
      <div className='absolute right-2 flex flex-col gap-1'>
        {/* <p className='text-[12px]'>time</p> */}
        {/* <div className='h-3 w-3 bg-green-400 rounded-full m-auto'></div> */}
      </div>
    </div>
  )
}



