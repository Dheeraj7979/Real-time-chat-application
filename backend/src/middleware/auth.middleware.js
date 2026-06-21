import { User } from "../models/User.models.js";
import { Apierror } from "../utils/Apierror.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from 'jsonwebtoken'

const authmiddleware = asyncHandler(async(req,res,next)=>{
     const token = (req?.headers['authorization']).split(' ')[1]
     const decodedtoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
     if(!token){
          throw new Apierror(403,"token failed")
     }
     const useremail = decodedtoken.email
     const user = await User.findOne({email:useremail})
     
     if(!user || token!=user.accessToken){
          throw new Apierror(403,"token failed!")
     }

     req.user = user

     next()
})

export {authmiddleware}