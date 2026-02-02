import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';

const Ideal = () => {
  const [sTime, setSTime] = useState(new Date());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [excelData, setExcelData] = useState([]);
  const [currentDataIndex, setCurrentDataIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [speech_gender, setSpeech_gender] = useState('Male');

  const [volume, setVolume] = useState(0.05); // default volume
  const backgroundAudioRef = useRef(null);

  const images = [
    "/banner0.jpg", "/banner1.jpg", "/banner2.jpg", "/banner3.jpg",
    "/banner4.jpg", "/banner5.jpg", "/banner6.jpg", "/banner7.jpg",
    "/banner8.jpg", "/banner9.jpg",
  ];

  const currentRow = useMemo(() => excelData[currentDataIndex], [excelData, currentDataIndex]);

  // ⏯️ Setup idle background music
  useEffect(() => {
    backgroundAudioRef.current = new Audio("/Bongo.mp3");
    backgroundAudioRef.current.loop = true;
    backgroundAudioRef.current.volume = volume;

    // backgroundAudioRef.current.volume = 0.02; // adjust as needed
    backgroundAudioRef.current.play().catch(e => console.log("Music play failed:", e));

    return () => {
      backgroundAudioRef.current.pause();
      backgroundAudioRef.current.volume = 0 ;
      backgroundAudioRef.current = null;
    };
  }, []);

  // 🕒 Clock timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  ////////////// 🎞️ Volume change update /////////////////////////////
  useEffect(() => {
  if (backgroundAudioRef.current) {
    backgroundAudioRef.current.volume = volume;
  }
}, [volume]);

  // 🎞️ Rotate banner images
  useEffect(() => {
    const imageTimer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        if (!currentRow) {
backgroundAudioRef.current.play().catch((e) => console.log("Sound play failed:", e));
          // transitionSound.play().catch((e) => console.log("Sound play failed:", e));
        }
        return (prevIndex + 1) % images.length;
      });
    }, 3000);
    return () => clearInterval(imageTimer);
  }, [currentRow]);

  // 📊 Excel data slideshow
  useEffect(() => {
    if (excelData.length === 0) return;
    const dataTimer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentDataIndex((prev) => (prev + 1) % excelData.length);
      backgroundAudioRef.current.pause();
      // backgroundAudioRef.current.volume = 0;
      // backgroundAudioRef.current = null;
      //   transitionSoundLong.volume = 1;
      //   transitionSoundLong.play().catch((e) => console.log("Sound play failed:", e));
        setFade(true);
      }, 800);
    }, 10000);
    return () => clearInterval(dataTimer);
  }, [excelData]);

  // 🗣️ Speech synthesis
  useEffect(() => {
    if (currentRow && typeof window !== "undefined") {
      try {
        const text = Object.entries(currentRow)[0];
        const speech = new SpeechSynthesisUtterance(text);
        speechSynthesis.cancel();
        setSpeech_gender(prev => prev === "Male" ? "Female" : "Male");
        speech.lang = speech_gender === 'Male' ? 'en-US' : 'en-IN';
        speech.pitch = 5;
        speech.rate = 1.5;
        speech.volume = 2;
        speechSynthesis.speak(speech);
      } catch (err) {
        console.error("Text-to-speech failed:", err);
      }
    }
  }, [currentRow]);

  const transitionSoundLong = new Audio("/delete.mp3");
  const formattedsTime = sTime.toLocaleTimeString();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const binaryStr = evt.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(jsonData);
      setCurrentDataIndex(0);
    };
    reader.readAsBinaryString(file);
  };

/////////////////////////////////////////////////////////////////////////////////////////
  return (
    <>
    <div className="p-0">

{!currentRow && (
  <div className="flex">
    {Array.from({ length: 3 }).map((_, i) => {
      const imgIndex = currentImageIndex - i;
      if (imgIndex < 0) return <div style={{ width: '300px', height: '270px', marginTop: 10, marginLeft: 8 }} />;
      return (
        <img
          key={i}
          src={images[imgIndex]}
          alt={`Banner ${imgIndex}`}
          style={{ width: i === 1 ? '600px' : '300px', height: i === 1 ? '250px' : '270px', marginTop: 10, marginLeft: 8 }}
          className="rounded-lg shadow-md transition-all duration-700"
        />
      );
    })}
  </div>
)}

{/* /////////////////      Excel Data Slide   ////////////////////  */}
      {currentRow && (
        < >
      <div>
      <h3 className="md:text-4xl justify-center text-center text-green-500 px-0 py-0">
        {formattedsTime}
      </h3>
      </div>

        <div className={`rounded-lg  shadow-md p-3 pd-0 mx-auto w-auto transition-opacity duration-700 ${fade ? 'opacity-100' : 'opacity-0'}`}>

          {Object.entries(currentRow).map(([key, value], idx) => (
    < >
      <div className="flex text-center  ">
      <p key={idx} className="text-green-500 md:text-4xl ">
        {key} :
      </p>
     
      <p key={idx} className=" text-red-500 md:text-4xl ">
            { value } 
      </p>
      </div>
      </>

          ))}
        </div>
        </>
      )}


      {/* //////////////////  Time  ///////////////////////////// */}
      {!currentRow && (
      
      <div>
      <h1 className="color-change md:text-8xl justify-center  px-52 py-0">
        {formattedsTime}
      </h1>
      </div>
         
      )}

{!currentRow && (
< >
{/* ////////////////////////// DESCTIPTION /////////////////////////// */}
      <div className="text-center mb-6" >
 
        <p className="text-yellow-500">
        We are a leading Construction & Mining Equipment Maintenance Service provider 
        having expertise in complete equipment and component repairs. We provide repair 
        and maintenance services for Hydraulic Excavators, Surface Miner, Dozers, Motor Graders, Wheel Loaders, 
        & Tipper/Dump Trucks. 
        </p>
 
        <p className="text-green-500 py-5">
        We develop & supply custom-built “Workshop On Wheels, Mobile Service Van, Tyre Repair & Maintenance Unit 
        and Lubrication Unit“ to assist maintenance activities.
        </p>
      </div>
 <div className="flex justify-center items-center mt-4">
  <label className="text-green-500 mr-2">🔊 Volume:</label>
  <input
    type="range"
    min="0"
    max="1"
    step="0.01"
    value={volume}
    onChange={(e) => setVolume(parseFloat(e.target.value))}
    className="w-48"
  />
</div>
      </>
)}      
      
{/* ////////////////////////// Excel Upload /////////////////////////// */}
      <div className="flex justify-center mb-2"> 
        <input style={{  color: 'white'  }}
         type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      </div>
    </div>
    </>
  );
};

export default Ideal