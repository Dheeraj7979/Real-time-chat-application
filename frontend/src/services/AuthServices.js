import { BASE_URL } from "../constants.js";
import axios, { AxiosHeaders } from "axios";
import { axiosInstance } from "../utils/axiosInstance.js";

const RegisterService = async function(payload){
     try{
     const response = await axiosInstance.post(`user/register`,payload);
     return response.data

     }catch(err){
          return Promise.reject(error)
     }
}

const Loginservice = async function({email,password}){
     try{
          const response = await axiosInstance.post(`user/login`,{email,password})
          // console.log(response)
          return response.data
     }catch(error){
          return Promise.reject(error)
     }
}

const getotp = async function({email}){
     try{
          
          const response = await axiosInstance.post(`user/getotp`,{email})
          console.log(response)
          return response.data
     }catch(error){
          return Promise.reject(error)
     }
}

export {RegisterService,getotp,Loginservice}