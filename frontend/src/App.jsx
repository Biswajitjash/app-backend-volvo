import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Pages/Header.jsx";
import LoginModal from './components/Pages/Login.jsx';
import Sidebar from "./components/Pages/Sidebar.jsx";
import Ideal from "./components/Pages/Ideal.jsx";
import Logout from "./components/Pages/Logout.jsx";
import { speakFunction } from './utils/SpeakFunction.jsx';
// import SessionWatcher from './components/common/SessionWatcher';


function App() {
  const [isLogin, setIsLogin] = useState(localStorage.getItem('Login') || null );
  const [isUname, setIsUname] = useState(localStorage.getItem('Uname') || null );
  // const [welcomeMessage, setWelcomeMessage] = useState('');
  const [showLogin, setShowLogin] = useState(false);

//////////////////////////Login process start /////////////////////////
  
  const handle_Login = () => {

    {!showLogin && ( speakFunction("Welcome to Login ") )};  
 
    setShowLogin(true);
  
const l_isLogin = localStorage.getItem('Login');
{l_isLogin  && (setIsLogin(l_isLogin)) };

const l_isUname = localStorage.getItem('Uname');
{l_isUname  && (setIsUname(l_isUname)) };

// if (l_isLogin) {
//   speakFunction(`You Welcome, ${l_isUname}`);
// }

  }


  //////////////////////////LogOut process start /////////////////////////

  const handleLogout = () => {
    setIsLogin(false);
    localStorage.removeItem('Login');
    localStorage.removeItem('Uname');
    localStorage.removeItem('FaceImage');
    localStorage.removeItem('Mobile');
  
    speakFunction("Thank you and Good Bai ");
  window.location.href = "/goodbye";

  }

  //////////////////////////LogOut process ends/////////////////////////

  return (



    // { isLogin ?  (window.close()) :() };
    <div className="h-screen flex flex-col">
      <div className="bg-yellow-400  ">
        <Header 
        isLogin={isLogin}  
        // onLogin={handle_Login} 
        onLogout={handleLogout} 
        isUname={isUname} />     

    {showLogin && ( 
        <LoginModal 
          onClose={() => setShowLogin(false)} 
          alertMessage={speakFunction("No data base installed")} 
          // onSubmit={handle_Login} 
        />
      )}

      </div>
      <div className="flex flex-1 bg-black text-white">
        {isLogin && (
          <>
            <div className=" flex pt-10 bg-yellow-400 min-w-[12%]">
              <Sidebar onLogout={handleLogout} onNavpath={handle_Login} />
            </div>

            <div  className=" flex py-0  px-0 justify-center text-center bg-black min-w-[85%] pb-2 pt-11" > 
            <Ideal />
            </div>
          </>
        )};

        {!isLogin && (          
          <main className=" p-1">
            <Logout className="text-10xl h-%  w-100% md:text-9xl  text-pink-700 px-2 py-45 text-center" />
          </main>
        )};


      </div>

    </div>
  );
}

export default App;
