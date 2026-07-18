import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const userSchema = mongoose.Schema({
     email:{
          type:String,
          lowercase:true,
          unique:true
     },
     password:{
          type:String,
     },
     name:{
          type:String,
          default:''
     },
     phone:{
          type:String,
          default:''
     },
     about:{
          type:String,
          default:''
     },
     accessToken:{
          type:String,
     },
     refreshToken:{
          type:String,
     },
     profile:{
          type:String,
          default:''
     },
     isVerified:{
          type:Boolean,
          default:false
     },
     friends:[
          String,
     ],
     requests:[
          {type:String}
     ],
     rooms:[
          {
               id:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Room",
               }
               
          }
     ]
})

userSchema.methods.generateAccessToken = function(){
     return jwt.sign({
          _id:this._id,
          email:this.email
     },
     process.env.ACCESS_TOKEN_SECRET,
     {
          expiresIn:process.env.ACCESS_TOKEN_EXPIRESIN,
     }
)
}
userSchema.methods.generateRefreshToken =async function(){
     return jwt.sign({
          _id:this._id,
          email:this.email
     },
     process.env.REFRESH_TOKEN_SECRET,
     {
          expiresIn:process.env.REFRESH_TOKEN_EXPIRESIN,
     }
)
}

export const User = mongoose.model("User",userSchema)