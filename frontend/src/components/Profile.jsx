import { ArrowBigLeft, ArrowLeft, Camera } from 'lucide-react'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Usercontext } from '../context/UserContext.jsx'


const Profile = () => {
     const {user,updateuser} = useContext(Usercontext);
     const navigate = useNavigate() 

     const handleArrowClick = (e)=>{
          navigate('/')
     }

     
     
  return (
    <div className='bg-[#212121] w-screen min-h-screen text-white p-6'>
          <nav className='flex gap-4'>
               <ArrowLeft onClick={handleArrowClick}/>
               <p className='font-mono'>Edit Profile</p>
          </nav>
          <div className='w-full py-20'>
               <img className='bg-white h-36 w-36 rounded-full m-auto'>
               </img>
               <label htmlFor='image-upload'><Camera className='mx-auto relative bottom-3'/></label>
               <input id='image-upload' type='file' accept='image/*' className='mx-auto' style={{display:'none'}} ></input>
               

          </div>
          <div id='details' className='flex flex-col gap-6'>
               <div className='flex flex-col gap-2'>
               <p className='opacity-50 font-semibold'>Name</p>
               <p>{user.name} </p>
               </div>
               <div className='flex flex-col gap-2'>
               <p className='opacity-50 font-semibold'>About</p>
               <p>Busy..</p>
               </div>
               <div className='flex flex-col gap-2'>
               <p className='opacity-50 font-semibold'>Email</p>
               <p>{user.email}</p>
               </div>
               <div className='flex flex-col gap-2'>
               <p className='opacity-50 font-semibold'>Phone Number: </p>
               <p>{user.phone}</p>
               </div>
          </div>
    </div>
  )
}

export default Profile
