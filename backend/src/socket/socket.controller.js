import { io } from "../app.js";
import { redis } from "../database/redis.js";


const handleSocketConnections = ()=>{

     io.on('connection',(socket)=>{
     
     console.log("new user connected ",socket.id)

     socket.on('send_message',(message)=>{
          console.log(message);
          io.emit('receive_message',message)
     })
     socket.on('disconnect',()=>{   
          console.log('user disconnected with id ',socket.id)
     })
})
}


export  {handleSocketConnections}

