import { ArrowLeft, LogOut } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Usercontext } from '../context/UserContext.jsx'
import { avatarupdateservice, logoutservice } from '../services/AuthServices.js'
import { avatar } from '../assets/assests.js'

const Profile = () => {
  const { user, updateuser, updateisLoggedin } = useContext(Usercontext)

  const [name, updatename] = useState(user.name || "")
  const [about, updateabout] = useState(user.about || "")
  const [profile, updateprofile] = useState(user.profile || "")
  const [avatarFile, setAvatarFile] = useState(null)
  const [isupdating,setisupdating] = useState(false)

  const navigate = useNavigate()

  const handleArrowClick = () => {
    navigate('/')
  }

  const handleLogOut = async () => {
    try {
      await logoutservice()

      localStorage.removeItem('token')
      updateuser({})
      updateisLoggedin(false)

      navigate('/')
    } catch (error) {
      console.log(error.response)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      setAvatarFile(file)
      updateprofile(URL.createObjectURL(file))
    }
  }

  const updateProfilePicture = async () => {
    try {
      if (!avatarFile) {
        console.log("Please select an image")
        return
      }
     setisupdating(true)
     const formData = new FormData()

     formData.append("avatar", avatarFile)

     const response = await avatarupdateservice(formData)

     updateuser((prev)=>{

          prev.profile=response.data
          return prev
      })
      setisupdating(false)

    } catch (error) {
      console.log(error)
    }
  }


  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className='bg-[#212121] w-screen min-h-screen text-white p-6 relative flex flex-col'
    >

      <nav className='flex justify-between'>
        <div className='flex gap-4 items-center'>
          <ArrowLeft 
            onClick={handleArrowClick}
            className='cursor-pointer'
          />

          <p className='font-mono'>
            Edit Profile
          </p>
        </div>


        <div
          onClick={handleLogOut}
          className='flex gap-4 cursor-pointer items-center'
        >
          <p>
            LogOut
          </p>

          <LogOut/>
        </div>
      </nav>


      <div className='w-full py-15 flex flex-col'>

        <div className='h-36 w-36 rounded-full m-auto overflow-hidden'>
          <img
            src={
              profile
                ? profile
                : user.profile
                ? user.profile
                : avatar
            }
            alt={name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>


        <label
          className='mx-auto mt-3 cursor-pointer text-blue-400'
          htmlFor='profile_picture'
        >
          Edit
        </label>


        <input
          type='file'
          id='profile_picture'
          accept='image/*'
          hidden
          onChange={handleAvatarChange}
        />

      </div>


      <div id='details' className='flex flex-col gap-6'>

        <div className='flex flex-col gap-2'>
          <p className='opacity-50 font-semibold'>
            Name
          </p>

          <input
            onChange={(e) => updatename(e.target.value)}
            type='text'
            className='text-green-400 outline-0 bg-transparent'
            value={name}
          />
        </div>


        <div className='flex flex-col gap-2'>
          <p className='opacity-50 font-semibold'>
            About
          </p>

          <input
            onChange={(e) => updateabout(e.target.value)}
            className='text-green-400 outline-0 bg-transparent'
            value={about}
          />
        </div>


        <div className='flex flex-col gap-2'>
          <p className='opacity-50 font-semibold'>
            Email
          </p>

          <p className='text-green-400'>
            {user.email}
          </p>
        </div>

      </div>

     {
          isupdating?<button
        type='button'
        className='mt-4 bg-blue-800 hover:bg-blue-800 text-white mx-auto py-2 px-16 rounded-2xl'
      >
        <div className="h-8 w-8 rounded-full border-4 border-gray-300 border-t-blue-600 animate-spin"></div>
      </button>:<button
        onClick={updateProfilePicture}
        type='button'
        className='mt-4 bg-blue-600 hover:bg-blue-700 text-white mx-auto py-2 px-16 rounded-2xl'
      >
        Update
      </button>
     }

    </form>
  )
}

export default Profile