import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // <-- Import this
import { speakFunction } from '../../utils/SpeakFunction';




const RfqItemsDetail = () => {
  const {paramId}  = useParams();
  const [apiData, setApiData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
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
       speakFunction("Fetching RFQ Details "); 
    const fetchDataFromAPI = async () => {
      try {
        const response = await fetch(`/sap/opu/odata/sap/ZRFQ_APPROVAL_SRV/ZRFQ_NB_PO_LINESSet`, {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'Authorization': 'Basic ' + btoa('AMPLCONS:today@02')
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json();
        const results = jsonData?.d?.results || [];
        setApiData(results);

        if (paramId) {
          // const filtered = results.filter(item => item.CollNo === paramId);
          const filtered = results.filter(item => String(item.Ebeln).trim().toLowerCase() === String(paramId).trim().toLowerCase());

          setFilteredData(filtered);
        } else {
          setFilteredData(results);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.message);
      }
    };

    fetchDataFromAPI();
  }, [paramId]);

  const formatDate = (sapDate) => {
    if (!sapDate?.includes("Date")) return sapDate;
    const timestamp = parseInt(sapDate.match(/\d+/)[0]);
    const date = new Date(timestamp);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  // const renderStatusButton = (status, approver) => {
    
    // let className = "";
    // let label = "";

    // switch (status) {

    //   case "R":
    //     className = "bg-green-600";
    //     label = approver || "Approved";
    //     break;

    //   case "":
    //     className = "bg-blue-600";
    //     label = "WIP";
    //     break;

    //   case "X":
    //     className = "bg-red-600";
    //     label = "Rejected";
    //     break;

    //   default:
    //     className = "bg-gray-400";
    //     label = "WIP";
    // }

  //   return (
  //     <button className={`text-white px-2 py-1 rounded-full text-[10px] ${className}`}>
  //       {label}
  //     </button>
  //   );
  // };

  const handleShowMore = () => {
    setVisibleRows((prev) => prev + 20);
  };

  const handleRowClick = (rfqNo) => {
    // navigate(`/rfqItems/${rfqNo}`); // <-- Navigate to detail view
    // alert(rfqNo);
  };


  return (

    <div className="p-4 font-sans text-xs">
      <h2 className="text-lg font-semibold text-black mb-2">Item Details of RFQ No {paramId}</h2>

      {error && <p className="text-red-600">Error: {error}</p>}
      {filteredData.length === 0 && !error && <p className="text-gray-600">Loading or no data found.</p>}

      {filteredData.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-md border border-green-500 shadow-sm">
            <table className="min-w-full text-left border-collapse table-auto text-[11px]">
              <thead className="bg-blue-500 text-white rounded-md">
                <tr className="whitespace-nowrap">              
                  <th className="px-2 py-1 border border-gray-300">Vendor Name </th>
                  <th className="px-2 py-1 border border-gray-300">Rfq Number</th>
                  <th className="px-2 py-1 border border-gray-300">Date</th>
                  <th className="px-2 py-1 border border-gray-300">Material</th>
                  <th className="px-2 py-1 border border-gray-300">Description</th>

                  <th className="px-2 py-1 border border-gray-300">AVG Use</th>
                  <th className="px-2 py-1 border border-gray-300">RqrdQty</th>
                  <th className="px-2 py-1 border border-gray-300">Price</th>
                  <th className="px-2 py-1 border border-gray-300">Value</th>
                  <th className="px-2 py-1 border border-gray-300">Ord Qty</th>

                  <th className="px-2 py-1 border border-gray-300">Plant</th>
                  <th className="px-2 py-1 border border-gray-300">TaxCd</th>
                  <th className="px-2 py-1 border border-gray-300">Make</th>
                  <th className="px-2 py-1 border border-gray-300">Brand</th>
                  <th className="px-2 py-1 border border-gray-300">LPP Vendor</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.slice(0, visibleRows).map((item, index) => (
                  <tr
                    key={index}
                   onClick={() => handleRowClick(item.CollNo)} // <-- Add click handler                    
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-200'} hover:bg-yellow-300 transition whitespace-nowrap`}
                  >
                    <td className="px-2 py-1 border border-gray-200">{item.VenName}</td>
                    <td className="px-2 py-1 border border-gray-200">{item.Ebeln}</td>
                    <td className="px-2 py-1 border border-gray-200">{formatDate(item.chr_d)}</td>
                    <td className="px-2 py-1 border border-gray-200">{item.Matnr}</td>
                    <td className="px-2 py-1 border border-gray-200">{item.Txz01}</td>

                    <td className="px-2 py-1 border border-gray-200">{item.ZAVGUSE}</td>
                    <td className="px-2 py-1 border border-gray-200">{item.Ktmng}</td>
                    <td className="px-2 py-1 border border-gray-200">{item.Netpr}</td>
                    <td className="px-2 py-1 border border-gray-200">{item.Brtwr}</td>
                    <td className="px-2 py-1 border border-gray-200">{item.Menge}</td>

                    <td className="px-2 py-1 border border-gray-200">{item.Werks}</td>
                    <td className="px-2 py-1 border border-gray-200">{item.Mwskz}</td>
                    <td className="px-2 py-1 border border-gray-200">{item.Make}</td>
                    <td className="px-2 py-1 border border-gray-200">{item.Brand}</td>
                    <td className="px-2 py-1 border border-gray-200">{item.Lname}</td>
                    {/* <td className="px-2 py-1 border border-gray-200 text-center">{renderStatusButton(item.RfqStatus, item.Approver)}</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {visibleRows < filteredData.length ? (
            <div className="mt-2 text-center">
              <button
                onClick={handleShowMore}
                className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition"
              >
                Show More
              </button>
            </div>
          ) : (
            <div className="mt-1 text-center text-red-600 font-bold text-xs italic">
              End of Records
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RfqItemsDetail ;
