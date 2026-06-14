import Redis from 'ioredis'

let redis =''
const connectredis = async ()=>{
     try{
           redis =await new Redis(process.env.REDIS_URL)
           console.log("redis connected!")
     } catch(error){

          console.log(error)

     }
     
}



export {redis,connectredis}