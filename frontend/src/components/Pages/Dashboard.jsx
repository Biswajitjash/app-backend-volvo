import React from "react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import FloatingCards from "./FloatingCard";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router";
import { speakFunction } from '../../utils/SpeakFunction';
import { useParams } from 'react-router-dom';
import DualPieCharts from "./DualPieCharts ";


const summaryData = [
  {
    title: "Open details PRs",
    value: 120,
    type: {
      Normal: 55,
      Breakdown: 25,
      Urgent: 40
    },
    color: "bg-blue-500",
    url: "/site-pr-tracking"
  },
  {
    title: "Pending RFQs",
    value: 48,
    type: {
      Normal: 20,
      Breakdown: 15,
      Urgent: 13
    },
    color: "bg-green-500",
    url: "/approver-status"
  },
  {
    title: "Pending POs",
    value: 76,
    type: {
      Normal: 30,
      Breakdown: 26,
      Urgent: 20
    },
    color: "bg-yellow-500",
    url: "/po-followup"
  },
  {
    title: "Open MOs",
    value: 22,
    type: {
      Normal: 8,
      Breakdown: 6,
      Urgent: 8
    },
    color: "bg-purple-500"
  }
];


const summaryData2 = [
  {
    title: "Open MOs",
    value: 22,
    type: {
      Normal: 8,
      Breakdown: 6,
      Urgent: 8
    },
    color: "bg-purple-500"
  },
  {
    title: "Pending POs",
    value: 76,
    type: {
      Normal: 30,
      Breakdown: 26,
      Urgent: 20
    },
    color: "bg-yellow-500",
    url: "/po-followup"
  },
  {
    title: "Pending RFQs",
    value: 48,
    type: {
      Normal: 20,
      Breakdown: 15,
      Urgent: 13
    },
    color: "bg-green-500",
    url: "/approver-status"
  },
  {
    title: "Open details PRs",
    value: 120,
    type: {
      Normal: 55,
      Breakdown: 25,
      Urgent: 40
    },
    color: "bg-blue-500",
    url: "/site-pr-tracking"
  },

];

const pieMMData = [
  { name: "Users", value: 1280, color: "#3b82f6" },    // blue-500
  { name: "POs", value: 348, color: "#22c55e" },       // green-500
  { name: "PRs", value: 76, color: "#eab308" },        // yellow-500
  { name: "RFQs", value: 42, color: "#a855f7" },       // purple-500
];

const piePMData = [
  { name: "SMO", value: 128, color: "#3b82f6" },    // blue-500
  { name: "BMO", value: 348, color: "#22c55e" },       // green-500
  { name: "EMO", value: 76, color: "#eab308" },        // yellow-500
  { name: "PMO", value: 420, color: "#a855f7" },       // purple-500
];

const barWData = [
  { name: "Mon", POs: 12, PRs: 8 },
  { name: "Tue", POs: 10, PRs: 6 },
  { name: "Wec", POs: 8, PRs: 10 },
  { name: "Thi", POs: 28, PRs: 5 },
  { name: "Fri", POs: 7, PRs: 11 },
  { name: "Sat", POs: 9, PRs: 8 },
];
const barMData = [
  { name: "Jan", POs: 120, PRs: 80 },
  { name: "Feb", POs: 150, PRs: 60 },
  { name: "Mar", POs: 200, PRs: 100 },
  { name: "Apr", POs: 180, PRs: 90 },
  { name: "May", POs: 170, PRs: 80 },
  { name: "Jun", POs: 210, PRs: 110 },
];

const barYData = [
  { name: "2022", POs: 10000, PRs: 600 },
  { name: "2023", POs: 18000, PRs: 1000 },
  { name: "2024", POs: 25000, PRs: 1800 },
];

