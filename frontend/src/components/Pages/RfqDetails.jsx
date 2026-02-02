import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from "react-qr-code";
import QrModel from "../QrModel";
import { speakFunction } from '../../utils/SpeakFunction';



const RfqDetails = () => {
  const { paramId } = useParams();
  const [apiData, setApiData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [volume] = useState(0.05);
  const backgroundAudioRef = useRef(null);
  const [detailView, setDetailView] = useState(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrData, setQrData] = useState(null); // <-- New: For QR Code content
  const [venName, setVenName] = useState(""); // <-- New: For QR Code content
  const [isOn, setIsOn] = useState(false);

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
const rfqid = (paramId || '0000000000').replace(/^0+/, '') || '0';    
    speakFunction(`RFQ Details of Collective No ${rfqid}`);
    
    fetchDataFromAPI();
  }, [paramId]);

    // //////////////////////////////////////////////////

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
          const filtered = results.filter(item => String(item.CollNo).trim().toLowerCase() === String(paramId).trim().toLowerCase());
          setFilteredData(filtered);
        } else {
          setFilteredData(results);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.message);
      }
    };


    // //////////////////////////////////////////////////
  const handleRowClick = (matnr, desc, ord_qty, ord_uom) => {
const ordqty = (ord_qty || '0000000.000').replace(/\.?0+$/, '');
    speakFunction(`Compare of Material ${desc} Requir ${ordqty} ${ord_uom}`);
    
    const matched = filteredData.filter(item => item.Matnr === matnr);
    setDetailView(matched);
  };

  const handleBack = () => {
    setDetailView(null);
  };

//  const handleGenerateQR = (vendor) => {
//     const vendorData = filteredData.filter(item => item.VenName === vendor);

//     const qrContent = vendorData.map(item => 
//       `Material: ${item.Matnr}, Desc: ${item.Txz01}, Req Qty: ${item.Ktmng}, Price: ${item.Netpr}`
//     ).join('\n');

const handleGenerateQR = (vendor) => {
  const vendorData = filteredData
    .filter(item => item.VenName === vendor)
    .map(item => ({
      "Material": item.Matnr,
      "Desc": item.Txz01,
      "Req Qty": item.Ktmng,
      "Price": null,
       "ETA": null ,
       "Warranty": null ,
       "Req Type": null
    }
  ));

  setQrData(JSON.stringify(vendorData)); 

    setVenName(vendor);
    setQrOpen(true);
  };

  
    // const initialState = Menge > 0;
  const handleOrderSwitch = () => {
    alert("Button Click");

  //   if (menge === "0.000") {
  //   // label = "Ordered";
  //   // bgColor = "bg-green-600";
  //   menge = ktmng;
  //   return menge;
  // } else if (menge > 0) {
  //   // label = approver || "WIP";
  //   // bgColor = "bg-yellow-300";
  //       menge = 0;
  //   return menge;
  // }
    
  // debugger;
  
  };



  const renderStatusButton = (Menge, approver) => {
  let isActive = false;
  let label = "";
  let bgColor = "";

  
if (Menge === "0.000") {
    label = approver || "WIP";
    isActive = false;
    bgColor = "bg-yellow-300";
  } else if (Menge > 0) {
    label = "Ordered";
    isActive = true;
    bgColor = "bg-green-600";
  }

  // if (Menge === "0.000") {
  //   label = approver || "WIP";
  //   isActive = false;
  //   bgColor = "bg-red-600";
  // } else if (Menge > 0) {
  //   label = "Ordered";
  //   isActive = true;
  //   bgColor = "bg-green-600";
  // } else {
  //   label = "WIP";
  //   isActive = false;
  //   bgColor = "bg-gray-400";
  // }

  return (
    <div
      className={`flex items-center w-[75px] g h-6 rounded-full px-1 text-white text-[10px] cursor-pointer ${bgColor} transition-all duration-300`}
      onClick={handleOrderSwitch}
    >
      <div
        className={`h-4 w-4 rounded-full bg-white transition-all duration-300 ${
          isActive ? "ml-auto" : "mr-auto"
        }`}
      ></div>
      <span className="ml-3 ">{label}</span>
    </div>
  );
};

  // const renderStatusButton = (Menge, approver) => {
  //   let className = "";
  //   let label = "";

  //   if (Menge === "0.000"  ) {
  //     className = "bg-red-600";
  //     label = approver || "WIP";
      
  //   } else if (Menge > 0) {
  //     className = "bg-green-600";
  //     label = "Ordered";
    
  //   // } else if (Menge = 0) {
  //   //   className = "bg-red-600";
  //   //   label = "Rejected";
    
  //   } else {
  //     className = "bg-gray-400";
  //     label = "WIP";
  //   }

  //   return (
  //     <button className={`text-white px-2 py-1 rounded-full text-[10px] ${className}`}>
  //       {label}
  //     </button>
  //   );
  // };

  const groupByVendorAndMatnr = (data) => {
    const grouped = {};
    data.forEach(item => {
      if (!grouped[item.VenName]) grouped[item.VenName] = {};
      if (!grouped[item.VenName][item.Matnr]) grouped[item.VenName][item.Matnr] = [];
      grouped[item.VenName][item.Matnr].push(item);
    });
    return grouped;
  };

