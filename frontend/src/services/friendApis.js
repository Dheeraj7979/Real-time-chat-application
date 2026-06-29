import { createApi } from "@reduxjs/toolkit/query/react";
import { api } from "./apiSlice";


export const friendSlice = api.injectEndpoints({
     endpoints:(builder)=>({
          sendRequest: builder.mutation({
               query: (credentials)=>({
                    url:'/friend/request',
                    method:'POST',
                    body:credentials,
               }),
               invalidatesTags:['UnknownUsers']
          }),

          cancelRequest: builder.mutation({
               query: (credentials)=>({
                    url:'/friend/cancel',
                    method:'POST',
                    body:credentials,
               }),
               invalidatesTags:['UnknownUsers']
               
          }),
          acceptRequest: builder.mutation({
               query:(email)=>({
                    url:'/friend/accept',
                    method:'POST',
                    body:email
               }),
               invalidatesTags:['friends']
          }),
          rejectRequest: builder.mutation({
               query:(email)=>({
                    url:'/friend/reject',
                    method:'DELETE',
                    body:email
               })
          }),
          getAllfriends: builder.query({
               query:(task)=>({
                    url:'/friend/all',
                    method:'GET'
               }),
               providesTags:['friends'],
               transformResponse:(response)=>{
                    return response.data
               }
          }),
     })
})

export const  {useSendRequestMutation,useCancelRequestMutation,useAcceptRequestMutation,useRejectRequestMutation,useGetAllfriendsQuery} = friendSlice