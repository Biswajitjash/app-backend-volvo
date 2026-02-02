import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import MmPieCard from "./MmPieCard";
import PmPieCard from "./PmPieCard";

const DualPieCharts = ({ pieMMData, piePMData }) => {
  const [selectedMMData, setSelectedMMData] = useState(null);
  const [selectedPMData, setSelectedPMData] = useState(null);
  const [showMMChart, setShowMMChart] = useState(false);
  const [showPMChart, setShowPMChart] = useState(false);

  useEffect(() => {
    const mmTimer = setTimeout(() => setShowMMChart(true), 100);
    const pmTimer = setTimeout(() => setShowPMChart(true), 200);
    return () => {
      clearTimeout(mmTimer);
      clearTimeout(pmTimer);
    };
  }, []);

  const handleClose = () => {
    setSelectedMMData(null);
    setSelectedPMData(null);
  };

  const customLabel = ({ name, value }) => `${name}: ${value}`;

  return (
    // <div className="shadow-[0_0_25px_15px_rgba(0,255,0,0.8)] rounded-2xl boder text-center p-1
    // transition-transform duration-300 hover:scale-[1.3] hover:bg-black  hover:z-index origin-bottom-left">
    
   <div className="relative shadow-[0_0_25px_15px_rgba(0,255,0,0.8)] rounded-2xl border text-center p-1
  transition-transform duration-300 hover:scale-[1.3] hover:bg-black hover:z-[999] origin-bottom-left"> 
    
      <div className="flex justify-center gap-25 mb-6">
        <h2 className="text-xl flip-animationY text-yellow-400 font-bold">Maintenance Overview</h2>
        <h2 className="text-xl flip-animationY text-red-500 font-bold">Procurement Overview</h2>
      </div>

      <div className="grid  grid-cols-1 md:grid-cols-2 gap-10">
        {/* MM Chart */}
        <div className="flex  flex-col items-center justify-center">
          {showMMChart && (
            <PieChart width={255} height={270}>
              <Pie
                data={pieMMData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="43%"
                label={customLabel}
                onClick={(data) => setSelectedMMData(data)}
                innerRadius={70}
                outerRadius={100}
                isAnimationActive={true}
                animationDuration={800}
              >
                {pieMMData.map((entry, index) => (
                  <Cell key={`mm-cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom"  />
            </PieChart>
          )}
          {selectedMMData && <MmPieCard data={selectedMMData} onClose={handleClose} />}
        </div>

        {/* PM Chart */}
        <div className="flex flex-col items-center justify-center">
          {showPMChart && (
            <PieChart width={250} height={300}>
              <Pie
                data={piePMData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                label={customLabel}
                onClick={(data) => setSelectedPMData(data)}
                innerRadius={50}
                outerRadius={80}
                isAnimationActive={true}
                animationDuration={800}
              >
                {piePMData.map((entry, index) => (
                  <Cell key={`pm-cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom"  />
            </PieChart>
          )}
          {selectedPMData && <PmPieCard data={selectedPMData} onClose={handleClose} />}
        </div>
      </div>
    </div>
  );
};

export default DualPieCharts;


// import React, { useEffect, useState } from "react";
// import { PieChart, Pie, Cell, Tooltip } from "recharts";
// import MmPieCard from "./MmPieCard";
// import PmPieCard from "./PmPieCard";

// const DualPieCharts = ({ pieMMData, piePMData }) => {
//   const [selectedMMData, setSelectedMMData] = useState(null);
//   const [selectedPMData, setSelectedPMData] = useState(null);
//   const [showMMChart, setShowMMChart] = useState(false);
//   const [showPMChart, setShowPMChart] = useState(false);

//   useEffect(() => {
//     // Render MM chart after delay
//     const mmTimer = setTimeout(() => setShowMMChart(true), 100);
//     const pmTimer = setTimeout(() => setShowPMChart(true), 200);
//     return () => {
//       clearTimeout(mmTimer);
//       clearTimeout(pmTimer);
//     };
//   }, []);

//   const handleClose = () => {
//     setSelectedMMData(null);
//     setSelectedPMData(null);
//   };

//   return (
//     <div className="bg-white rounded-xl shadow text-center p-4">
//       <div className="flex justify-center gap-10 mb-4">
//         <h2 className="text-lg text-blue-500 font-bold">Maintenance Overview</h2>
//         <h2 className="text-lg text-red-500 font-bold">Procurement Overview</h2>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* MM Chart */}
//         <div className="flex justify-center items-center">
//           {showMMChart && (
//             <PieChart width={250} height={250}>
//               <Pie
//                 data={pieMMData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 onClick={(data) => setSelectedMMData(data)}
//                 innerRadius={50}
//                 outerRadius={80}
//                 label
//               >
//                 {pieMMData.map((entry, index) => (
//                   <Cell key={`mm-cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           )}
//           {selectedMMData && <MmPieCard data={selectedMMData} onClose={handleClose} />}
//         </div>

//         {/* PM Chart */}
//         <div className="flex justify-center items-center">
//           {showPMChart && (
//             <PieChart width={250} height={250}>
//               <Pie
//                 data={piePMData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 onClick={(data) => setSelectedPMData(data)}
//                 innerRadius={50}
//                 outerRadius={80}
//                 label
//               >
//                 {piePMData.map((entry, index) => (
//                   <Cell key={`pm-cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           )}
//           {selectedPMData && <PmPieCard data={selectedPMData} onClose={handleClose} />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DualPieCharts;



// import React, { useEffect, useState } from "react";
// import { PieChart, Pie, Cell, Tooltip } from "recharts";
// import MmPieCard from "./MmPieCard";
// import PmPieCard from "./PmPieCard";

// const DualPieCharts = ({ pieMMData, piePMData }) => {
//   const [selectedMMData, setSelectedMMData] = useState(null);
//   const [selectedPMData, setSelectedPMData] = useState(null);
//   const [renderCharts, setRenderCharts] = useState(false);

//   // Force rerender after layout stabilizes
//   useEffect(() => {
//     const timer = setTimeout(() => setRenderCharts(true), 3000); // adjust delay if needed
//     return () => clearTimeout(timer);
//   }, []);

//   const handleClose = () => {
//     setSelectedMMData(null);
//     setSelectedPMData(null);
//   };

//   return (
//     <div className="rounded-xl shadow text-center flip-animationZ flip-on-hover">
//       <div className="flex justify-center gap-10">
//         <h2 className="text-lg text-white font-bold mb-2">Maintenance Overview</h2>
//         <h2 className="text-lg text-red-500 font-bold mb-2">Procurement >>> Overview</h2>
//       </div>

//       <div className="flex flex-wrap">
//         {/* MM Chart */}
//         <div className="w-1/2 flex justify-center items-center">

//           {renderCharts && (
//             <PieChart width={250} height={250}>
//               <Pie
//                 data={pieMMData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 onClick={(data, index) => setSelectedMMData(data)}
//                 innerRadius={50}
//                 outerRadius={80}
//                 label
//               >
//                 {pieMMData.map((entry, index) => (
//                   <Cell key={`mm-cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           )}
//           {selectedMMData && <MmPieCard data={selectedMMData} onClose={handleClose} />}
//         </div>

//         {/* PM Chart */}
//         <div className="w-1/2 flex justify-center items-center">
//           {renderCharts && (
//             <PieChart width={250} height={250}>
//               <Pie
//                 data={piePMData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 onClick={(data, index) => setSelectedPMData(data)}
//                 innerRadius={50}
//                 outerRadius={80}
//                 label
//               >
//                 {piePMData.map((entry, index) => (
//                   <Cell key={`pm-cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           )}
//           {selectedPMData && <PmPieCard data={selectedPMData} onClose={handleClose} />}
//         </div>

        
//       </div>
//     </div>
//   );
// };

// export default DualPieCharts;
