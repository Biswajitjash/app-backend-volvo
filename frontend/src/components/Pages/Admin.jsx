// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////2222

import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiMicrophoneOn } from 'react-icons/ci';
import { speakFunction } from '../../utils/SpeakFunction';
import { datacontext } from '../../context/UserContext';
import stringSimilarity from 'string-similarity';
import run from '../../gemini';
import LeaveRequest from '../Pages/LeaveRequest';

const routeMap = [
  { keywords: ['menu'], path: '/Menu' },
  { keywords: ['pr #2300', 'pr #', 'pr-', 'pr dash'], path: '/single-pr/' },
  { keywords: ['sight Beer', 'sidebear', 'side peer', 'site fear', 'site fair', 'site pair', 'site pr', 'site beer', 'side pier', 'site pier', 'site pier', 'track site pr', 'site pr tracking'], path: '/site-pr-tracking' },
  { keywords: ['rfq -', 'rfq', 'approval', 'approver status', 'rfq approval'], path: '/approver-status' },
  { keywords: ['po -', 'pu detail', 'po', 'po followup', 'follow up', 'po follow'], path: '/po-followup' },
  { keywords: ['create user', 'newid', 'register'], path: '/create_new_userid' },
  { keywords: ['sign in', 'login', 'relogin'], path: '/login' },
  { keywords: ['cancel'], path: '/cancel_login' },
  { keywords: ['/out','/nex','logout', 'exit', 'bye', 'quit', 'close'], path: '/goodbye' },
  { keywords: ['google', 'web', 'browse', 'online'], path: '/online' },
  { keywords: ['youtube', 'you tube'], path: '/youtube' },
  { keywords: ['mail', 'email', 'message'], path: '/email' },
  { keywords: ['whatsapp', 'whtsapp'], path: '/whatsapp' },
  { keywords: ['Thats bored','dashboard', 'status', 'update', 'report', 'back'], path: '/dashboard' },
  { keywords: ['leb request', 'lib request', 'leave request', 'leave application'], path: '/leaverequest' },
  { keywords: ['vendor retrun'], path: '/vendorreturn' },
  { keywords: ['compare pr'], path: '/Compare' },
  { keywords: ['utilities','utility','api'], path: '/utilities' },
];

