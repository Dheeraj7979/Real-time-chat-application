import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { findUnknownUsers } from './friendsServices'; 

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes:['User',"UnknownUsers",'Notification','friends','History'],
  keepUnusedDataFor:60,

  endpoints: (builder) => ({
    findUnknownUsers: builder.query({
  query: ({ lastId, limit }) => ({
    url: '/friend/unknown',
    method: "GET",
    params: { limit, lastId }
  }),
  providesTags: ['UnknownUsers'],
               serializeQueryArgs: ({ endpointName }) => {
               return endpointName;
               },
               merge: (currentCache, newItems, { arg }) => {
               if (!arg.lastId) {
                    return newItems;
               }
               currentCache.data.push(...newItems.data);
               },
               forceRefetch({ currentArg, previousArg }) {
               return currentArg !== previousArg;
               },
}),
  }),
});

export const { useFindUnknownUsersQuery } = api;