import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FaceRecognitionComponent from '../FaceRecognitionComponent';
import { speakFunction } from '../../utils/SpeakFunction';

const Login = ({ onClose, onSubmit }) => {
  const [activeTab, setActiveTab] = useState('username');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const faceRef = useRef(null);
  const navigate = useNavigate();


  const handleLogin = async () => {
    if (activeTab === 'username') {
      if (username && password) {
        try {
          const res = await fetch('http://localhost:8800/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });

          const data = await res.json();
          console.log(data);
          console.log(data.user.usrrole);

          if (res.ok && data.success) {
            localStorage.setItem('Uname', data.user.name);
            localStorage.setItem('Userid', data.user.userid);
            localStorage.setItem('Usermail', data.user.email);
            localStorage.setItem('Login', 'true');
            speakFunction(`Welcome ${username}`);
            // navigate('/admin');
            navigate(data.user.usrrole);

          } else {
            speakFunction(data.message || 'Login failed. Try again.');
          }
        } catch (err) {
          console.error('Login error:', err);
          speakFunction('Server error. Please try again later.');
        }
      } else {
        speakFunction('Please enter username and password.');
      }
    }

    else if (activeTab === 'otp') {
      if (mobile && otp === '1234') {
        localStorage.setItem('Uname', mobile);
        localStorage.setItem('Login', 'true');
        speakFunction(`Welcome ${mobile}`);
        navigate('/admin');
      } else {
        speakFunction('Invalid mobile number or OTP.');
      }
    }

    else if (activeTab === 'face') {
      if (faceRef.current) {
        const result = await faceRef.current.scanFace();
        if (result.success) {
          speakFunction('Face recognized successfully. Logging in.');
          localStorage.setItem('Login', 'true');
          localStorage.setItem('FaceImage', result.image);
          navigate('/admin');
        } else {
          speakFunction('No face detected. Try again.');
        }
      }
    }
  };

  const handleGuestLogin = async () => {
    if (activeTab === 'username') {

            localStorage.setItem('Uname', "GuestUser");
            localStorage.setItem('Userid', "GuestID001");
            localStorage.setItem('Usermail', "guest@example.com");
            localStorage.setItem('Login', 'true');
            speakFunction(`Welcome As Guest User`);
            navigate('/guest-home'); 
            // navigate(data.user.usrrole);

          }
        };

  const handleClose = () => {
    localStorage.clear();
    speakFunction('Your login has been cancelled.');
    navigate('/goodbye');
  };


    useEffect(() => {
    speakFunction('Welcome to Login');
    }, []);
    
  return (
    <div className="fixed inset-0  bg-opacity-40 flex 
    items-center justify-center z-50">

      <div className="p-6 rounded-xl  
      animated-purple-shadow      
      relative overflow-hidden
       w-96">

      <div className="bg-yellow-200 rounded-xl shadow-md  p-6 z-10 relative">
        
        <h2 className="text-purple-600 text-2xl font-bold mb-4">Hello! Let's get started</h2>
        <p className="text-sm text-gray-500 mb-4">Sign in to continue.</p>

        <div className="flex justify-between mb-4">
          <button onClick={() => setActiveTab('username')}
            className={`flex-2 py-2 border w-1/2 ${activeTab === 'username' ? 'bg-pink-500 text-white' : ''}`}>
            Username
          </button>
          <button onClick={() => setActiveTab('otp')}
            className={`flex-2 py-2 border w-1/2 ${activeTab === 'otp' ? 'bg-green-500 text-white' : ''}`}>
            Mobile OTP
          </button>
        </div>

        {activeTab === 'username' && (
          <>
            <input
              className="w-full bg-green-300 p-2 mb-3 border rounded"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="w-full p-2 bg-green-300 mb-4 border rounded"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}

        {activeTab === 'otp' && (
          <>
            <input
              className="w-full bg-pink-200 p-2 mb-3 border rounded"
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <input
              className="w-full bg-pink-200 p-2 mb-4 border rounded"
              type="text"
              placeholder="Enter OTP (1234)"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </>
        )}

        {activeTab === 'face' && (
          <div className="text-center p-0">
            <FaceRecognitionComponent ref={faceRef} />
          </div>
        )}

        <div className="flex gap-2 mb-2">
          <button
            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded"
            onClick={handleLogin}
          >
            SIGN IN
          </button>
          <button
            className="flex-1 bg-red-500 hover:bg-gray-400 text-black font-bold py-2 rounded"
            onClick={handleClose}
          >
            CANCEL
          </button>
        </div>

        {activeTab !== 'face' && (
          <div>
            <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
              <label className="flex items-center space-x-2">
                <input type="checkbox" />
                <span>Keep me signed in</span>
              </label>
              <a href="#" className="text-purple-500 hover:underline">Forgot password?</a>
            </div>

            <button className="w-full mt-4 bg-blue-700 text-white py-2 rounded">
              Sign in as Guest
              <span onClick={handleGuestLogin} className="ml-2 underline">Click Here</span>
            </button>

            <p className="text-center mt-4 text-sm">
              <a href="/create_new_userid" className="text-purple-600 hover:underline">Don’t have an account? Create</a>
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Login;
