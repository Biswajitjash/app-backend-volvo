import { Target } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { speakFunction } from '@/utils/SpeakFunction';
// import { parseScale } from 'recharts/types/util/ChartUtils';
// import LoginModal from './components/Pages/Login';


const Create_Newuser = () => {
  const navigate = useNavigate();

    const [userid, setUserid] = useState('');
    const [name, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confpassword, setConfpassword] = useState('');
    const [email, setEmail] = useState('');
    const [usrrole, setUsrrole] = useState('/Admin');

    // const [mobile, setMobile] = useState('');
    // const faceRef = useRef(null);
//   const [showLogin, setShowLogin] = useState(false);



  const handleCancel = (e) => {
    e.preventDefault();
    // setShowLogin(true);
navigate('/Login');
    // navigate("/"); // Route back to login page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can add validation and backend call here
    alert("Try to  Create Account !");
    

    if (password !== confpassword) {
    speakFunction('Passwords/Confirm Password do not match!');
    return;
  }


  if (!userid || !name || !password) {
    speakFunction('Please enter userid, name, and password.');
    return;
  }

      if (!usrrole) { setUsrrole('/Admin')};


        try {
   const res = await fetch('http://localhost:8800/create_user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userid, name, email, password, usrrole }),
    });



          const data = await res.json();
          // console.log(data);
          // console.log(data.user.usrrole);


          if (res.ok && data.success) {
            // localStorage.setItem('Uname', data.user.name);
            // localStorage.setItem('Userid', data.user.userid);
            // localStorage.setItem('Usermail', data.user.email);
            // localStorage.setItem('Login', 'true');
            // speakFunction(`Welcome ${username}`);
            navigate('/Login');
            // navigate(data.user.usrrole);
          } else {
            speakFunction(data.message || 'Login failed. Try again.');
          }
        } catch (err) {
          console.error('Login error:', err);
          speakFunction('Server error. Please try again later.');
        }       
  };



  return (
    <div className="p-8 max-w-md mx-auto bg-violet-300 from-white mt-15
     to-purple-100 rounded-2xl shadow-[0_0_10px_15px_rgba(255,255,0,0.7)] border  ">
      <h2 className="text-2xl font-extrabold  color-change text-center  mb-4">🎉 Create New Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
  <>
      <input 
        className="w-full bg-white border-2 border-purple-300 focus:border-purple-600 p-3 rounded-xl focus:outline-none"
        type="text" 
        placeholder="👤 Employee ID"  
        value={userid}
        onChange={(e) => setUserid(e.target.value)}
      />
        
      <input 
        className="w-full bg-white border-2 border-purple-300 focus:border-purple-600 p-3 rounded-xl focus:outline-none"
        type="text" 
        placeholder="👤 User name"  
        value={name}
        onChange={(e) => setUsername(e.target.value)}
      />
        
      <input 
        className="w-full bg-white border-2 border-purple-300 focus:border-purple-600 p-3 rounded-xl focus:outline-none"
        type='email' 
        placeholder="📧 Enter you Email"  
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input 
        className="w-full bg-white border-2 border-purple-300 focus:border-purple-600 p-3 rounded-xl focus:outline-none"
        type="password" 
        placeholder="🔒 Password"  
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input 
        className="w-full bg-white border-2 border-purple-300 focus:border-purple-600 p-3 rounded-xl focus:outline-none"
        type="password" 
        placeholder="🔒Confirm Password"  
        value={confpassword}
        onChange={(e) => setConfpassword(e.target.value)}
      />

      <input 
        className="w-full bg-white border-2 border-purple-300 focus:border-purple-600 p-3 rounded-xl focus:outline-none"
        type='text' 
        placeholder="/Landing Component"  
        value={usrrole}
        onChange={(e) => setUsrrole(e.target.value)}
      />
    
  </>
        <div className='flex gap-10'>
        <button type="submit" className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 transition duration-300">
          🚀 Create Account
        </button>

        <button onClick={handleCancel} className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transition duration-300">
          ❌ Cancel
        </button>
      </div>
      </form>
    </div>
  );
};

export default Create_Newuser;
