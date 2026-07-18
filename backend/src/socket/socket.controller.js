import { io } from "../app.js";
import { redis } from "../database/redis.js";
import { Message } from "../models/message.models.js";
import { Apierror } from "../utils/apierror.js";

export const allsockets = new Map();

const handleSocketConnections = async () => {
  try {
    io.on('connection', (socket) => {
      console.log("New user connected:", socket.id);

      socket.on('join_room', (email) => {
        if (!email) return;
        
        const cleanEmail = email.trim();
        socket.join(cleanEmail);
        
        allsockets.set(cleanEmail, socket.id);
      });

      
      socket.on('send_message', async (data) => {
        try {
          
          const sortedEmails = [...data.email].sort();
          const room = `${sortedEmails[0]}_${sortedEmails[1]}`;

          const senderkey = data.sender.trim();
          const receiverkey = data.receiver.trim();

          const newmsg = await Message.create({
            message: data.message,
            room: room,
            sender: data.sender,
            receiver: data.receiver,
            createdAt: new Date()
          });

          const senderSocketId = allsockets.get(senderkey);
          const receiverSocketId = allsockets.get(receiverkey);


          if (senderSocketId) {
            io.to(senderSocketId).emit('receive_message', newmsg);
          }
          if (receiverSocketId) {
            io.to(receiverSocketId).emit('receive_message', newmsg);
          }

          console.log(`Message successfully routed to room ${room}`);

        } catch (err) {
          console.log("Database/Emit Error:", err);
        }
      });

      socket.on('typing',async(data)=>{
        socket.to(data.receiveremail).emit('typing',{senderemail:data.senderemail})
      })


      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        for (let [email, id] of allsockets.entries()) {
          if (id === socket.id) {
            allsockets.delete(email);
            console.log(`Cleaned up Map for disconnected user: ${email}`);
            break;
          }
        }
      });
    });
    return io;

  } catch (err) {
    console.log("Socket Connection Initialization Error:", err);
  }
};

export { handleSocketConnections };

export const getIo = ()=>{
  if(!io){
    throw new Apierror(500,"Socket.io not initialized!")
  } else {
    return io
  }
}

