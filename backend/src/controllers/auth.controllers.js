
import { redis } from "../database/redis.js"
import { User } from "../models/User.models.js";
import { sendMail } from "../services/sendMail.js";
import { Apierror } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/apiresponse.js";
import {asyncHandler}  from '../utils/AsyncHandler.js'
import { generateotp, otphtml } from "../utils/generateOtp.js";
import jwt from 'jsonwebtoken'


const cookieOptions= {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
}


const sendOtp = asyncHandler(async(req,res,next)=>{
     const {email} = req.body||'';
     console.log(req.body)
     console.log(email)
     if(email==''|| email==undefined) {
          throw new Apierror(400,"Please enter email!")
     }
     console.log("otp request received ");

     const otp = generateotp()
     const html = otphtml(otp)

     const redisdata = await redis.set(`otp${email}`,JSON.stringify(otp),'EX',900);
     const sendmail = await sendMail(email,'OTP verification email',html)

     res.status(201).json(
          new Apiresponse(201,email,`otp sent on ${email} valid for 15mins`)
     )
})

const emailVerification = asyncHandler(async (req,res,next)=>{
     const {email,otp,password,username} = req.body;

     const alreadyexisteduser = await User.findOne({email})
     console.log(alreadyexisteduser)
     if(alreadyexisteduser){
          throw new Apierror(403,"email already registered")
     }

     const data = await redis.get(`otp${email}`)
     if(data){
          const redisotp =await JSON.parse(data)

          if(otp!=redisotp){
               throw new Apierror(403,"Incorrect otp")
          }
     }
     

     const user = await User.create({
          email:email,
          password:password,
          isVerified:true,
          name:username
     })
     res.status(200).json(
          new Apiresponse(201,email,`User registered with email ${email}`)
     )
})

const Login = asyncHandler(async(req,res,next)=>{

     const {email,password} = req.body
     
     if(email==''){
          throw new Apierror(400,"Email required!")
     }
     if(password==''){
          throw new Apierror(400,"password required!")
     }

     const user = await User.findOne({email:email})
     if(user==undefined||user==null){
          throw new Apierror(404,"Email not registered!")
     }

     if(password != user.password){
          throw new Apierror(403,"Incorrect Password")
     }

     const accessToken = await user.generateAccessToken(); 
     const refreshToken  = await user.generateRefreshToken();
     console.log(refreshToken)
     user.accessToken=accessToken
     user.refreshToken = refreshToken

     

     await user.save({validateBeforeSave:false})

     const saveduser = await User.findOne({email}).select("-password -refreshToken")
     

     res.status(200).cookie('refreshToken',refreshToken,cookieOptions).json(
          new Apiresponse(200,saveduser,"User logged In")
     )

})

const refreshAccessToken = asyncHandler(async(req,res,next)=>{
     const token = req?.cookies?.refreshToken ||''
     console.log(req)
     console.log(token)
     if(token===''){
          throw new Apierror(403,"Invalid Token")
     }
     const decodedtoken = jwt.verify( token,process.env.REFRESH_TOKEN_SECRET)
     
     const user = await User.findById(decodedtoken._id)
     if(!user || user.refreshToken!=token){
          throw new Apierror(403,"Unauthorized access")
     }

     const accessToken =await user.generateAccessToken()
     const refreshToken =await user.generateRefreshToken()
     user.accessToken = accessToken
     user.refreshToken = refreshToken
     
     await user.save({validateBeforeSave:false})

     res.status(200).cookie('refreshToken',refreshToken,cookieOptions).json(
          new Apiresponse(200,user,"tokens generated")
     )

})

const userdetails = asyncHandler(async(req,res,next)=>{
     res.status(200).json(
          new Apiresponse(200,req.user,"user details fetched")
     )
})

const logOut = asyncHandler(async(req,res,next)=>{
     const user = req.user

     res.status(200).clearCookie('refreshToken',user.refreshToken).json(
          new Apiresponse(200,{},"User logged Out")
     )
     
})

export {sendOtp,
     emailVerification,
     Login,
     refreshAccessToken,
     userdetails,
     logOut}