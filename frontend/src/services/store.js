import { configureStore } from "@reduxjs/toolkit";
import { api } from "./apiSlice";
import notificationReducer from './NotificationSlice.js'


const store = configureStore({
     reducer:{
          notification:notificationReducer,
          [api.reducerPath]:api.reducer,
          
     },
     middleware: (getDefaultMiddlewares) => getDefaultMiddlewares().concat(api.middleware),
});

export default store
