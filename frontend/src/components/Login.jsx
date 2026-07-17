import React, { useState } from 'react';
import { Loginservice } from '../services/AuthServices';
import { UNSAFE_ErrorResponseImpl, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Usercontext } from '../context/UserContext.jsx';
import { toast } from 'react-toastify';



const Login = () => {
  const {user,updateuser} = useContext(Usercontext)
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try{
        const response = await Loginservice({email,password})
        
       await updateuser(response.data)
       await new Promise(resolve => setTimeout(resolve, 2000));
        navigate('/')
    } catch(error){
      if(error?.response?.data?.message){
        toast.error(error.response.data.message)
      }
      console.log(error.response.data)
    }
    
  
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-white text-center">Welcome Back</h2>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="Email Address"
          />
          
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="Password"
          />
          
          <button
            type="submit"
            className="w-full bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors mt-2"
          >
            Sign In
          </button>
        </form>

        {/* --- Added Sign Up Link Here --- */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-500 hover:text-blue-400 transition-colors font-medium">
            Sign up
          </a>
        </div>

      </div>
    </div>
  );
};

export default Login;