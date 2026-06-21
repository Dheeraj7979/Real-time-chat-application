import { BASE_URL } from "../constants.js";
import axios, { AxiosHeaders } from "axios";
import { axiosInstance } from "../utils/axiosInstance.js";


const searchFriend = async()=>{
     try{
          const response = await axiosInstance.get(`friend/all`)
          return response.data
     } catch(error){
          return Promise.reject(error)
     }
}

const sendrequest = async({email})=>{
     try{
          const response = await axiosInstance.post('/friend/request',email)
          return response.data
     } catch(error){
          return Promise.reject(error)
     }
}
const acceptrequest = async({email})=>{
     try{
          const response = await axiosInstance.post('/friend/accept',email)
          return response.data
     } catch(error){
          return Promise.reject(error)
     }
}
const cancelRequest = async({email})=>{
     try{
          const response = await axiosInstance.post('/friend/cancel',email)
          return response.data
     }catch(error){
          return Promise.reject(error)
     }
}

export {searchFriend,sendrequest,acceptrequest,cancelRequest}