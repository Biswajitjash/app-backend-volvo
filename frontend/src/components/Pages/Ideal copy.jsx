import React, { useState, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

const Ideal = () => {

  const [sTime, setSTime] = useState(new Date());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);
  


  const images = [
    "/banner.jpg",
    "/banner1.jpg",
    "/banner2.jpg",
    "/banner3.jpg",
    "/banner4.jpg",
    "/banner5.jpg",
    "/banner6.jpg",
    "/banner7.jpg",
    "/banner8.jpg",
    "/banner9.jpg"
  ];

  useEffect(() => {

    const timer = setInterval(() => {
      setSTime(new Date());
    }, 1000); // update every second
    return () => clearInterval(timer); // clean up on unmount
  }, []);


  useEffect(() => {
    const imageTimer = setInterval(() => {
      setFade(false); // Start fade-out
      setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      setFade(true); // Start fade-in
      }, 300); // fade duration (match CSS)

    }, 3000);
    return () => clearInterval(imageTimer);
  }, []);


  const formattedsTime = sTime.toLocaleTimeString();
 
  return (
    <div >
       {/* Image banner at top */}
        <div className="flex justify-center  py-0">
        <img 
          src={images[currentImageIndex]}
          alt={`Banner ${currentImageIndex + 1}`}
          style={{ width: '600px', height: '250px', marginTop: 0 }} 
          className={`rounded-lg shadow-md transition-opacity duration-100 ${fade ? 'opacity-100' : 'opacity-0'}`} />
      </div>
      
    <h1 
    className="md:text-8xl justify-center text-green-500 px-58 py-2 " >
      {formattedsTime}
    </h1>
    
    <h3>
  <p className='px-0 py-0 text-yellow-500'>
    We are a leading Construction & Mining Equipment Maintenance Service provider 
    having expertise in complete equipment and component repairs. We provide repair 
    and maintenance services for Hydraulic Excavators, Surface Miner, Dozers, Motor Graders, Wheel Loaders, 
    & Tipper/Dump Trucks. 
    </p>
    <p className='px-0 py-3 text-green-500'>

    We develop & supply custom-built “Workshop On Wheels, Mobile Service Van, Tyre Repair & Maintenance Unit 
    and Lubrication Unit“ to assist maintenance activities.
    </p>
    </h3>
</div>

);
};


export default Ideal
