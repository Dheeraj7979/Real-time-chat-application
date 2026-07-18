import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { UsercontextProvider } from './context/UserContext.jsx'
import { ApiProvider } from '@reduxjs/toolkit/query/react'
import {api} from './services/apiSlice.js'
import { Provider } from 'react-redux'
import store from './services/store.js'
import {GoogleOAuthProvider} from '@react-oauth/google'
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
createRoot(document.getElementById('root')).render(

    <UsercontextProvider>
    <Provider store={store}>
        <GoogleOAuthProvider clientId={CLIENT_ID}>
    <App />
</GoogleOAuthProvider>
    </Provider>
    
    </UsercontextProvider>

)
