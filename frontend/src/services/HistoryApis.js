
import { api } from "./apiSlice";


const HistoryApis = api.injectEndpoints({
     endpoints:(builder)=>({
          fetchChatHistory: builder.query({
               query:({email})=>({
                    url:'/rooms/past-messages',
                    params:{email},
                    method:'GET'
               }),
               providesTags:['History'],
               transformResponse:(response)=>{
                    return response.data
               },
          })
     })
})


export const  {useFetchChatHistoryQuery} = HistoryApis