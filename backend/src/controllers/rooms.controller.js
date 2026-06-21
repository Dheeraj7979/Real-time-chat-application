import { User } from '../models/User.models.js'
import { Apiresponse } from '../utils/apiresponse.js'
import {asyncHandler}  from '../utils/AsyncHandler.js'


const friendRequest = asyncHandler(async(req, res,next)=>{
     const {email} = req.body 

     const user = await User.findOne({email})
     console.log(user)
     console.log(user.requests)
     const emailIndex = user.requests.indexOf(req.user.email)
     
     if(emailIndex==-1){
          user.requests.push(req.user.email)
     }
     
     
     await user.save({validateBeforeSave:false})

     res.status(200).json(
          new Apiresponse(201,email,`request sent`)
     )
})

const cancelRequest = asyncHandler(async(req,res,next)=>{
     const {email} = req.body

     const user = await User.find({email})

     const indextobedeleted = user.requests.indexOf(req.user.email)

     if(indextobedeleted!=-1){
          user.requests.splice(indextobedeleted,1);
     }
     await user.save({validateBeforeSave:false})

     res.status(200).json(
          new Apiresponse(201,email,'request cancelled')
     )
})

const acceptRequest = asyncHandler(async(req,res,next)=>{
     const {email} = req.body

     const requser = await User.findOne({email})
     const user = req.user

     user.friends.push({name:requser.name,email:email})
     requser.friends.push({name:user.name,email:user.email})

     const indextobedeleted = user.requests.indexOf(email)
     if(indextobedeleted!=-1){
          user.requests.splice(indextobedeleted,1);
     }
     
     await user.save({validateBeforeSave:false})
     await requser.save({validateBeforeSave:false})
     res.status(200).json(
          new Apiresponse(200,user,'request accepted')
     )
})

const searchFriend = asyncHandler(async(req,res,next)=>{
     const friends = req.user.friends

     res.status(200).json(
          new Apiresponse(200,friends,"friends fetched")
     )
})


export {friendRequest,acceptRequest,cancelRequest,searchFriend}