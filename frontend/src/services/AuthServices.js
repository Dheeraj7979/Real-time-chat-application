import { BASE_URL } from "../constants.js";
import axios, { AxiosHeaders } from "axios";
import { axiosInstance } from "../utils/axiosInstance.jsx";

const RegisterService = async function(payload){
     try{
     const response = await axiosInstance.post(`user/register`,payload);
     return response.data

     }catch(error){
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
          return response.data
     }catch(error){
          return Promise.reject(error)
     }
}

const refreshtokens = async function(){
     try{
          const response = await axiosInstance.post('user/refresh-token')
          return response.data

     }catch(error){
          return Promise.reject(error)
     }
}

const getuserdetails = async function(){
     try{
          const response = await axiosInstance.get('user/details')
          return response.data

     }catch(error){
          return Promise.reject(error)
     }
}

const logoutservice = async function(){
     try{
          const response = await axiosInstance.post('/user/logout')
          return response.data
     } catch(error){
          return Promise.reject(error)
     }
}

const avatarupdateservice = async function (formData) {
  try {
    const response = await axiosInstance.post('/user/update-avatar',formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

export {
     RegisterService,
     getotp,
     Loginservice,
     refreshtokens,
     getuserdetails,
     logoutservice,
     avatarupdateservice
}