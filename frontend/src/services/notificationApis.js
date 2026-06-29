import { api } from "./apiSlice";
import { socket } from "../components/Home";

const notificationSlice = api.injectEndpoints({
     endpoints:(builder)=>({
          fetchNotification: builder.query({
               query: ({ id, limit }) => ({
               url: '/notification/all',
               method: 'GET',
               params: { id, limit }
               }),
               providesTags: ['Notification'],
               serializeQueryArgs: ({ endpointName }) => {
               return endpointName;
               },
               merge: (currentCache, newItems, { arg }) => {
               if (!arg.id) {
                    return newItems;
               }
               currentCache.data.push(...newItems.data);
               },
               forceRefetch({ currentArg, previousArg }) {
               return currentArg !== previousArg;
               },

               async onCacheEntryAdded(arg,{updateCachedData , cacheDataLoaded,cacheEntryRemoved}){
                    
                    await cacheDataLoaded;

                    socket.on('notification',(message)=>{
                         console.log(message)
                         console.log(updateCachedData)
                         updateCachedData((draft)=>{
                              console.log(draft)
                              draft.data.unshift(message)
                         })
                    })
               }
               }),
          
          
          deleteNotification: builder.mutation({
               query: ({id})=>({
                    url:'/notification/delete',
                    method:'DELETE',
                    params:{id}
               })
          })
     })
})

export const {useFetchNotificationQuery,useDeleteNotificationMutation} = notificationSlice