const activity = [
  "RFQ-3100015045 approved bY Nilesh  ",
  "pr-2300000675 raised by  3106",
  "RFQ-3100012024 sent to  Suchita Mellenium.",
  "PO-4500000690 raised by Nilesh for Castrol",
  "pr-2300000678 raised by  3106",
  "New UserID 'Subrata' Created",
  "pr-2300000679 raised by  3105",
  "PO-4500000691 raised by Kaushal for Volvo",
  "pr-2300000680 raised by  3107",
  "pr-2300000690 raised by  3107",
  "RFQ-3100007819 for Vendor Castrol responded ",
  "PO-4500000692 raised by Kaushal",
  "pr-2300000692 raised by  3103",
];


const activity2 = [
  "New UserID 'Subrata' Created",
  "pr-2300000679 raised by  3105",
  "pr-2300000690 raised by  3107",
  "RFQ-3100007819 for Vendor Castrol responded ",
  "PO-4500000692 raised by Kaushal",
  "pr-2300000692 raised by  3103",
  "RFQ-3100015045 approved bY Nilesh  ",
  "PO-4500000691 raised by Kaushal for Volvo",
  "pr-2300000680 raised by  3107",
  "pr-2300000675 raised by  3106",
  "RFQ-3100012024 sent to  Suchita Mellenium.",
  "PO-4500000690 raised by Nilesh for Castrol",
  "pr-2300000678 raised by  3106",
];

