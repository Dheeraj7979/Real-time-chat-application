import { io } from "../app.js";
import { redis } from "../database/redis.js";
import { Message } from "../models/message.models.js";


const handleSocketConnections = async()=>{
  try{

     io.on('connection',(socket)=>{
     
     console.log("new user connected ",socket.id)

     const joinsocket= async()=>{
          
     }

     socket.on('join_room',(email)=>{
           email = email.sort()
           const room = `${email[0]} ${email[1]}`
          console.log(room)


          const fetchmessages = async()=>{
               const pastmessages = await Message.find({room:room})
               socket.emit('past_message',pastmessages)
          }

          fetchmessages()

     })

     socket.on('send_message',(data)=>{
          const email = data.email.sort()
          const room = `${email[0]} ${email[1]}`

          // socket.to(room).emit('receive_message',data)
          socket.emit('receive_message',data)

          const savemsgindb = async()=>{
               try{
                    await Message.create(
                         {
                              message:data.message,
                              room:room,
                              sender:data.sender,
                              createdAt:new Date()
                         }
                    )
               }catch(err){
                    console.log(err)
               }
          } 
          savemsgindb()
          
     })

     socket.on('disconnect',()=>{   
          console.log('user disconnected with id ',socket.id)
     })
})

  } catch(err){
     console.log(err)
  }
}


export  {handleSocketConnections}

