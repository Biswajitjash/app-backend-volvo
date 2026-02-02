import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Import this
import { speakFunction } from '../../utils/SpeakFunction';


const Rfqapproval = () => {
  const [apiData, setApiData] = useState([]);
  const [error, setError] = useState(null);
  const [visibleRows, setVisibleRows] = useState(20);
  const [volume, setVolume] = useState(0.05);
  const backgroundAudioRef = useRef(null);
  const navigate = useNavigate(); // <-- Hook for navigation

  useEffect(() => {
    backgroundAudioRef.current = new Audio("/Bongo1.mp3");
    backgroundAudioRef.current.loop = true;
    backgroundAudioRef.current.volume = volume;
    backgroundAudioRef.current.play().catch(e => console.log("Music play failed:", e));

    return () => {
      backgroundAudioRef.current.pause();
      backgroundAudioRef.current.volume = 0;
      backgroundAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
   speakFunction("Fetching Pending RFQ for Approval "); 
    const fetchDataFromAPI = async () => {
      try {
        const response = await fetch(`/sap/opu/odata/sap/ZRFQ_APPROVAL_SRV/RFQ_COLLCT_NOSet`, {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'Authorization': 'Basic ' + btoa('AMPLCONS:today@02')
          }
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const jsonData = await response.json();
        setApiData(jsonData?.d?.results || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.message);
      }
    };

    fetchDataFromAPI();
  }, []);

  const handleShowMore = () => {
    setVisibleRows(prev => prev + 20);
  };

  const handleRowClick = (collNo) => {
    console.log(collNo)
    navigate(`/rfqDetails/${collNo}`); // <-- Navigate to detail view
  };

  return (
    <div className="p-4 font-sans text-xs bg-black min-h-screen w-full">
      <div className="sticky top-0 z-0 bg-yellow-00  flex flex-wrap items-center gap-2 px-3">
      <h2 className="text-lg font-semibold text-white mb-2">RFQ Approval Data</h2>
</div>
      {error && <p className="text-red-600">Error: {error}</p>}
      {apiData.length === 0 && !error && <p className="text-gray-600">Loading or no data found.</p>}

      {apiData.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-md border border-green-500 shadow-sm">
            <table className="min-w-full text-left border-collapse table-auto text-[11px]">
              <thead className="bg-blue-500 text-white rounded-md">
                <tr className="whitespace-nowrap bg-blue-500">
                  <th className="px-2 py-1 border border-gray-300">CollNo</th>
                  <th className="px-2 py-1 border border-gray-300">CountRfq</th>
                  <th className="px-2 py-1 border border-gray-300">CoCode</th>
                  <th className="px-2 py-1 border border-gray-300">DocTyp</th>
                  <th className="px-2 py-1 border border-gray-300">Creator</th>
                  <th className="px-2 py-1 border border-gray-300">PurGrp</th>
                  <th className="px-2 py-1 border border-gray-300">RfqStatus</th>
                  <th className="px-2 py-1 border border-gray-300">Approver</th>
                  <th className="px-2 py-1 border border-gray-300">AppvrName</th>
                </tr>
              </thead>
              <tbody>
                {apiData.slice(0, visibleRows).map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => handleRowClick(item.CollNo)} // <-- Add click handler
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-200'} 
                    cursor-pointer border border-green-400  hover:text-bold
                      transition-transform duration-1000 ease-in-out transform
                      hover:scale-[1.02] hover:shadow-xl hover:bg-green-300`}
                  >
                    <td className="px-2 py-1 ">{item.CollNo}</td>
                    <td className="px-2 ">{item.CountRfq}</td>
                    <td className="px-2 ">{item.CoCode}</td>
                    <td className="px-2 ">{item.DocTyp}</td>
                    <td className="px-2 ">{item.Creator}</td>
                    <td className="px-2 ">{item.PurGrp}</td>
                    <td className="px-2 ">{item.RfqStatus}</td>
                    <td className="px-2 ">{item.Approver}</td>
                    <td className="px-2 ">{item.AppvrName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {visibleRows < apiData.length ? (
            <div className="mt-2 text-center">
              <button
                onClick={handleShowMore}
                className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition"
              >
                Show More
              </button>
            </div>
          ) : (
            <div className="mt-0 text-center bg-greay text-red-600 text-bold text-xs italic">
              End of Records
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Rfqapproval;
