import mongoose from "mongoose";


const connectdb = async function(){
     try{
          const response = await mongoose.connect(process.env.MONGO_DB_URI)
          console.log('database connected !')
     } catch(error){
          console.log(error)
          process.exit(1)
     }
     
}

export {connectdb}