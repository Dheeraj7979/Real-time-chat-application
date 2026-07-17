import { createSlice } from "@reduxjs/toolkit";


const NotificationSlice = createSlice({
     name:'notification',
     initialState:{isNotification:false},
     reducers:{
          makeNotificationTrue: (state)=>{
               state.isNotification=true
          },
          makeNotificationFalse: (state)=>{
               state.isNotification=false
          }
     }
})

export const {makeNotificationFalse,makeNotificationTrue} = NotificationSlice.actions
export default NotificationSlice.reducer