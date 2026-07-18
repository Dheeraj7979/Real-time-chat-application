import mongoose from "mongoose";


const messageSchema = mongoose.Schema({
     message:String,
     room:String,
     sender:{
          type:String,
          lowercase:true,
     },
     receiver:{
          type:String,
          lowercase:true,
     },
     createdAt:{
          type:Date
     }

}
)

export const Message = mongoose.model("Message",messageSchema)