import axios from "axios"
import { BASE_URL } from "../constants.js"
import { useContext } from "react"
import { Usercontext } from "../context/UserContext.jsx"
import { logoutservice, refreshtokens } from "../services/AuthServices.js"


export const contextStateHolder ={
    updateuser:null,
    setisLoggedin:true
};

const axiosInstance = axios.create({
     baseURL:import.meta.env.BASE_URI,
     timeout:80000,
     withCredentials: true,
     
     headers:{
          "Content-Type":"application/json",
          Accept:"application/json",
     }
})

axiosInstance.interceptors.request.use(
     (config)=>{
          const accessToken = localStorage.getItem("token")||''

               config.headers.Authorization = `Bearer ${accessToken}`
          return config
     },
     (error)=>{
          return Promise.reject(error)
     }

)

let count=0;

axiosInstance.interceptors.response.use(
    (response)=>{
        return response;
    },
    async(error)=>{
        if(error.response){
           async (error) => {
    const originalRequest = error.config;

    // If we get a 401 and we haven't retried this request yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark to prevent infinite loops

      // Pause for 150ms to let the cookie finish writing
      await new Promise(resolve => setTimeout(resolve, 150));

      // Retry the exact same request again (now with the cookie present)
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
            if(error.response.status===500){
                console.error("Server error. Please try again later.");
            }else if(error.code === "ECONNABORTED"){
                console.error("Reques timeout. Please try again.");
            }
            
        }
        return Promise.reject(error);
    }
)

export {axiosInstance}