import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import MmPieCard from "./MmPieCard";
import PmPieCard from "./PmPieCard";

const DualBarCharts = ({ pieMMData, piePMData }) => {
  const [selectedWKData, setSelectedWKData] = useState(null);
  const [selectedMMData, setSelectedMMData] = useState(null);
  const [selectedYYData, setSelectedYYData] = useState(null);
  const [renderCharts, setRenderCharts] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRenderCharts(true), 3000); // adjust delay if needed
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setSelectedWKData(null);
    setSelectedMMData(null);
    setSelectedYYData(null);
  };

  return (


    <div className="rounded-xl shadow text-center flip-animationZ flip-on-hover">
      <div className="flex justify-center gap-10">
        <h2 className="text-lg text-white font-bold mb-2">Weekly Overvie</h2>
        <h2 className="text-lg text-red-500 font-bold mb-2">Procurement >>> Overview</h2>
      </div>

      <div className="flex flex-wrap">
        {/* MM Chart */}
        <div className="w-1/2 flex justify-center items-center">

          {renderCharts && (
            <PieChart width={250} height={250}>
              <Pie
                data={pieMMData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                onClick={(data, index) => setSelectedMMData(data)}
                innerRadius={50}
                outerRadius={80}
                label
              >
                {pieMMData.map((entry, index) => (
                  <Cell key={`mm-cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
          {selectedMMData && <MmPieCard data={selectedMMData} onClose={handleClose} />}
        </div>

        {/* PM Chart */}
        <div className="w-1/2 flex justify-center items-center">
          {renderCharts && (
            <PieChart width={250} height={250}>
              <Pie
                data={piePMData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                onClick={(data, index) => setSelectedPMData(data)}
                innerRadius={50}
                outerRadius={80}
                label
              >
                {piePMData.map((entry, index) => (
                  <Cell key={`pm-cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
          {selectedPMData && <PmPieCard data={selectedPMData} onClose={handleClose} />}
        </div>

        
      </div>
    </div>
  );
};

export default DualBarCharts;
