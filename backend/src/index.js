import {app} from './app.js'
import {io,server} from './app.js'
import { connectdb } from './database/mongo.js'
import { connectredis } from './database/redis.js'
import { handleSocketConnections } from './socket/socket.controller.js'
app.get('/',(req,res)=>{
     res.json("really listning")
})



await connectredis()
await connectdb()

handleSocketConnections()

server.listen('8000',()=>{
     console.log("app listining")
})