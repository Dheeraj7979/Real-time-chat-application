import { ArrowBigLeft, ArrowLeft, Camera, DoorOpen, LogOut } from 'lucide-react'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Usercontext } from '../context/UserContext.jsx'
import { logoutservice } from '../services/AuthServices.js'
import { avatar } from '../assets/assests.js'


const Profile = () => {
     const {user,updateuser,isLoggedin,updateisLoggedin} = useContext(Usercontext);
     const navigate = useNavigate() 

     const handleArrowClick = (e)=>{
          navigate('/')
     }

     const handleLogOut = async()=>{
          try{
               const response = await logoutservice();
               localStorage.removeItem('token')
               updateuser({})
               updateisLoggedin(false)

          }catch(error){
               console.log(error.response)
          }
     }
         
  return (
    <div className='bg-[#212121] w-screen min-h-screen text-white p-6'>
          <nav className='flex justify-between'>
               <div className='flex gap-4'>
                    <ArrowLeft onClick={handleArrowClick}/>
                    <p className='font-mono'>Edit Profile</p>
               </div>
               <div onClick={()=>{handleLogOut()}}
                className='flex gap-4 cursor-pointer'>
                    <p>LogOut</p>
                    <LogOut/>
               </div>
          </nav>
          <div className='w-full py-20'>
               
               <div className='h-36 w-36 rounded-full m-auto'>
                    {
                         user.profile==''?<img
                                   src={avatar}
                                   alt={name}
                                   className="w-full h-full object-cover rounded-full"
                                 />:<img
                                   src={user.profile}
                                   alt={name}
                                   className="w-full h-full object-cover rounded-full"
                                 />
                    }
               </div>
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
               <p>{user.about}</p>
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
