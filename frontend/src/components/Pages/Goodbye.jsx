import React from 'react'
import { speakFunction } from '../../utils/SpeakFunction';
const Goodbye = () => {
localStorage.clear();
  
  speakFunction("Have a Good Day")   

  return (

    <div className="p-4" >
      <h1 className="text-2xl color-yellow">You are Logout</h1>


      <p>You Are Logout .........</p>
    </div>  )
}

export default Goodbye
