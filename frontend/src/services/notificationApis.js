import { api } from "./apiSlice";
import { socket } from "../components/Home";
import { useDispatch } from "react-redux";
import { makeNotificationTrue } from "./NotificationSlice";


const notificationSlice = api.injectEndpoints({
     endpoints:(builder)=>({
          fetchNotification: builder.query({
               async queryFn({ id, limit }, api, extraOptions, baseQuery) {
                    const result = await baseQuery({
                         url: "/notification/all",
                         method: "GET",
                         params: { id, limit },
                    });

                    return result;
                    },

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

          //      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          //           try {
          //           await queryFulfilled;
          //           console.log(arg)
          //           console.log(dispatch(makeNotificationTrue()))
          //      } catch (error) {
          //           console.error(error);
          //      }
          // },

          // socket related updates that is asynchronous updates...
               async onCacheEntryAdded(arg,{updateCachedData ,dispatch, cacheDataLoaded,cacheEntryRemoved}){
                    
                    await cacheDataLoaded;

                    socket.on('notification',(message)=>{
                         console.log(message)
                         console.log(updateCachedData)
                         updateCachedData((draft)=>{
                              console.log(draft)
                              draft.data.unshift(message)
                         })
                         dispatch(makeNotificationTrue())
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