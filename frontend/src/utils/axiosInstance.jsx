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
     baseURL:BASE_URL,
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
             console.log(error.response.data.message)
            if(error.response.data.message =='jwt expired' || error.response.data.message==="token failed"){
                console.log("working because token expired ! ")
                if(count<3){
                    try{
                        
                        const response= await refreshtokens()
                        count+=1;
                        console.log(response)
                        if(contextStateHolder.updateuser){
                            contextStateHolder.updateuser(response.data)
                            console.log("updated")
                            localStorage.setItem('token',response.data.accessToken)
                        }
                    } catch(err){
                        contextStateHolder.setisLoggedin(false)
                        contextStateHolder.updateuser({})
                        localStorage.removeItem('token')
                    } 
                }
 
            }
            else if(error.response.status===500){
                console.error("Server error. Please try again later.");
            }else if(error.code === "ECONNABORTED"){
                console.error("Reques timeout. Please try again.");
            }
            
        }
        return Promise.reject(error);
    }
)

export {axiosInstance}