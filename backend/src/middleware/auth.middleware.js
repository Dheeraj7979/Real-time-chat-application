import { redis } from "../database/redis.js";
import { User } from "../models/user.models.js";
import { Apierror } from "../utils/apierror.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

const authmiddleware = asyncHandler(async(req,res,next)=>{

     try{
          // const token = (req?.headers['authorization']).split(' ')[1] || ''
          const token = req?.cookies?.session || ''
          if(!token){
                    throw new Apierror(401,"token failed")
          }
          let data = await redis.get(`session:${token}`)
          data = await JSON.parse(data)
          const user = await User.findById(data.userId)
          req.user = user
          next()
     } catch(error){
          throw new Apierror(401,"token failed")
     }
})

export {authmiddleware}