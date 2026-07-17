import { Message } from "../models/message.models.js";
import { allsockets } from "../socket/socket.controller.js";
import { Apierror } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/apiresponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";


const fetchPastMessages = asyncHandler(async(req ,res ,next)=>{
     const {email} = req?.query || ''

     const useremail = req?.user?.email
     if(!email || !useremail){
          throw new Apierror(400,"Bad request")
     }

     let emails = [`${email.toLowerCase()}`,`${useremail.toLowerCase()}`].sort()

    const roomId = `${emails[0]}_${emails[1]}`;

     const messages = await Message.find({room:roomId})

     res.status(200).json(
          new Apiresponse(203,messages,"message fetched!")
     )
})

const checkIsOnline = asyncHandler(async(req,res,next)=>{
     const {email} = req.query
     const issocketpresent = allsockets.has(email)
     res.status(200).json(
          new Apiresponse(200,issocketpresent,"status fetched")
     )
})

export {fetchPastMessages , checkIsOnline}