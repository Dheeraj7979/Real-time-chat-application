import mongoose from "mongoose";
import { Notification } from "../models/notification.models.js";
import { Apierror } from "../utils/apierror.js";
import { Apiresponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { allsockets } from "../socket/socket.controller.js";
import { getIo } from "../socket/socket.controller.js";


const fetchAllNotification = asyncHandler(async(req,res,next)=>{
     const {id} = req?.query
     let {limit} = req?.query
     if(limit==undefined){
          limit=10
     }
     let allnotifications =[]
     if(!id){
           allnotifications = await Notification.find({useremail:req.user.email}).sort({_id:-1}).limit(limit)
     } else{
      allnotifications =  await Notification.find({useremail:req.user.email,_id:{$lt: new mongoose.Types.ObjectId(id)}}).sort({_id:-1}).limit(limit)
     }

     res.status(200).json(
          new Apiresponse(200,allnotifications,"Notifications fetched!")
     )
})

const deleteNotification = asyncHandler(async(req,res,next)=>{
     const {id} = req?.query || req?.body
     if(!id){
          throw new Apierror(400,"Id required")
     }
     
     await Notification.deleteOne({_id:id})
     res.status(200).json("Notification deleted")
})

export const createNotification = async({message,useremail,type,requestemail=''})=>{
     const io = getIo()
     try{
           console.log(allsockets)
          const isNotificationpresent = await Notification.findOne({message,useremail,type})

               if(!isNotificationpresent){

                    const userEmail = useremail.trim().toLowerCase()
                    const requestEmail = requestemail.toLowerCase()

                    const notificationobj =  await Notification.create({
                         message:message,
                         useremail:userEmail,
                         requestemail:requestEmail,
                         type:type,
                         createdAt:Date.now(),
                    })

                   
                    console.log(allsockets.get(userEmail))
                         console.log('before emittion')

                         io.to(allsockets.get(userEmail)).emit('notification',notificationobj)
                         console.log("notification sent to ",allsockets.get(userEmail))
               }
     }catch(err){
          console.log(err)
     }
}

export  {fetchAllNotification,deleteNotification}