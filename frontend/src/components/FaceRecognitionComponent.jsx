
// import { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
// import * as faceapi from 'face-api.js';

// const FaceRecognitionComponent = forwardRef((props, ref) => {
//   const videoRef = useRef(null);
//   const [facingMode, setFacingMode] = useState('user');

//   useEffect(() => {
//     const MODEL_URL = '/models';

//     const loadModelsAndStartCamera = async () => {
//       try {
//         await Promise.all([
//           faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//           faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
//           faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
//         ]);

//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: { facingMode },
//           audio: false,
//         });

//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           videoRef.current.play();
//         }
//       } catch (err) {
//         console.error('Camera or model loading error:', err);
//         alert('Unable to access camera or load models.');
//       }
//     };

//     loadModelsAndStartCamera();

//     return () => {
//       const tracks = videoRef.current?.srcObject?.getTracks();
//       tracks?.forEach((track) => track.stop());
//     };
//   }, [facingMode]);

//   const stopCamera = () => {
//     const stream = videoRef.current?.srcObject;
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//       videoRef.current.srcObject = null;
//     }
//   };

//   //////////////////////////////////////////////////////////////////////
//   // Calculate Eye Aspect Ratio to detect blink
//   const getEAR = (landmarks, left = true) => {
//     const points = left
//       ? [36, 37, 38, 39, 40, 41]
//       : [42, 43, 44, 45, 46, 47];
//     const p = points.map((i) => landmarks.get(i));
//     const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
//     return (
//       (dist(p[1], p[5]) + dist(p[2], p[4])) / (2.0 * dist(p[0], p[3]))
//     );
//   };

//   //////////////////////////////////////////////////////////////////////

// useImperativeHandle(ref, () => ({
//   async scanFace() {
//     if (!videoRef.current) {
//       alert("Video not available");
//       return { success: false };
//     }

//     const video = videoRef.current;
//     const options = new faceapi.TinyFaceDetectorOptions();

//     console.log("Starting face detection...");

//     const detection = await faceapi
//       .detectSingleFace(video, options)
//       .withFaceLandmarks();

//     if (!detection) {
//       alert("No face detected. Please position your face in the frame.");
//       return { success: false, message: "No face detected." };
//     }

//     alert("Face Detected");

//     // EAR calculation
//     const leftEAR = getEAR(detection.landmarks, true);
//     const rightEAR = getEAR(detection.landmarks, false);
//     const avgEAR = (leftEAR + rightEAR) / 2.0;

//     console.log("Left EAR:", leftEAR);
//     console.log("Right EAR:", rightEAR);
//     console.log("Average EAR:", avgEAR);

//     const blinkDetected = avgEAR < 0.2;

//     if (!blinkDetected) {
//       alert("Please blink to verify you are live.");
//       return { success: false, message: 'Please blink to verify liveness.' };
//     }

//     alert("Blink detected. Liveness verified.");

//     // Capture image
//     const canvas = document.createElement('canvas');
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//     const imageData = canvas.toDataURL('image/jpeg');

//     stopCamera();
//     return { success: true, image: imageData };
//   },
// }));

//   return (
//     <div className="flex flex-col items-center">
//       <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-purple-500">
//         <video
//           ref={videoRef}
//           autoPlay
//           muted
//           playsInline
//           className="object-cover w-full h-full"
//         />
//       </div>
//       <div className="mb-3">
//         <button
//           className="bg-green-500 text-white px-4 py-1 rounded"
//           onClick={() =>
//             setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
//           }
//         >
//           Switch Camera
//         </button>
//       </div>
//     </div>
//   );
// });

// export default FaceRecognitionComponent;





//////////////////////////////////////final functional////////////////////////////////////////////////////
import { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import * as faceapi from 'face-api.js';

const FaceRecognitionComponent = forwardRef((props, ref) => {
    const videoRef = useRef(null);
    const [facingMode, setFacingMode] = useState('user');

    // Start camera and load face-api.js models
    useEffect(() => {
        const MODEL_URL = '/models';

        const loadModelsAndStartCamera = async () => {
      try {
          await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error('Camera or model loading error:', err);
        alert('Unable to access camera or load models.');
      }
    };

    loadModelsAndStartCamera();

    return () => {
      const tracks = videoRef.current?.srcObject?.getTracks();
      tracks?.forEach((track) => track.stop());
    };
  }, [facingMode]);

  // Stop camera stream
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Expose scanFace function to parent
  useImperativeHandle(ref, () => ({
    async scanFace() {
      if (!videoRef.current) return { success: false };

      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (detections.length > 0) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL('image/jpeg');

        stopCamera(); // 👈 Stop camera after successful detection

        return { success: true, image: imageData };
      }

      return { success: false };
    },
  }));

  return (
    <div className="flex flex-col items-center">
      <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-purple-500">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="object-cover w-full h-full"
        />
      </div>
      <div className='mb-3'>
        <button
          className="bg-green-500 text-white px-4 py-1 rounded"
          onClick={() =>
            setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
          }
        >
          Switch Camera
        </button>
      </div>
    </div>
  );
});

