import { configureStore } from "@reduxjs/toolkit";
import { api } from "./apiSlice";

const store = configureStore({
     reducer:{
          [api.reducerPath]:api.reducer,
     },
     middleware: (getDefaultMiddlewares) => getDefaultMiddlewares().concat(api.middleware),
});

export default store
