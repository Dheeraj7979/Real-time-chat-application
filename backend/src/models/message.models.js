import mongoose from "mongoose";


const messageSchema = mongoose.Schema({
     message:String,
     roomId:{
          type:String,
          required:true,
     },
     participants:[
          {String}
     ],
     createdAt:new Date()

}
)

export const Message = mongoose.model("Message",messageSchema)