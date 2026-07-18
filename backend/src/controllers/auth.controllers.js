
import { redis } from "../database/redis.js"
import { User } from "../models/user.models.js";
import { sendMail } from "../services/sendMail.js";
import { Apierror } from "../utils/apierror.js";
import { Apiresponse } from "../utils/apiResponse.js";
import {asyncHandler}  from '../utils/asyncHandler.js'
import { uploadonCloudinary } from "../utils/cloudinary.js";
import { generateotp, otphtml } from "../utils/generateOtp.js";
import jwt from 'jsonwebtoken'
import crypto from 'node:crypto'
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const cookieOptions= {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
}


const sendOtp = asyncHandler(async(req,res,next)=>{
     const { email } = req.body || {};
     console.log(req.body)
     console.log(email)
     if(email==''|| email==undefined) {
          throw new Apierror(400,"Please enter email!")
     }

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

const Login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email) {
        throw new Apierror(400, "Email required!");
    }

    if (!password) {
        throw new Apierror(400, "Password required!");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new Apierror(404, "Email not registered!");
    }

    // If the account was created using Google
    if (!user.password) {
        throw new Apierror(
            400,
            "This account uses Google Sign-In. Please continue with Google."
        );
    }

    // Compare hashed password
    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new Apierror(403, "Incorrect Password");
    }

    // Create Session
    const token = crypto.randomBytes(32).toString("hex");

    await redis.set(
        `session:${token}`,
        JSON.stringify({
            userId: user._id,
        }),
        "EX",
        86400
    );

    const savedUser = await User.findById(user._id).select("-password");

    res
        .status(200)
        .cookie("session", token, cookieOptions)
        .json(
            new Apiresponse(
                200,
                savedUser,
                "User Logged In Successfully"
            )
        );
});

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

const getCloudinarySignature = asyncHandler(async(req,res,next)=>{
     const user = req.user
     const timestamp = Math.round((new Date()).getTime() / 1000);
  
  const signature = cloudinary.utils.api_sign_request(
    { timestamp: timestamp, folder: 'profile_pics' },
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({ signature, timestamp, apiKey: process.env.CLOUDINARY_API_KEY });
})

const uploadAvatar = asyncHandler(async(req,res,next)=>{
     const user = req.user
     const cloudinaryres = await uploadonCloudinary(req.file.path)
     user.profile = cloudinaryres.secure_url
     await user.save({validateBeforeSave:false})

     res.status(200).json(
          new Apiresponse(200,user.profile,"profile updated")
     )
})

const googleAuth = asyncHandler(async (req, res) => {
    const { credential } = req.body;

    if (!credential) {
        throw new Apierror(400, "Google credential is required");
    }

    // Verify Google ID Token
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
        email,
        name,
        picture,
        sub: googleId,
        email_verified,
    } = payload;

    if (!email_verified) {
        throw new Apierror(403, "Google account is not verified");
    }

    // Find existing user
    let user = await User.findOne({ email });

    // Create new user if first login
    if (!user) {
        user = await User.create({
            email,
            name,
            profile: picture,
            googleId,
            isVerified: true,
        });
    }

    // Link Google account for existing users
    if (!user.googleId) {
        user.googleId = googleId;

        if (!user.profile) {
            user.profile = picture;
        }

        await user.save({ validateBeforeSave: false });
    }

    // Create Redis Session
    const sessionId = crypto.randomBytes(32).toString("hex");

    await redis.set(
        `session:${sessionId}`,
        JSON.stringify({
            userId: user._id,
        }),
        "EX",
        60 * 60 * 24
    );

    const savedUser = await User.findById(user._id).select("-password");

    return res
        .status(200)
        .cookie("session", sessionId, cookieOptions)
        .json(
            new Apiresponse(
                200,
                savedUser,
                "Google Login Successful"
            )
        );
});

export {sendOtp,
     emailVerification,
     Login,
     refreshAccessToken,
     userdetails,
     logOut,
     uploadAvatar,
     googleAuth
}