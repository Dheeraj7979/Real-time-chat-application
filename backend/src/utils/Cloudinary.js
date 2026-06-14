import dotenv from 'dotenv'
dotenv.config();
import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({
     api_key:process.env.CLOUDINARY_API_KEY,
     api_secret:process.env.CLOUDINARY_API_SECRET,
     cloud_name:process.env.CLOUDINARY_CLOUD_NAME
})
const uploadonCloudinary = async function(filepath){
     try{
          const response = await cloudinary.uploader.upload(filepath)
          console.log(`file uploaded on cloudinary ${response.url}`)
          fs.unlinkSync(filepath)
          return response
     }catch(error){
          console.log(`error while uploading file on cloudinary ${error}`)
          fs.unlinkSync(filepath)
     }
     
}

export {uploadonCloudinary}