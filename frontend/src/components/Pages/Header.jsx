import React, { useState, useEffect } from 'react';

const Header = ({ isLogin, onLogin, onLogout, isUname, onClose, onSubmit }) => {
  const [dateTime, setDateTime] = useState(new Date());
  const [sTime, setSTime] = useState(new Date());

 
  useEffect(() => {

    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000); // update every second

    return () => clearInterval(timer); // clean up on unmount
  }, []);


  const faceImg =  localStorage.getItem('FaceImage' || "");
  const formattedTime = dateTime.toLocaleTimeString();
  
  const formattedDate = dateTime.toLocaleDateString('en-US', {
    weekday: 'long',      // "Sunday"
    year: 'numeric',      // "2025"
    month: 'long',        // "May"
    day: 'numeric',       // "4"
  });

  const formattedsTime = sTime.toLocaleTimeString();

  return (
   
      <header className="fixed top-0 left-0 w-full 
                          bg-white shadow-md  flex justify-between 
                          items-center px-2 m-0 p-0 " >    
        <div >
          <div className="text-lg font-bold color-change mt-0 mb-0">Knowteq Equipcare LLP™</div>
          
            <div className="moving-Left-Right">Engineering Perfection</div>
              
  
        </div>

        {isLogin &&
          <div className="text-sm/3 mb-4
          text-green-600  justify-between 
                          items-center fort-bold  ">
            Committed to machine's care
          <div>

            <p className="text-red-500 px-5 ">
            {formattedDate}   
            </p>
            </div>
          </div>}

<div className="flex gap-4 items-center text-end">
  {isLogin ? (
    faceImg ? (
      <img
        src={faceImg}
        alt="User"
        className="w-12 h-12 rounded-full border-2 border-pink-500 object-cover cursor-pointer"
        onClick={onLogout} />
    ) : (
      <button
        onClick={onLogout}
        className="bg-pink-500 text-white px-5 mb-3 rounded" >
        {isUname}
      </button>
    )
  ) : (
    <button
      onClick={onLogin}
      className="bg-green-500 text-white px-5 mb-4 rounded">
      
        {/* <p className="text-center mt-4 text-sm"> */}
           <a href="/login" className="text-purple-600 hover:underline">{formattedTime}</a>
        {/* </p> */}
    </button>
  )}
</div>
     
      </header>

);
};

export default Header;
