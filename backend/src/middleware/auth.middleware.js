import { User } from "../models/User.models.js";
import { Apierror } from "../utils/Apierror.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from 'jsonwebtoken'

const authmiddleware = asyncHandler(async(req,res,next)=>{

     try{
          const token = (req?.headers['authorization']).split(' ')[1] || ''
          if(!token){
                    throw new Apierror(401,"token failed")
          }
          const decodedtoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
          const useremail = decodedtoken.email
          const user = await User.findOne({email:useremail})
          
          if(!user || token!=user.accessToken){
               throw new Apierror(401,"token failed")
          }

          req.user = user

          next()
     } catch(error){
          throw new Apierror(401,"token failed")
     }
     
})

export {authmiddleware}