const Dashboard = () => {

  const { floatQuery } = useParams();
  const [username, setUsername] = useState(localStorage.getItem("Uname"));
  const [userid, setUserid] = useState(localStorage.getItem("userid"));

  const [activeIndex, setActiveIndex] = useState(0);
  const [loadcard, setLoadcard] = useState(1);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const openedTabs = useRef([]);
  const [selectedPMData, setSelectedPMData] = useState(null);
  const [selectedMMData, setSelectedMMData] = useState(null);


  const onAIAssist = () => {
    navigate("/Admin"); // navigate to '/Admin' route
  };

  useEffect(() => {
    const interval = setInterval(() => {

      setLoadcard((prev) => (prev === 1 ? 2 : 1));

      setActiveIndex((prev) => (prev + 1) % activity.length);
    }, 13000); // every 3 seconds

    return () => clearInterval(interval);
  }, []);


  const onclickactivity = () => {
    window.speechSynthesis.cancel();
    const fullText = activity[activeIndex];
    const query = fullText.split(" ")[0]; // Get first part before space
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return;


    if (lowerQuery.includes('pr')) {
      const prNo = lowerQuery.split("pr-")[1]; // Get first part before space

      speakFunction(`Opening Site PR detail for PR number ${prNo}`);
      // alert(prNo)
      const prTab = window.open(`${window.location.origin}/single-pr/${prNo}`);
      if (prTab) openedTabs.current.push(prTab);
      return;
    }
  };

  const onclickactivity2 = () => {
    window.speechSynthesis.cancel();
    const fullText2 = activity2[activeIndex];
    const query2 = fullText2.split(" ")[0]; // Get first part before space
    const lowerQuery2 = query2.toLowerCase().trim();
    if (!lowerQuery2) return;


    if (lowerQuery2.includes('pr')) {
      const prNo2 = lowerQuery2.split("pr-")[1]; // Get first part before space

      speakFunction(`Opening Site PR detail for PR number ${prNo2}`);
      const prTab = window.open(`${window.location.origin}/single-pr/${prNo2}`);
      if (prTab) openedTabs.current.push(prTab);
      return;
    }
  };



  const handlePieMMClick = (entry, index) => {
    alert(`Order Type: ${entry.name}, Value: ${entry.value}`);
    setSelectedMMData(entry);
    setSelectedPMData(null); // Close modal


  };

  const handlePiePMClick = (entry, index) => {
    setSelectedPMData(entry);
    setSelectedMMData(null); // Close modal
  };

  const handleClose = () => {
    setSelectedPMData(null); // Close modal
    setSelectedMMData(null); // Close modal
  };



  return (
    <div
      className="p-1 space-y-1 bg-gradient-to-tr from-slate-100 via-white to-slate-200 min-h-screen"
      style={{ backgroundImage: "url('/virtualAssistant2.jpg')" }} >

      <div
        className="flex shadow-[0_0_25px_15px_rgba(255,255,0,0.8)] rounded-xl 
      bg-gradient-to-r from-yellow-200 via-green-200 to-purple-400 justify-between ">
        <h1 className="text-3xl font-bold text-center text-white mb-1">
          🔍 Business Insights
        </h1>

        <div className="relative  group inline-block">
          <button
            onClick={onAIAssist}
            className="w-20 h-8 shadow-[0_0_25px_15px_rgba(255,255,0,0.5)] rounded-full bg-cover bg-center shadow  border border-white 
             transition-transform duration-300 ease-in-out transform group-hover:scale-150 
              flip-on-hover"
            style={{ backgroundImage: "url('/virtualAssistant.jpg')" }}
          >
          </button>

          {/* Tooltip INSIDE the group */}
          <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-max px-2 py-1 
                  text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300 pointer-events-none z-10">
            Virtual Mode
          </div>
        </div>



      </div>


      {/* Summary Cards */}


      {loadcard === 1 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 relative z-0 
                      overflow-visible flip-animationY flip-on-hover">
          {summaryData.map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.2 }}
              onClick={() => card.url && window.open(`${window.location.origin}${card.url}`, '_blank')}
              className={`p-4 rounded-xl shadow-lg text-white cursor-pointer ${card.color}`}
            >
              <div className="flex gap-5 ">
                <h2 className="text-lg font-semibold">{card.title}</h2>
                <h2 className="text-lg animate-pulse font-semibold">{card.value}</h2>
              </div>
              <div className="mt-3 space-y-1 text-sm">

                {Object.entries(card.type).map(([key, val]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize">{key}:</span>
                    <span>{val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : loadcard === 2 ? (


        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 relative z-0 
                 overflow-visible flip-animationY flip-on-hover">
          {summaryData2.map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.2 }}
              onClick={() => card.url && window.open(`${window.location.origin}${card.url}`, '_blank')}
              className={`p-4 rounded-xl shadow-lg text-white cursor-pointer ${card.color}`}
            >
              <div className="flex gap-5 ">
                <h2 className="text-lg font-semibold">{card.title}</h2>
                <h2 className="text-lg animate-pulse font-semibold">{card.value}</h2>
              </div>
              <div className="mt-3 space-y-1 text-sm">

                {Object.entries(card.type).map(([key, val]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize">{key}:</span>
                    <span>{val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (

        <FloatingCards summaryData={summaryData} />
      )
      }

      <div className="p-1  bg-yellow-300" />

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">



        <div className="px-3 ">
          {/* Other components */}
          <DualPieCharts pieMMData={pieMMData} piePMData={piePMData} />
        </div>














        {/* Bar Chart */}
        <div className=" rounded-2xl shadow-[0_0_25px_15px_rgba(255,255,0,0.8)] shadow 
        transition-transform duration-300 hover:scale-[1.3] hover:bg-black origin-bottom-right
        text-center flip-animationY2  flip-on-hover">

          <div className="bg-green-400   shadow 
          rounded-xl  p-4 flip-on-hover ">
            <div className="flex justify-between gap-10">
              <h2 className="text-lg text-blue-500 font-bold mb-2">Weekly Activity</h2>
              <h2 className="text-lg text-red-500 font-bold mb-2">Monthly Activity</h2>
              <h2 className="text-lg text-green -500 font-bold mb-2">Yearly Activity</h2>
            </div>

            <div className="flex shadow-[0_0_25px_15px_rgba(255,255,255,0.5)] shadow rounded-2xl  ">

              {/* Weekly Bar Chart */}

              <ResponsiveContainer width="33%" height={250}>
                <BarChart data={barWData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="POs" fill="rgba(247, 191, 7, 1)" />
                  <Bar dataKey="PRs" fill="#eaee10ff" />
                </BarChart>
              </ResponsiveContainer>

              {/* Monthly Bar Chart */}
              <ResponsiveContainer width="33%" height={250}>
                <BarChart data={barMData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="POs" fill="#8c24ecff" />
                  <Bar dataKey="PRs" fill="#d33c0dff" />
                </BarChart>
              </ResponsiveContainer>

              {/* Yearly Bar Chart */}
              <ResponsiveContainer width="33%" height={250}>
                <BarChart data={barYData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="POs" fill="#dbdf0aff" />
                  <Bar dataKey="PRs" fill="#1013d8ff" />
                </BarChart>
              </ResponsiveContainer>

            </div>
          </div>
        </div>

      </div>



      <div className="shadow  mt-1   overflow-hidden h-13  relative ">
        {/* <div className="flex relative overflow-hidden"> */}
        <div >
          <div className="flex ">
            <h1 className="text-yellow-400 font-bold mb-1">Recent Activity</h1>

            <motion.div
              key={activeIndex} // so it re-triggers on index change
              initial={{ x: "10%" }}
              animate={!isHovered ? { x: "500%" } : false} // stop animation when hovered
              transition={{ duration: 15, ease: "linear" }}
              className=" whitespace-nowrap  text-yellow-400 text-xl font-medium "
              onClick={() => onclickactivity(activity[activeIndex])}
              onChange={speakFunction(activity[activeIndex])}
            >
              👉 {activity[activeIndex]}
            </motion.div>

          </div>
          <div className="flex">
            {/* <h1 className="text-red-400 font-bold mb-1">Recent Activity</h1> */}

            <motion.div
              key={activeIndex} // so it re-triggers on index change
              initial={{ x: "3%" }}
              animate={!isHovered ? { x: "500%" } : false} // stop animation when hovered
              transition={{ duration: 10, ease: "linear" }}
              className=" whitespace-nowrap  text-white text-xl font-medium "
              onClick={() => onclickactivity2(activity2[activeIndex])}
              onChange={speakFunction(activity2[activeIndex])}
            >
              👉 {activity2[activeIndex]}
            </motion.div>

          </div>

        </div>
        {/* </div> */}
      </div>

      {/* <div className="p-1  bg-green-500" />  */}

      <div className="flex shadow-[0_0_25px_6px_rgba(255,105,180,0.8)] shadow flex-wrap gap-10 p-1 ">
        <button className="text-xs px-10 py-0 border border-gray-400 text-white rounded-full hover:bg-gray-100 transition">Simple</button>

        {/* 2. Gradient border */}
        <button className="text-xs px-10 py-1 border border-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-full hover:opacity-80 transition">Gradient</button>

        {/* 3. Outline + shadow */}
        <button className="text-xs px-10 py-1 border border-blue-400 text-blue-400 rounded shadow-sm hover:shadow-md hover:bg-blue-50 transition">Shadow</button>

        {/* 4. Icon-style circle */}
        <button className="w-10 h-10 rounded-full border border-green-400 text-green-400 hover:bg-green-100 transition">+</button>

        {/* 5. Ghost with hover fill */}
        <button className="text-xs px-10 py-1 text-purple-500 border border-purple-500 rounded-full hover:bg-purple-50 transition">Ghost</button>

        {/* 6. Thin transparent */}
        <button className="text-xs px-10 py-1 bg-white/10 text-white border border-white/30 rounded hover:bg-white/20 transition">Minimal</button>

        {/* 7. Frosted glass */}
        <button className="text-xs px-3 py-1 backdrop-blur-sm bg-white/10 border border-white/30 text-white rounded hover:bg-white/20 transition">Glass</button>

        {/* 8. Neon glow */}
        <button className="text-xs px-10 py-1 border border-cyan-400 text-cyan-400 rounded hover:shadow-cyan-400 hover:shadow-md transition">Neon</button>

        {/* 9. Dot button (indicator style) */}
        <button className="w-10 h-10 rounded-full border-2 border-red-500 hover:bg-red-100 transition"></button>

        {/* 10. Pill button */}
        <button className="text-xs px-10 py-1 border border-amber-500 text-amber-500 rounded-full hover:bg-amber-50 transition">Pill</button>
      </div>

    </div>
  );
};

export default Dashboard;
