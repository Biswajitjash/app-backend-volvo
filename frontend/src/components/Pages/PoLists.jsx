import React, { useEffect, useState, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import QrScanner from '../QrScanner';
import { speakFunction } from '../../utils/SpeakFunction';



const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#F653A6'];

const PoLists = () => {
  const [apiData, setApiData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredPoData, setFilteredPoData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [toDate, setToDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [visibleRows, setVisibleRows] = useState(20);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [showChartModal, setShowChartModal] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const backgroundAudioRef = useRef(null);
  const [zoomed, setZoomed] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [scannedValue, setScannedValue] = useState('');
  const [showPoSendModal, setShowPoSendModal] = useState(false);
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [selectedPo, setSelectedPo] = useState(null);
  const [panNumber, setPanNumber] = useState('ABCDE12345');
  const [panNumberCount, setPanNumberCount] = useState(0);
  const [panError, setPanError] = useState('');
  const panInputRef = useRef(null);
  const [correctPan] = useState("ABCDE12345");


  ////////////////////////////////////////////////
  useEffect(() => {

    if (showPoSendModal && panInputRef.current) {
      panInputRef.current.focus();
    }
  }, [showPoSendModal]);


  // — fetch & initialize
  useEffect(() => {
    backgroundAudioRef.current = new Audio("/Belate.mp3");
    backgroundAudioRef.current.loop = true;
    backgroundAudioRef.current.volume = 0.05;
    backgroundAudioRef.current.play().catch(() => { });
    return () => {
      backgroundAudioRef.current?.pause();
      backgroundAudioRef.current = null;
    };
  }, []);

  ////////////////////////////////////////////////////////////////// 
  useEffect(() => {
    speakFunction("Fetching PO Details "); 
    (async () => {
      try {
        const resp = await fetch(`/sap/opu/odata/sap/ZRFQ_APPROVAL_SRV/RFQ_BILLEDSet`, {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            Authorization: 'Basic ' + btoa('AMPLCONS:today@02'),
          },
        });
        if (!resp.ok) throw new Error(`Status ${resp.status}`);
        const json = await resp.json();
        const data = json?.d?.results || [];
        setApiData(data);
        setFilteredData(data);
      } catch (e) {
        setFilteredData([]);
        console.error(e);
      }
    })();
  }, []);

  ////////////////////////////////////////////////////////////////// 
  // — format SAP date string for display
  const formatDate = (sapDate) => {
    const m = sapDate.match(/\d+/);
    if (!m) return sapDate;
    const d = new Date(+m[0]);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  ////////////////////////////////////////////////////////////////// 
  // — filter on Execute
  const handleExecute = () => {
    const filtered = apiData.filter(item => {
      // date as "YYYY-MM-DD"
      const ts = parseInt(item.Date.match(/\d+/)?.[0] || '0');
      const iso = new Date(ts).toISOString().slice(0, 10);
      if (iso < fromDate || iso > toDate) return false;
      // search
      if (searchQuery.trim()) {
        return Object.values(item).some(v =>
          String(v).toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return true;
    });
    setFilteredData(filtered);
    setVisibleRows(20);
  };

  ////////////////////////////////////////////////////////////////// 
  // — download XLS of current filteredData slice
  const handleDownloadXls = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData.slice(0, visibleRows));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PO_Done_List");
    XLSX.writeFile(wb, "PO_Done_List.xlsx");
  };


  ////////////////////////////////////////////////////////////////// 
  const handleDownloadSummary = () => {
    // convert summaryData to sheet

    const ws = XLSX.utils.json_to_sheet(
      summaryData.map(r => ({
        Vendor: r.vendor,
        "PO Count": r.count,
        "Total Amount": r.total.toFixed(2),
      }))
    );

    // build workbook & download
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Summary");
    XLSX.writeFile(wb, "PO_Summary.xlsx");
  };

  ////////////////////////////////////////////////////////////////// 

  // — show row-action modal
  const handleButtonClick = (action, po) => {
    setSelectedPo(po);
    setModalContent(`${action} clicked for PO: ${po}`);

    switch (action) {
      case "PoSend":
        setShowPoSendModal(true);
        break;
      case "Followup":
        setShowFollowupModal(true);
        break;
      case "GrRecd":
        setQrOpen(true);
        break;
      default:
        setShowModal(true);
    }
  };

  ////////////////////////////////////////////////////////////////// 
  const handlePanSubmit = () => {
    if (!panNumber || panNumber.length !== 10) {

      setPanError("Please enter a valid 10-digit PAN number.");
    

      ///////////////////////////////////////////////////
      return;
    }

    if (panNumber  !== correctPan ) {
  alert("PAN No mismatch !!..");
    return;
    }{  
    setPanError('');
    setShowPoSendModal(false);
    poToSend(selectedPo, panNumber); // Your function to fetch PDF/backend data
    }
  };
  ////////////////////////////////////////////////////////////////////
const poToSend = (po, pan) => {
  (async () => {
    try {

      const response = await fetch(`/sap/opu/odata/sap/ZRFQ_APPROVAL_SRV/ZPO_DATASet('${po}')`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: 'Basic ' + btoa('AMPLCONS:today@02'),
        },
      });

      if (!response.ok) throw new Error(`Status ${response.status}`);

      const pojson = await response.json();
      const podata = pojson?.d?.OutputPDF ?? null;

      if (podata) {
        setFilteredPoData(podata);
        openBase64Pdf(podata);
        // downloadBase64Pdf(podata);

        // console.log("PDF DATA:", podata);
      } else {
        console.error("No PDF data in response.");
      }
    } catch (err) {
      console.error("Error fetching PO data:", err);
    }
  })();
};

////////////////////////////////////////////////////////////////// 
  
const openBase64Pdf = (base64Data) => {
  const pdfWindow = window.open();
  pdfWindow.document.write(
    `<iframe width='100%' height='100%' src='data:application/pdf;base64,${base64Data}'></iframe>`
  );
};

////////////////////////////////////////////////////////////////// 

const downloadBase64Pdf = (base64Data, filename = "purchase_order.pdf") => {
  const link = document.createElement("a");
  link.href = `data:application/pdf;base64,${base64Data}`;
  link.download = filename;
  link.click();
};

////////////////////////////////////////////////////////////////// 
  // — compare pie chart data
  const handleCompare = () => {
    const vendorTotals = {};
    const vendorCounts = {};

    filteredData.forEach(item => {
      const vendor = item.Vendor || 'Unknown';
      const total = parseFloat(item.PoTotal) || 0;

      vendorTotals[vendor] = (vendorTotals[vendor] || 0) + total;
      vendorCounts[vendor] = (vendorCounts[vendor] || 0) + 1;

    });
    const pieChartData = Object.entries(vendorTotals).map(([vendor, total]) => ({
      name: vendor,
      value: total

    }));
    const tableData = Object.entries(vendorTotals).map(([vendor, total]) => ({
      vendor,
      count: vendorCounts[vendor],
      total
    }));

    //   setChartData(Object.entries(totals).map(([name,value])=>({ name, value })));
    setChartData(pieChartData);
    setSummaryData(tableData);
    setShowChartModal(true);
  };



  return (
    <div className="p-4 font-sans text-xs bg-black min-h-screen w-full">
      {/* — HEADER BAR */}
      <div className="sticky top-0 z-20 bg-green-500  flex flex-wrap items-center gap-2 px-3">
        <h2 className="text-lg font-semibold text-white">
          PO Done List{' '}
          <span className="text-sm font-bold">
            ({Math.min(visibleRows, filteredData.length)} of {apiData.length})
          </span>
        </h2>

        <button
          onClick={handleDownloadXls}
          className="ml-10 bg-pink-600 hover:bg-pink-700 text-white px-3  rounded text-sm">
          Xls Download
        </button>

        <button
          onClick={handleCompare}
          className=" ml-10 p-0 bg-purple-600 hover:bg-purple-700 text-white px-3  rounded text-sm">
          Compare
        </button>

        <input
          type="text"
          placeholder="Search..."
          className="ml-auto w-50 p-0 rounded border border-white text-white  bg-black text-sm"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)} />

        <label className="text-white text-sm">From</label>
        <input
          type="date"
          className="text-sm  px-2 p-0 bg-black rounded border border-gray-300 text-white"
          value={fromDate}
          max={toDate}
          onChange={e => setFromDate(e.target.value)} />

        <label className="text-white text-sm">To</label>
        <input
          type="date"
          className="text-sm  px-2 p-0 bg-black rounded border border-gray-300 text-white"
          value={toDate}
          min={fromDate}
          onChange={e => setToDate(e.target.value)} />

        <button
          onClick={handleExecute}
          className="flex items-center gap-1 bg-white text-green-700 px-2 py-1 rounded hover:bg-yellow-500 transition">
          <span>▶️</span>
        </button>
        {/* </div> */}
      </div>

      {/* — TABLE */}
      {filteredData.length === 0 ? (
        <p className="moving-text ">No data to display.</p>
      ) : (
        <>
          <div className="overflow-auto max-h-[600px] mt-2 rounded border border-green-500 shadow-sm">
            <table className="min-w-full table-auto text-[10px] border-collapse">
              <thead className="bg-blue-500 text-white sticky top-0 z-10">
                <tr>
                  {[
                    "PoNumber", "PO Date", "Vendor", "Po Total", "Key", "Pay",
                    "DocType", "Rfq Number", "Creator", "PGrp", "PO Status"
                  ].map((h, i) => (
                    <th key={i} className="px-1 py-1 border text-center">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.slice(0, visibleRows).map((item, idx) => (
                  <tr
                    key={item.PoNumber + idx}
                    className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-200'}
                      cursor-pointer border border-green-400
                      transition-transform duration-200 ease-in-out transform
                      hover:scale-[1.06] hover:shadow-xl hover:bg-yellow-300`} >
                    <td className="px-2 py-1 text-center font-bold text-red-500">{item.PoNumber}</td>
                    <td className="px-1 py-1">{formatDate(item.Date)}</td>
                    <td className="px-1 py-1">{item.Vendor}</td>
                    <td className="px-1 py-1 text-right font-bold text-blue-600">{item.PoTotal}</td>
                    <td className="px-1 py-1">{item.CurKey}</td>
                    <td className="px-1 py-1">{item.PayTerm}</td>
                    <td className="px-1 py-1">{item.DocTyp}</td>
                    <td className="px-1 py-1">{item.RfqNo}</td>
                    <td className="px-1 py-1">{item.Creator}</td>
                    <td className="px-1 py-1">{item.PurGrp}</td>

                    <td className="px-1 py-1 space-x-1 text-center">
                      {["PoSend", "Followup", "GrRecd"].map(action => (
                        <button
                          key={action}
                          onClick={() => handleButtonClick(action, item.PoNumber)}
                          className={`px-2 py-0.5 rounded text-white text-xs
                          ${action === "PoSend" ? "bg-blue-500 hover:bg-blue-600" :
                              action === "Followup" ? "bg-yellow-500 hover:bg-yellow-600" :
                                "bg-green-500 hover:bg-green-600"}`} >
                          {action}
                        </button>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* — PAGINATION */}
          <div className="mt-2 text-center space-x-4">
            <button onClick={() => setVisibleRows(v => Math.max(v - 1, 1))}
              className="bg-green-500 text-white px-3 py-1 rounded text-xs">
              Show 1 Up
            </button>
            <button onClick={() => setVisibleRows(v => v + 20)}
              className="bg-blue-600 text-white px-3 py-1 rounded text-xs">
              Show More
            </button>
            <button onClick={() => setVisibleRows(v => v + 1)}
              className="bg-red-500 text-white px-3 py-1 rounded text-xs">
              Show 1 Down
            </button>

          </div>
        </>
      )}

      {/* — SIMPLE MESSAGE MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-4 rounded shadow-md w-80 text-center">
            <p className="mb-4 text-sm">{modalContent}</p>
            <button onClick={() => setShowModal(false)}
              className="bg-blue-500 text-white px-4 py-1 rounded">
              Close
            </button>
          </div>
        </div>
      )}


      <QrScanner
        isOpen={qrOpen}
        onClose={() => setQrOpen(false)}
        onScan={(data) => {
          setScannedValue(data);
          alert(`Scanned: ${data}`);
        }} />

      {scannedValue && (
        <p className="mt-25 text-center text-green-400 font-bold">Last Scanned Data: {scannedValue}</p>
      )}

      {/* — PIE CHART MODAL */}
      {showChartModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-center">Vendor-wise PO Total</h2>
            </div>

            {/* Body */}
            <div className="px-6 py-4 flex-1 overflow-y-auto">
              {/* Pie Chart */}
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label
                    >
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>


              {/* Scrollable Summary Table */}
              <div className="mt-4 max-h-64 overflow-y-auto border-t border-gray-200 pt-4">
                <table className="min-w-full table-auto text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 py-1 border">Vendor</th>
                      <th className="px-3 py-1 border text-center">PO Count</th>
                      <th className="px-3 py-1 border text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryData.map((row, idx) => {
                      const colorIndex = chartData.findIndex(e => e.name === row.vendor);
                      const textColor = COLORS[colorIndex % COLORS.length] || '#000';
                      return (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-3 py-1 border font-medium" style={{ color: textColor }}>
                            {row.vendor}
                          </td>
                          <td className="px-3 py-1 border text-center font-medium" style={{ color: textColor }}>
                            {row.count}
                          </td>
                          <td className="px-3 py-1 border text-right font-medium" style={{ color: textColor }}>
                            {row.total.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer / Close Button */}
            <div className="px-2 py-1 border-t flex justify-center items-center gap-5">
              <button
                onClick={handleDownloadSummary}
                className="bg-green-600  hover:bg-green-700 text-white px-4 py-2 rounded transition">
                Download Summary
              </button>

              <button
                onClick={() => setShowChartModal(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition">
                Close
              </button>

              <button onClick={() => setZoomed(z => !z)} className="ml-2 text-sm">

                {zoomed ? '🗗 Normal' : '🔍 Zoom'}
              </button>
            </div>

          </div>
        </div>
      )}
      {/* //////////////////////////////////////////////////////////////////////// */}

      {showPoSendModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-red-200 p-4 rounded shadow-250px w-80">
            <h2 className="text-lg text-center text-green-700 font-bold mb-5">Send PO - {selectedPo}</h2>

            <div className='flex gap-2'>
              <label className="font-bold text-red-500 text-sm mt-1">PAN Number:</label>

              <input
                ref={panInputRef} // autofocus via useRef
                type="text"
                value={panNumber}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  setPanNumber(value);
                  setPanNumberCount(value.length);
                }}
                className="border px-2 gap-1 p-1 bg-black w-23 text-white font-bold rounded mb-2"
                maxLength={10}
              />

              <label className="font-bold text-red-500 mt-1">{panNumberCount} Digit</label>
            </div>

            {panError && <p className="text-red-500 text-xs mb-2">{panError}</p>}

            <div className="flex justify-center gap-30 mt-4">
              <button onClick={() => setShowPoSendModal(false)} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>

              {panNumber.length === 10 && (
                <button onClick={handlePanSubmit} className="px-3 py-1 bg-blue-600 text-white rounded">Submit</button>
              )}
            </div>
          </div>
        </div>
      )}

      {showFollowupModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-4 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-2">Follow-up for PO - {selectedPo}</h2>
            <p className="text-sm text-gray-600">Add follow-up info here.</p>
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowFollowupModal(false)} className="px-3 py-1 bg-yellow-500 text-white rounded">Close</button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
};

export default PoLists;
