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
          default:'https://media.istockphoto.com/id/2222600430/vector/user-icon-silhouette-profile-avatar-profile-user-silhouette-isolated-on-background-icon.jpg?s=1024x1024&w=is&k=20&c=ImsDbmA-8Gf_qa64YJ33693t_lGVC1YYpN9IeYcqkkE='
     },
     isVerified:{
          type:Boolean,
          default:false
     },
     friends:[
          {
               name:String,
               email:String,
          }
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