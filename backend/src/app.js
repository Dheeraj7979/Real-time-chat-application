import './config.js'
import express, { urlencoded } from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app= express();


import http from 'http'
import { Server } from 'socket.io'

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin:'*',
        methods: ["GET", "POST"]
    }
});


const corsOptions = {
  
     origin:process.env.CORS_ORIGIN,
     credentials:true,
}

app.use(express.static("public"))
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


import { AuthRouter } from './routes/user.routes.js';
import { friendRouter } from './routes/friends.routes.js';
import RoomsRouter from './routes/rooms.routes.js';
import { notificationRouter } from './routes/notification.routes.js';
import { agentRouter } from './routes/agent.routes.js';


app.use('/user',AuthRouter)
app.use('/friend',friendRouter)
app.use('/rooms',RoomsRouter)
app.use('/notification',notificationRouter)
app.use('/agent',agentRouter)

app.use((err, req, res, next) => {
    
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export {app,io,server}