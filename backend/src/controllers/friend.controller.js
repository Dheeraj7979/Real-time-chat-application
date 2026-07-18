
import { Notification } from '../models/notification.models.js'
import { User } from '../models/user.models.js'
import { Apiresponse } from '../utils/apiResponse.js'
import {asyncHandler}  from '../utils/asyncHandler.js'
import { createNotification } from './notification.controller.js'


const friendRequest = asyncHandler(async(req, res,next)=>{
     const {email} = req.body 

     const user = await User.findOne({email})
     const emailIndex = user.requests.indexOf(req.user.email)
     
     if(emailIndex==-1){
          user.requests.push(req.user.email)
     }
     await user.save({validateBeforeSave:false})

     const senderemail = req.user.email.trim().toLowerCase()
     const receiveremail = email.trim().toLowerCase()

     createNotification({message:`${req.user.name} sent you friend request`,type:'friend_request',useremail:receiveremail,requestemail:senderemail})

     res.status(200).json(
          new Apiresponse(201,email,`request sent`)
     )
})

const cancelRequest = asyncHandler(async(req,res,next)=>{
     const {email} = req.body

     const user = await User.findOne({email})
     const indextobedeleted = user.requests.indexOf(req.user.email)

     await Notification.deleteOne({useremail:email,requestemail:req.user.email,type:'request'})

     if(indextobedeleted!=-1){
          user.requests.splice(indextobedeleted,1)
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

     const isdublicateinuser = user.friends.some(friends=>friends.email===requser.email)
     if(!user.friends.includes(requser.email)){
          user.friends.push(requser.email)
     }

     if(!requser.friends.includes(user.email)){
           requser.friends.push(user.email)
     }
     
     
     const indextobedeleted = user.requests.indexOf(email)
     if(indextobedeleted!=-1){
          user.requests.splice(indextobedeleted,1);
     }

     const accepteduser = req.user.email.trim().toLowerCase()
     const useremail = email.trim().toLowerCase()

     await createNotification({message:`${accepteduser} accepted your friend request`,type:'alert',useremail:useremail})
     
     await user.save({validateBeforeSave:false})
     await requser.save({validateBeforeSave:false})

     res.status(200).json(
          new Apiresponse(200,user,'request accepted')
     )
})

const searchFriend = asyncHandler(async(req,res,next)=>{
     const friendsemail = req.user.friends

     const friends =await User.find({email: { $in:friendsemail}}).select('name email profile about')


     res.status(200).json(
          new Apiresponse(200,friends,"friends fetched")
     )
})

const findUnknownUsers = asyncHandler(async(req,res,next)=>{
     let {limit,lastId} = req?.query 
     if(limit==undefined || limit=='') {
          limit=20
     }
     let users = []
     if(lastId==undefined || lastId=='' || lastId==-1){
          users = await User.find({email: { $nin:req?.user?.friends}}).select('name email profile friends requests _id').limit(20).sort({_id:1})
     } else{
          users = await User.find({email: { $nin:req?.user?.friends},_id:{ $gt:lastId}}).select('name email profile friends requests _id').limit(20).sort({_id:1})
     }
     
     const user = req.user

     res.status(200).json(
          new Apiresponse(200,users,"all unknown users fetched")
     )
})

const rejectRequest = asyncHandler(async(req,res,next)=>{
     const user = req.user;
     const {email} = req.body

     const indextobedeleted = user.requests.indexOf(req.user.email)

     if(indextobedeleted!=-1){
          user.requests.splice(indextobedeleted,1)
     }
     await user.save({validateBeforeSave:false})

     res.status(200).json(
          new Apiresponse(201,email,'request rejected')
     )
})

function escapeRegex(text) {
     return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const searchUser = asyncHandler(async(req,res,next)=>{
     const {rawQuery} = req?.query || ''
     console.log(rawQuery)
     const filteredQuery = escapeRegex(rawQuery)
     const users = await User.find({name:{$regex:filteredQuery,$options:'i'}}).limit(20).select('name email profile friends requests _id')
     
     res.status(200).json(
          new Apiresponse(200,users,"users fetched!")
     )
})

export {
     friendRequest,
     acceptRequest,
     cancelRequest,
     searchFriend,
     findUnknownUsers,
     rejectRequest,
     searchUser
}