const DetailScreen = () => {
// speakFunction(`Comparison of Material No ${sortedDetailView[0].Matnr}`);

  // Parse and sort Netpr in ascending order
  const sortedDetailView = [...detailView].sort(
    (a, b) => parseFloat(a.Netpr) - parseFloat(b.Netpr)
  );

  const minNetpr = Math.min(...sortedDetailView.map((item) => parseFloat(item.Netpr)));

  return (
    <div className="flex bg-green-100 rounded p-4 text-xs">
      <div className="bg-blue-100 rounded">
        <div className="flex mb-0">
          <button onClick={handleBack} className="bg-violet-500 text-white px-4 py-1 rounded">
            Back
          </button>
        </div>
        <h4 className="text-lg font-semibold text-red-500 mb-0">
          {sortedDetailView[0].Txz01} Require: {sortedDetailView[0].Ktmng} {sortedDetailView[0].Meins}.
        </h4>

        <div className="mb-2 flex flex-wrap text-blue-500 font-semibold gap-4">
          <p className="text-blue-600">Material: {sortedDetailView[0].Matnr}</p>
          <p className="text-blue-600">MPN No: {sortedDetailView[0].Ematn}</p>
          <p className="text-blue-600">AvgUse: {sortedDetailView[0].ZAVGUSE}</p>
          <p className="text-red-500">Plant: {sortedDetailView[0].Werks}</p>
          <p className="text-green-600">Stock IH: {sortedDetailView[0].Zsih}</p>
          <p className="text-green-600">Stock IT: {sortedDetailView[0].Zsit}</p>
          <p className="text-red-600">LPP: {sortedDetailView[0].Lprice}</p>
          <p className="text-red-600">LVendor: {sortedDetailView[0].Lname}</p>
        </div>

        <div className="flex flex-wrap gap-4">
          {sortedDetailView.map((item, index) => (
            <div
              key={index}
              className={`w-[380px] border rounded p-4 ${
                parseFloat(item.Netpr) === minNetpr
                  ? 'bg-green-300 text-white color-change'
                  : 'bg-white'
              } shadow space-y-1`}
            >
              <div className="flex gap-5 text-red-500 font-bold">
                <div>{item.VenName}</div>
                <div className="text-blue-500">{item.Netpr}</div>
              </div>

              <div>
                <strong>Ordered:</strong> {item.Menge}
                <span className="ml-10"><strong>Value:</strong> {item.Brtwr}</span>
              </div>
              <div>
                <span className="ml-0 text-red-500"><strong>ETA:  </strong></span>
                <span className="ml-24 text-blue-500"><strong>{item.chr_d} </strong></span>
              </div>
              <div>
                <span className="ml-0 py-2 text-blue-500"><strong>Availablity: </strong></span>
                <span className="ml-15 text-blue-500"><strong>?????????? </strong></span>
              </div>
              <div>
                <span className="ml-0 text-red-500"><strong>ETA: {item.chr_d} </strong></span>
                <span className="ml-10 text-red-500"><strong>ETA: {item.chr_d} </strong></span>
              </div>
              <div>
                <span className="ml-0 text-blue-500"><strong>Warranty: 6Months </strong> </span>
              </div>

              <div>{renderStatusButton(item.Menge, item.Approver)}</div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <button className="bg-green-600 text-white px-3 py-1 rounded">
            Add In Order
          </button>
        </div>
      </div>
    </div>
  );
};



const groupedData = groupByVendorAndMatnr(filteredData);
  return (
    <div className="p-4 font-sans bg-black text-xs w-full">
      <QrModel open={qrOpen} onClose={() => setQrOpen(false)} qrData={qrData} venName={venName} />

      {!detailView ? (
        <>
          <h2 className="text-lg font-semibold  text-white mb-2">
            RFQ Details of Collective No {paramId}
          </h2>
          {error && <p className="text-red-600">Error: {error}</p>}
          {filteredData.length === 0 && !error && <p className="text-gray-600">Loading or no data found.</p>}

          {Object.entries(groupedData).map(([
            vendor, matnrs], vendorIndex) => {
            let subtotalKtmng = 0;
            let subtotalMenge = 0;
            let subtotalBrtwr = 0;

            return (
              <div key={vendorIndex} className="mb-6 border border-green-500 rounded">
                <div className="bg-green-300 px-2 py-1 font-bold text-blue-500">Vendor: {vendor}   
                  
                  <button   onClick={() => handleGenerateQR(vendor)} 
                  className="ml-10 bg-violet-300 px-2 rounded cursor-pointer border border-green-400  hover:text-bold
                      transition-transform duration-600 ease-in-out transform
                      hover:scale-[1.01] hover:shadow-xl hover:bg-yellow-300 " > Generate QR </button>
                  </div>
                
                <div className="">
                  <table className="min-w-full text-center border-collapse mt-0 text-[10px]">
                    <thead className="bg-blue-500 text-white sticky top-0 z-10">
                      <tr>
                        <th className="w-20 text-center">Material No</th>
                        <th className="w-40 text-center">Item Description</th>
                        <th  className="w-20 text-end" >Rqr-Qty</th>
                        <th  className="w-10 text-end">UOM</th>
                        <th  className="w-25 text-end">Price</th>
                        <th  className="w-20 text-end">Ord Qty</th>
                        <th  className="w-30 text-end">Ord Value</th>
                        <th className="w-25 text-center" >Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(matnrs).map(([matnr, items], matIndex) => (
                        items.map((item, i) => {
                          subtotalKtmng += Number(item.Ktmng);
                          subtotalMenge += Number(item.Menge);
                          subtotalBrtwr += Number(item.Brtwr);
                          return (
                            <tr
                              key={`${matIndex}-${i}`}
                              onClick={() => handleRowClick(item.Matnr, item.Txz01, item.Ktmng, item.Meins)}
                              className={`${(matIndex + i) % 2 === 0 ? 'bg-white' : 'bg-gray-200'} 
                              cursor-pointer border border-green-400  hover:text-bold
                      transition-transform duration-600 ease-in-out transform
                      hover:scale-[1.01] hover:shadow-xl hover:bg-violet-300`}
                            >
                              <td className="px-2 text-red-500 font-bold">{item.Matnr}</td>
                              <td>{item.Txz01}</td>
                              <td className="text-right">{item.Ktmng}</td>
                              <td className="text-right">{item.Netpr}</td>
                              <td className="text-right">{item.Menge}</td>
                              <td className="text-right">{item.Meins}</td>
                              <td className="text-right">{item.Menge * item.Netpr} </td>
                              <td className="text-center">{renderStatusButton(item.Menge, item.Approver)}</td>
                            </tr>
                          );
                        })
                      ))}
                      <tr className="bg-yellow-100 font-bold">
                        <td colSpan="2">Subtotal</td>
                        <td  className="text-right">{subtotalKtmng}</td>
                        <td colSpan="2" className="text-right">{subtotalMenge}</td>
                        <td className="text-right">{subtotalBrtwr.toFixed(3)}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <DetailScreen />
      )}
    </div>
  );
};

export default RfqDetails;

