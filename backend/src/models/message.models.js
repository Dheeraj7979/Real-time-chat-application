import mongoose from "mongoose";


const messageSchema = mongoose.Schema({
     message:String,
     room:String,
     sender:String,
     createdAt:{
          type:Date
     }

}
)

export const Message = mongoose.model("Message",messageSchema)