const Admin = () => {
  const [query, setQuery] = useState('AI-Prompt :');
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  const openedTabs = useRef([]);

  const {
    recognition,
    speaking,
    setSpeaking,
    setPrompt,
    setResponse,
  } = useContext(datacontext);

  // 🔒 Inactivity Auto-Logout Logic
  // const idleTimeoutRef = useRef(null);
  // const IDLE_TIMEOUT = 2 * 60 * 1000; // 2 minutes

  // const handleAutoLogout = useCallback(() => {
  //   console.warn('User idle for 2 minutes. Auto-logging out...');
  //   localStorage.clear();
  //   navigate('/login');
  // }, [navigate]);


  // const resetIdleTimer = useCallback(() => {
  //   if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
  //   idleTimeoutRef.current = setTimeout(handleAutoLogout, IDLE_TIMEOUT);
  // }, [handleAutoLogout]);


  // useEffect(() => {
  //   const activityEvents = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'];
  //   activityEvents.forEach((event) => {
  //     window.addEventListener(event, resetIdleTimer);
  //   });

  //   resetIdleTimer();

  //   return () => {
  //     activityEvents.forEach((event) => {
  //       window.removeEventListener(event, resetIdleTimer);
  //     });
  //     if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
  //   };
  // }, [resetIdleTimer]);



  // 🎙️ Voice Recognition
  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setTimeout(() => {
        startConversation(transcript);
      }, 200);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      speakFunction('Sorry, I could not understand that.');
    };

    recognition.onend = () => {
      setSpeaking(false);
      setPrompt('');
    };
  }, [recognition]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('Login') === 'true';
    const storedUname = localStorage.getItem('Uname');
    setUsername(storedUname?.charAt(0).toUpperCase() + storedUname?.slice(1).toLowerCase());

    if (!isLoggedIn) navigate('/login');
    textareaRef.current?.focus();
  }, [navigate]);

  const fuzzyScore = (input, keywords) => {
    return keywords.reduce((total, keyword) => {
      const score = stringSimilarity.compareTwoStrings(input, keyword);
      return total + (score > 0.7 ? score : 0);
    }, 0);
  };

  const startConversation = async (inputQuery = query) => {
    const lowerQuery = inputQuery.toLowerCase().trim();
    if (!lowerQuery) return;

    const prMatch = lowerQuery.match(/^pr-(\d{5,})$/);
    const poMatch = lowerQuery.match(/^po-(\d{5,})$/);
    const rfqMatch = lowerQuery.match(/^rfq-(\d{5,})$/);
    const compareprMatch = lowerQuery.match(/compare pr\s*(\d{10})/i);

    const promptVariants = ['ai-prompt', 'prompt', 'aiprompt'];

    if (promptVariants.some(variant => lowerQuery.includes(variant))) {
      await askGemini(lowerQuery);
      return;
    }

    if (compareprMatch) {
      const prTab = window.open(`${window.location.origin}/prcompare`);
      if (prTab) openedTabs.current.push(prTab);
      return;
    }

    if (prMatch) {
      const prNumber = prMatch[1];
      speakFunction(`Opening Site PR number ${prNumber}`);
      const prTab = window.open(`${window.location.origin}/single-pr/${prNumber}`);
      if (prTab) openedTabs.current.push(prTab);
      return;
    }

    if (poMatch) {
      const poNumber = poMatch[1];
      speakFunction(`Opening detail of PO ${poNumber}`);
      const poTab = window.open(`${window.location.origin}/single-po/${poNumber}`);
      if (poTab) openedTabs.current.push(poTab);
      return;
    }

    if (rfqMatch) {
      const rfqNumber = rfqMatch[1];
      speakFunction(`Opening RFQ detail of ${rfqNumber}`);
      const rfqTab = window.open(`${window.location.origin}/single-rfq/${rfqNumber}`);
      if (rfqTab) openedTabs.current.push(rfqTab);
      return;
    }

    setLoading(true);

    const matchedRoute = routeMap
      .map(route => {
        const exact = route.keywords.filter(k => lowerQuery.includes(k)).length;
        const fuzzy = fuzzyScore(lowerQuery, route.keywords);
        return exact + fuzzy > .5 ? { ...route, score: exact + fuzzy } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)[0];

    if (matchedRoute) {
      const path = matchedRoute.path;
      handleNavigation(path);
    }
  };

  const handleNavigation = (path) => {
    setLoading(false);

    switch (true) {
      case path === '/online':
        window.open('https://www.google.com', '_blank');
        break;
      case path === '/youtube':
        window.open('https://www.youtube.com/', '_blank');
        break;
      case path === '/whatsapp':
        window.open('https://www.whatsapp.com/', '_blank');
        break;
      case path === '/email':
        window.open('https://webmail.ampl.in/', '_blank');
        break;
      case path === '/leaverequest':
        navigate("/leaverequest");
        break;
      case path === '/goodbye':
        speakFunction('Goodbye. Closing all sessions...');
        openedTabs.current.forEach(tab => tab?.close());
        setTimeout(() => window.location.href = '/goodbye', 1500);
        break;
      default:
        const newTab = window.open(`${window.location.origin}${path}`, '_blank');
        if (newTab) openedTabs.current.push(newTab);
        break;
    }

    speakFunction(`Opening ${path.replaceAll('/', ' ')}`);
  };

  const askGemini = async (userInput) => {
    const result = await run(userInput);
    let cleaned = result[0]
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/\[/g, "")
      .replace(/\]/g, "")
      .replace(/\"/g, "");
    setResponseText(cleaned);
    speakFunction(cleaned);
    setLoading(false);
  };

  const handleDownload = () => {
    const blob = new Blob([responseText], { type: 'text/plain;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'response.txt';
    a.click();
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="p-4 max-w-4xl mt-6 rounded-2xl mx-auto text-center shadow-[0_0_25px_15px_rgba(0,255,0,0.5)] border">
      <div className="flex gap-5">
        <img src="/virtualAssistant.jpg" alt="Assistant" className=" flip-animationY w-25 h-20 mb-2" />
        <h1 className="text-2xl font-bold mb-4 color-change animate-pulse">
          Hi {username}, I am your virtual assistant
        </h1>

        <textarea
          ref={textareaRef}
          className="w-full border bg-purple-50 p-2 mb-4 rounded-2xl text-blue-500 text-bold"
          placeholder="Type or speak: 'pr-2300000675', 'site pr', 'rfq approval'..."
          rows={3}
          value={query}
          onChange={(e) => setQuery(e.target.value)} />
        <div className="flex flex-col items-center gap-3 mb-4">
          <button
            onClick={() => startConversation()}
            className="bg-green-200 border border-blue-500 text-blue-600 hover:bg-blue-100/20 px-4 py-2 text-sm rounded-lg shadow transition duration-300"
          >
            {loading ? 'Thinking...' : 'Submit'}
          </button>

          <button
            onClick={() => {
              if (!recognition) {
                alert('Speech recognition not supported');
                return;
              }

              setPrompt('listening...');
              setSpeaking(true);
              setLoading(false);
              setResponse(false);
              recognition.start();
            }}
            className="w-7 h-10 text-center rounded-full border border-red-400 hover:bg-yellow-300 shadow"
          >
            <CiMicrophoneOn className="inline-block ml-1" />
          </button>
        </div>
      </div>

      <textarea
        className="w-full border p-4 mb-4 mt-5 rounded-2xl text-lg text-white bg-black"
        placeholder="Response will appear here..."
        rows={13}
        value={responseText}
        readOnly
      />

      {responseText && (
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Download Response
        </button>
      )}
    </div>
  );
};

export default Admin;






















// import React, { useContext, useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { CiMicrophoneOn } from 'react-icons/ci';
// import { speakFunction } from '../../utils/SpeakFunction';
// import { datacontext } from '../../context/UserContext';
// import stringSimilarity from 'string-similarity';
// import run from '../../gemini';
// import LeaveRequest from '../Pages/LeaveRequest';

// const routeMap = [
//   { keywords: ['menu'], path: '/Menu' },
//   { keywords: ['pr #2300', 'pr #', 'pr-', 'pr dash'], path: '/single-pr/' },
//   { keywords: ['sight Beer', 'sidebear', 'side peer', 'site fear', 'site fair', 'site pair', 'site pr', 'site beer', 'side pier', 'site pier', 'site pier', 'track site pr', 'site pr tracking'], path: '/site-pr-tracking' },
//   { keywords: ['rfq -', 'rfq', 'approval', 'approver status', 'rfq approval'], path: '/approver-status' },
//   { keywords: ['po -', 'pu detail', 'po', 'po followup', 'follow up', 'po follow'], path: '/po-followup' },
//   { keywords: ['create user', 'newid', 'register'], path: '/create_new_userid' },
//   { keywords: ['sign in', 'login', 'relogin'], path: '/login' },
//   { keywords: ['cancel'], path: '/cancel_login' },
//   { keywords: ['/out','/nex','logout', 'exit', 'bye', 'quit', 'close'], path: '/goodbye' },
//   { keywords: ['google', 'web', 'browse', 'online'], path: '/online' },
//   { keywords: ['youtube', 'you tube'], path: '/youtube' },
//   { keywords: ['mail', 'email', 'message'], path: '/email' },
//   { keywords: ['whatsapp', 'whtsapp',], path: '/whatsapp' },
//   { keywords: ['Thats bored','dashboard', 'status', 'update', 'report', 'back'], path: '/dashboard' },
//   { keywords: ['leb request', 'lib request', 'leave request', 'leave application'], path: '/leaverequest' },
//   { keywords: ['vendor retrun'], path: '/vendorreturn' },
//   { keywords: ['compare pr'], path: '/Compare' },
//   { keywords: ['utilities','utility','api'], path: '/utilities' },
// ];


// const Admin = () => {
//   const [query, setQuery] = useState('AI-Prompt :');
//   const [responseText, setResponseText] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [username, setUsername] = useState('');
//   const navigate = useNavigate();
//   const textareaRef = useRef(null);
//   const openedTabs = useRef([]);

//   const {
//     recognition,
//     speaking,
//     setSpeaking,
//     setPrompt,
//     setResponse,
//   } = useContext(datacontext);

//   useEffect(() => {
//     if (!recognition) return;

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       setQuery(transcript);
//       setTimeout(() => {
//         startConversation(transcript);
//       }, 200);
//     };

//     recognition.onerror = (event) => {
//       console.error('Speech recognition error:', event.error);
//       speakFunction('Sorry, I could not understand that.');
//     };

//     recognition.onend = () => {
//       setSpeaking(false);
//       setPrompt('');
//     };
//   }, [recognition]);

//   useEffect(() => {
//     const isLoggedIn = localStorage.getItem('Login') === 'true';
//     const storedUname = localStorage.getItem('Uname');
//     setUsername(storedUname?.charAt(0).toUpperCase() + storedUname?.slice(1).toLowerCase());

//     if (!isLoggedIn) navigate('/login');
//     textareaRef.current?.focus();
//   }, [navigate]);

//   const fuzzyScore = (input, keywords) => {
//     return keywords.reduce((total, keyword) => {
//       const score = stringSimilarity.compareTwoStrings(input, keyword);
//       return total + (score > 0.7 ? score : 0);
//     }, 0);
//   };

//   const startConversation = async (inputQuery = query) => {

//     const lowerQuery = inputQuery.toLowerCase().trim();   
//     if (!lowerQuery) return;
//   // alert(lowerQuery);

//     const prMatch = lowerQuery.match(/^pr-(\d{5,})$/);
//     const poMatch = lowerQuery.match(/^po-(\d{5,})$/);
//     const rfqMatch = lowerQuery.match(/^rfq-(\d{5,})$/);
//     const compareprMatch = lowerQuery.match(/compare pr\s*(\d{10})/i);

 
// const promptVariants = ['ai-prompt', 'prompt', 'aiprompt'];

// if (promptVariants.some(variant => lowerQuery.includes(variant))) {
//   // alert('in prompt');
//   await askGemini(lowerQuery);
//   return;
// } else {
//   // alert('i am not act as prompt');
// }


//     if (compareprMatch  )  {
//       const prTab = window.open(`${window.location.origin}/prcompare`);
//       if (prTab) openedTabs.current.push(prTab);
//       return;
//     }

//     if (prMatch ) {
//       const prNumber = prMatch[1];
//       speakFunction(`Opening Site PR number ${prNumber}`);
//       const prTab = window.open(`${window.location.origin}/single-pr/${prNumber}`);
//       if (prTab) openedTabs.current.push(prTab);
//       return;
//     }

//     if (poMatch ) {
//       const poNumber = poMatch[1];
//       speakFunction(`Opening detail of PO ${poNumber}`);
//       const poTab = window.open(`${window.location.origin}/single-po/${poNumber}`);
//       if (poTab) openedTabs.current.push(poTab);
//       return;
//     }

//     if (rfqMatch ) {
//       const rfqNumber = rqfMatch[1];
//       speakFunction(`Opening RFQ detail of ${rfqNumber}`);
//       const rfqTab = window.open(`${window.location.origin}/single-rfq/${rfqNumber}`);
//       if (rfqTab) openedTabs.current.push(rfqTab);
//       return;
//     }

//     setLoading(true);

//     const matchedRoute = routeMap
//       .map(route => {
//         const exact = route.keywords.filter(k => lowerQuery.includes(k)).length;
//         const fuzzy = fuzzyScore(lowerQuery, route.keywords);
//         return exact + fuzzy > .5 ? { ...route, score: exact + fuzzy } : null;
//       })
//       .filter(Boolean)
//       .sort((a, b) => b.score - a.score)[0];

//     if (matchedRoute ) {
//       const path = matchedRoute.path;
//       // alert(`matchroute ${path}`);
//       handleNavigation(path);
//     } 
    
//     else {
//     // alert(`not match ${lowerQuery}`);
//       // await askGemini(lowerQuery);
//     }

//   };

//   const handleNavigation = (path) => {
//     setLoading(false);

//     switch (true) {
//       case path === '/online':
//         window.open('https://www.google.com', '_blank');
//         break;
//       case path === '/youtube':
//         window.open('https://www.youtube.com/', '_blank');
//         break;
//       case path === '/whatsapp':
//         window.open('https://www.whatsapp.com/', '_blank');
//         break;
//       case path === '/email':
//         window.open('https://webmail.ampl.in/', '_blank');
//         break;

//       case path === '/leaverequest':
//         navigate("/leaverequest");
//         break;

//       case path === '/goodbye':
//         speakFunction('Goodbye. Closing all sessions...');
//         openedTabs.current.forEach(tab => tab?.close());
//         setTimeout(() => window.location.href = '/goodbye', 1500);
//         break;

//       default:
//         const newTab = window.open(`${window.location.origin}${path}`, '_blank');
//         if (newTab) openedTabs.current.push(newTab);
//         break;
//     }

//     speakFunction(`Opening ${path.replaceAll('/', ' ')}`);
//   };

//   const askGemini = async (userInput) => {

//     // alert(userInput);

//     const result = await run(userInput);


//     let cleaned = result[0]
//       .replace(/\*\*/g, "")
//       .replace(/\*/g, "")
//       .replace(/\[/g, "")
//       .replace(/\]/g, "")
//       .replace(/\"/g, "");
//       // .replace(/google/gi, "Biswajit Jash")
//       // .replace(/yourname|your name/gi, "Biswajit Jash");

//     setResponseText(cleaned);
//     // alert(`alert stetext${responseText}`);

//     speakFunction(cleaned);
//     setLoading(false);

//   };

//   const handleDownload = () => {
//     const blob = new Blob([responseText], { type: 'text/plain;charset=utf-8' });
//     const downloadUrl = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = downloadUrl;
//     a.download = 'response.txt';
//     a.click();
//     URL.revokeObjectURL(downloadUrl);
//   };




//   return (
//     <div className="p-4 max-w-4xl mt-6 rounded-2xl mx-auto text-center 
//     shadow-[0_0_25px_15px_rgba(0,255,0,0.5)] border">
//       <div className="flex gap-5">
//         <img src="/virtualAssistant.jpg" alt="Assistant" className=" flip-animationY w-25 h-20 mb-2" />
//         <h1 className="text-2xl font-bold mb-4  color-change animate-pulse">
//           Hi {username}, I am your virtual assistant
//         </h1>

//         <textarea
//           ref={textareaRef}
//           className="w-full border bg-purple-50 p-2 mb-4  rounded-2xl text-blue-500 text-bold"
//           placeholder="Type or speak: 'pr-2300000675', 'site pr', 'rfq approval'..."
//           rows={3}
//           value={query}
//           onChange={(e) => setQuery(e.target.value)} />
//         <div className="flex flex-col items-center gap-3 mb-4">
//           <button
//             onClick={() => startConversation()}
//             className="bg-green-200 border border-blue-500 text-blue-600 hover:bg-blue-100/20 px-4 py-2 text-sm rounded-lg shadow transition duration-300"
//             // disabled={loading}
//           >
//             {loading ? 'Thinking...' : 'Submit'}
//           </button>

//           <button
//             onClick={() => {
              
//               if (!recognition) {
//                 alert('Speech recognition not supported');
//                 return;
//               }

//               setPrompt('listening...');
//               setSpeaking(true);
//               setLoading(false);
//               setResponse(false);
//               recognition.start();
//             }}
//             className="w-7 h-10 text-center rounded-full border border-red-400 
//             hover:bg-yellow-300    shadow"
//           >
//             <CiMicrophoneOn className="inline-block ml-1" />
//           </button>
//         </div>


//       </div>

//       <textarea
//         className="w-full border  p-4  mb-4 mt-5 rounded-2xl text-lg text-white bg-black  "
//         placeholder="Response will appear here..."
//         rows={13}
//         value={responseText}
//         readOnly
//       />

//       {responseText && (
//         <button
//           onClick={handleDownload}
//           className="bg-green-600 text-white px-4 py-2 rounded"
//         >
//           Download Response
//         </button>
//       )}
//     </div>
//   );
// };

// export default Admin;
