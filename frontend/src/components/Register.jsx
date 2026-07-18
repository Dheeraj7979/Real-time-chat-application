import React, { useState, useEffect, useContext } from 'react';
import { getotp, googleauthService, RegisterService } from '../services/AuthServices.js';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Usercontext } from '../context/UserContext.jsx';

const Register = () => {
  const {user,updateuser} = useContext(Usercontext)
  const navigate = useNavigate()
  // Form State
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI Flow State
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP & Details
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Username Availability State
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null); // null = un-checked, true = available, false = taken

  // --- API Handlers ---

  // 1. Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) return setMessage('Please enter a valid email.');
    
    setIsLoading(true);
    try {

     const response = await getotp({email});
      console.log(response)
      setStep(2);
      setMessage('OTP sent to your email!');
    } catch (error) {
      setMessage('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkUsernameAvailability = async (user) => {
    setIsCheckingUsername(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      const takenUsernames = ['admin', 'testuser', 'superuser'];
      setIsUsernameAvailable(!takenUsernames.includes(user.toLowerCase()));
    } catch (error) {
      console.error('Error checking username:', error);
      setIsUsernameAvailable(null);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setMessage('Passwords do not match.');
    }
    if (isUsernameAvailable === false) {
      return setMessage('Please choose an available username.');
    }
    setIsLoading(true);
    try {
      const payload = { email, otp, username, password };
      
      const response = await RegisterService(payload)
      console.log(response)
      if(response){
        navigate('/login')
      }

    } catch (error) {
      if(error?.response?.data?.message){
          toast.error(error.response.data.message)
      }
      console.log(error.response.data)
      setMessage('Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = async (credentialResponse) => {
        try {
            const response = await googleauthService(credentialResponse)
            await updateuser(response.data)
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };


  // Debounce username checking so it doesn't fire on every single keystroke
  useEffect(() => {
    if (username.trim().length > 2) {
      const delayDebounceFn = setTimeout(() => {
        checkUsernameAvailability(username);
      }, 500); // Waits 500ms after user stops typing to fire API

      return () => clearTimeout(delayDebounceFn);
    } else {
      setIsUsernameAvailable(null);
    }
  }, [username]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 text-gray-200">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-white text-center">Create Account</h2>
        
        {message && (
          <div className="mb-4 p-3 rounded bg-gray-800 border border-gray-700 text-sm text-center">
            {message}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-70 mt-2"
            >
              {isLoading ? 'Sending...' : 'Get OTP'}
            </button>
          </form>
        )}

        {/* STEP 2: OTP, Username, and Passwords */}
        {step === 2 && (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">OTP</label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors tracking-widest font-mono"
                placeholder="••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">Username</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full bg-black border rounded-lg px-4 py-2.5 text-white focus:outline-none transition-colors
                    ${isUsernameAvailable === true ? 'border-green-500 focus:border-green-500 focus:ring-1 focus:ring-green-500' : ''}
                    ${isUsernameAvailable === false ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}
                  `}
                  placeholder="Choose a username"
                />
              </div>
              {/* Username Validation Feedback */}
              <div className="mt-1 text-xs min-h-[16px]">
                {isCheckingUsername && <span className="text-gray-500">Checking availability...</span>}
                {!isCheckingUsername && isUsernameAvailable === true && (
                  <span className="text-green-500 font-medium">Username is available!</span>
                )}
                {!isCheckingUsername && isUsernameAvailable === false && (
                  <span className="text-red-500 font-medium">Username is already taken.</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || isUsernameAvailable === false}
              className="w-full bg-white text-black font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>
            
            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              Back to Email
            </button>
          </form>
          
        )}

        <div className='my-2'>
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log("Login Failed")}
        />
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:text-blue-400 transition-colors font-medium">
            Log In
          </a>
     </div>
      </div>
      
    </div>
  );
};

export default Register;