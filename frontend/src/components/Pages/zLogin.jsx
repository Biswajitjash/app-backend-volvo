import React, { useState, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { speakFunction } from '../../utils/SpeakFunction';

const Login = ({ onClose, onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    
    if (username && password) {
    localStorage.setItem('Uname', username);
    localStorage.setItem('Login', true);
      onSubmit(username); 
      onClose();


    } else {
     speakFunction("Please enter user name and password correctly");
    }
  };

  const handleClose = () => {
    
    localStorage.removeItem();
    // localStorage.removeItem('Login');
    // localStorage.removeItem('FaceImage');
    // localStorage.removeItem('Mobile');
    //  speakFunction("Your Login Canceled ");
      onClose();
 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-96">
        <h2 className="text-purple-600 text-2xl font-bold mb-4">Hello! let's get started zLogin</h2>
        {/* <p className="text-lg font-semibold mb-1">Hello! let's get started</p> */}
        <p className="text-sm text-gray-500 mb-4">Sign in to continue.</p>

        <input
          className="w-full p-2 mb-3 border rounded focus:outline-none"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full p-2 mb-4 border rounded focus:outline -none"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      < >
      <div class="flex">
        <button
          className="w-50  bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 rounded"
          onClick={handleLogin}
        >
          SIGN IN
        </button>

        {/* Cancel Button */}
        <button
          className="w-50 bg-red-500 hover:bg-gray-400 text-black font-bold py-2 rounded"
          onClick={handleClose}
        >
          CANCEL
        </button>
        </div>
        </>

        <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
          <label className="flex items-center space-x-2">
            <input type="checkbox" />
            <span>Keep me signed in</span>
          </label>
          <a href="#" className="text-purple-500 hover:underline">Forgot password?</a>
        </div>

        <button className="w-full mt-4 bg-blue-700 text-white py-2 rounded">
          Connect using Facebook
        </button>

        <p className="text-center mt-4 text-sm">
          Don’t have an account? <a href="#" className="text-purple-600 hover:underline">Create</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
