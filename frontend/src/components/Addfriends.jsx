import React, { useState } from 'react'
import Navbar from './Navbar'
import { useEffect } from 'react'
import { findUnknownUsers, searchFriend } from '../services/friendsServices'
import { avatar } from '../assets/assests'



const Addfriends = () => {

const [friendlist,updatefriendlist] = useState([
     {
          profile:"https://images.unsplash.com/photo-1740252117044-2af197eea287?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          name:"user interface ",
          email:"xyz@gmail.com"
     }
])

  useEffect(()=>{
     const searchfrnd = async()=>{
          try{
               const response = await findUnknownUsers()
               updatefriendlist(response.data)
               console.log(response)
          }catch(err){
               console.log(err.response.data)
          }
     }
     searchfrnd()
  },[])

  return (
    <div className='w-screen h-screen flex flex-col'>
      <Navbar/>
      <div className='bg-[#212121] flex-1 grid grid-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 p-16  gap-16 w-screen'>
          {
               friendlist.map((user)=>{
                    return(
                         <FriendCard name={user.name} image={user.profile} email={user.email}/>
                    )
               })
          }
      </div>
    </div>
  )
}

export default Addfriends


const FriendCard = ({ image, name, email }) => {
     const [status,updatestatus] = useState('Add friend')

const togglestatus = ()=>{
     if(status=='Add friend'){
          updatestatus("Requested")
     } else{
          updatestatus("Add friend")
     }
}


  return (
    <div className="w-60 p-5 rounded-xl bg-transparent border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)] hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300 flex flex-col items-center">
      
      <div className="w-16 h-16 mb-3 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 to-fuchsia-500">
          {/* avatar */}
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

      <h2 className="text-base font-bold text-white tracking-widest uppercase mb-1 text-center">
        {name}
      </h2>

      <span className="text-xs text-cyan-300/80 font-mono tracking-tight text-center truncate w-full">
        {email}
      </span>
      <button onClick={togglestatus}
       className="mt-4 w-full py-2 bg-cyan-950/30 hover:bg-cyan-500 border border-cyan-500/50 hover:border-cyan-400 text-cyan-400 hover:text-black text-xs font-black tracking-widest uppercase rounded-md transition-all duration-300 shadow-[0_0_5px_rgba(6,182,212,0.1)] hover:shadow-[0_0_12px_rgba(6,182,212,0.4)] active:scale-95">
        {status}
      </button>
    </div>
  );
};