import mongoose from "mongoose";

const NotificationSchema = mongoose.Schema({
     message:String,
     type:{
          type:String,
          enum:['request','alert','system','friend_request']
     },
     useremail:{
          type:String,
          lowercase:true
     },
     requestemail:{
          type:String,
          lowercase:true,
     },
     checked:{
          type:Boolean,
          default:false
     },
     createdAt:Date
})

export const Notification = mongoose.model('Notification',NotificationSchema)