export default FaceRecognitionComponent;

//////////////////////////////////////////////////////////////////////////////////////////















      ////////////////////////////proper functional ///////////////////////////////////////////////////////////////////
      // import { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
      // import * as faceapi from 'face-api.js';

      // const FaceRecognitionComponent = forwardRef((props, ref) => {
      //   const videoRef = useRef(null);
      //   const [facingMode, setFacingMode] = useState('user');

      // useImperativeHandle(ref, () => ({
      //   async scanFace() {
      //     if (!videoRef.current) return { success: false };

      //     const detections = await faceapi.detectAllFaces(
      //       videoRef.current,
      //       new faceapi.TinyFaceDetectorOptions()
      //     );

      //     if (detections.length > 0) {
      //       // Capture current frame as image
      //       const canvas = document.createElement('canvas');
      //       canvas.width = videoRef.current.videoWidth;
      //       canvas.height = videoRef.current.videoHeight;
      //       const context = canvas.getContext('2d');
      //       context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      //       const imageData = canvas.toDataURL('image/jpeg');

      //       return { success: true, image: imageData };
      //     }

      //     return { success: false };
      //   }
      // }));

      //   // useImperativeHandle(ref, () => ({
      //   //   async scanFace() {
      //   //     if (!videoRef.current) return false;

      //   //     const detections = await faceapi.detectAllFaces(
      //   //       videoRef.current,
      //   //       new faceapi.TinyFaceDetectorOptions()
      //   //     );

      //   //     return detections.length > 0;
      //   //   }
      //   // }));

      //   useEffect(() => {
      //     const loadModelsAndStart = async () => {
      //       const MODEL_URL = '/models';
      //       try {
      //         await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      //         await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      //         await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

      //         const stream = await navigator.mediaDevices.getUserMedia({
      //           video: { facingMode }
      //         });

      //         if (videoRef.current) {
      //           videoRef.current.srcObject = stream;
      //           videoRef.current.play();
      //         }
      //       } catch (err) {
      //         console.error('Camera or model loading error:', err);
      //         alert('Camera not available.');
      //       }
      //     };

      //     loadModelsAndStart();

      //     return () => {
      //       if (videoRef.current?.srcObject) {
      //         videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      //       }
      //     };
      //   }, [facingMode]);

      //   return (
      //     <div className="flex flex-col items-center">
      //       <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-purple-500">
      //         <video
      //           ref={videoRef}
      //           autoPlay
      //           muted
      //           playsInline
      //           className="object-cover w-full h-full"
      //         />
      //       </div>
      //     </div>
      //   );
      // });

      // export default FaceRecognitionComponent;

      ///////////////////////////////////////////////////////////////////////////////////////////////





      // import { useRef, useEffect } from 'react';
      // import * as faceapi from 'face-api.js';
      // import { speakFunction } from '../utils/SpeakFunction'; 
      // const FaceRecognitionComponent = ({ onRecognized }) => {
      //   const videoRef = useRef(null);

      //   useEffect(() => {
      // const loadModelsAndStart = async () => {
      //   const MODEL_URL = '/models';
      //   try {
      //     await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      //     await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      //     await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

      //     const stream = await navigator.mediaDevices.getUserMedia({
      //       video: { facingMode: 'user' },  // 👈 Front camera
      //       audio: false
      //     });

      //     if (videoRef.current) {
      //       videoRef.current.srcObject = stream;
      //       videoRef.current.play();
      //     }
      //   } catch (error) {
      //     console.error('Error loading models or accessing webcam:', error);
      //     alert("Camera or model loading error. Check console.");
      //   }
      // };
          

      //     loadModelsAndStart();
      //   }, []);

      //   const handleDetect = async () => {
      //     if (!videoRef.current) return;

      //     const detections = await faceapi.detectAllFaces(
      //       videoRef.current,
      //       new faceapi.TinyFaceDetectorOptions()
      //     );

      //     if (detections.length > 0) {
      //       speakFunction("Face detected successfully")
      //       // alert("Face detected successfully.");


      //       onRecognized(); 
      //     } else {
            
      //       speakFunction("No Face detected")
      //       // alert("No face detected. Try again.");
      //     }
      //   };

      //   return (
      //     <div className="flex flex-col items-center">
      //       <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-purple-500">
      //         <video
      //           ref={videoRef}
      //           autoPlay
      //           muted
      //           playsInline
      //           width="192"
      //           height="192"
      //           className="object-cover w-full h-full"
      //         />
      //       </div>

      //       <button
      //         className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600"
      //         onClick={handleDetect}
      //       >
      //         Scan Face
      //       </button>
      //     </div>
      //   );
      // };

      // export default FaceRecognitionComponent;



