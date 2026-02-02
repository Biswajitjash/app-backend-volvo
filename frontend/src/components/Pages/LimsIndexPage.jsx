import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import "./indexpage.css";
// import { useNavigate } from "react-router-dom";
import skywiseLogo from "../../assets/skywiselogo.png";
import osArchitecture from "../../documents/os-architecture.png";
// import workDiagam from "../../../public/work-flow.pdf";

import userManual from "../../../public/user-manual.pdf";

const indexItems = [
  { id: 1, title: "Architecture", desc: "System architecture and integrations for APP" },
  { id: 2, title: "Workflow", desc: "End-to-end operational workflow" },
  { id: 3, title: "User Manual", desc: "APP Operational manual" },
];



const LimsIndexPage = () => {

  const navigate = useNavigate();

const [showArch, setShowArch] = useState(false);
const [showWorkflow, setShowWorkflow] = useState(false);
const [showUserManual, setShowUserManual] = useState(false);

//  const navigate = useNavigate();

  const handleCardClick = (title) => {
    // alert(`You clicked on "${title}" API.\n\nPopup for now – routing will be implemented later.`);
    
    if (title === "Architecture") {
      showArchitecture();
    }

    if (title === "Workflow") {
      showWorkflowfn ();
    }

   if (title === "User Manual") {
      showUserManualfn ();
    }

  };


    const showArchitecture = () => {
       setShowArch(true);
      // alert("Architecture details will be shown here.");
    };

    const showWorkflowfn = () => {
      setShowWorkflow(true);
      // alert("Workflow details will be shown here.");
    };

    const showUserManualfn = () => {
      setShowUserManual(true);
      // alert("User Manual details will be shown here.");
    };

 return (
    <div className="container">
      
      {/* Header Section */}
      <header className="header">
        <img
          src={skywiseLogo}
          alt="Skywise Technologies Logo"
          className="logo"
        />
        <h1>LIMS</h1>
        <p className="subtitle">
          Laboratory Information Management System
        </p>
      </header>

      {/* Index Section */}
      <section className="index">
        <h2>Index</h2>
        <ul>
          {indexItems.map((item) => (
            <li key={item.id}>
              <span className="index-no">{item.id}.</span>
              <div className="index-content"  onClick={() => handleCardClick(item.title)}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

{showArch && (
  <div className="arch-modal">
    <div className="arch-content">
 <button className="back-btn-top-left" onClick={() => setShowArch(false)}>
  ← Back
</button>
      <h2>System Architecture</h2>
      <img
        src={osArchitecture}
        alt="OS Architecture Diagram"
        className="arch-image"
      />
       <button className="back-btn-bottom-right" onClick={() => setShowArch(false)}>
  ← Back
</button>

    </div>
  </div>
)}



{showWorkflow && (
  <div className="arch-modal">

    <div className="arch-content">

      <button
        className="back-btn-top-left"
        onClick={() => setShowWorkflow(false)}
      >
        ← Back
      </button>

      <h2>Work Flow</h2>

   <iframe
    src="/work-flow.pdf"
    title="Work Flow"
    className="pdf-viewer"
    allowFullScreen
  />

      {/* <iframe
        src="/work-flow.pdf#toolbar=0"
        title="Work Flow"
        className="pdf-viewer"  
        allow="fullscreen"
        allowFullScreen

      /> */}

{/* <a
  href="/work-flow.pdf"
  target="_blank"
  rel="noopener noreferrer"
  className="open-pdf-btn"
>
  Open User Manual (Fullscreen)
</a> */}


      {/* <button
        className="back-btn-bottom-right"
        onClick={() => setShowWorkflow(false)}
      >
        ← Back
      </button> */}

    </div>
  </div>
)}



{showUserManual && (
  <div className="arch-modal">
    <div className="arch-content">

      <button
        className="back-btn-top-left"
        onClick={() => setShowUserManual(false)}
      >
        ← Back
      </button>

      <h2>User Manual</h2>

      <iframe
        src="/user-manual.pdf"
        title="User Manual"
        className="pdf-viewer"
        allow="fullscreen"
        allowFullScreen
      />

      <button
        className="back-btn-bottom-right"
        onClick={() => setShowUserManual(false)}
      >
        ← Back
      </button>

    </div>
  </div>
)}






    </div>
  );
};

export default LimsIndexPage;
