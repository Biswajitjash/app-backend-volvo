import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import SitePrSummary from './SitePrSummary';
import { speakFunction } from '../../utils/SpeakFunction';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SingleSitePrDetail = () => {
  const { prNumber } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [apiData, setApiData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [visibleRows, setVisibleRows] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [compareData, setCompareData] = useState({});
  const [collapsedSites, setCollapsedSites] = useState({});
  const [fromDate, setFromDate] = useState(() => {
  const today = new Date();
  const past = new Date(today.setDate(today.getDate() - 30));
  return past.toISOString().slice(0, 10);
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [activeTabs, setActiveTabs] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  

  useEffect(() => {
    window.speechSynthesis.cancel();
    //  speakFunction(`Fetching  PR  ${prNumber}`);
     console.log(prNumber);
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const url = `/sap/opu/odata/sap/ZI_EBAN_CDS_CDS/ZI_EBAN_CDS?$filter=banfn eq '${prNumber}'`;
        //  ?$filter=(banfn eq '2100000134' or banfn eq '2100000167') and Status eq 'OPEN'

        const resp = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            Authorization: 'Basic ' + btoa('AMPLCONS:today@02'),
          },
        });


        const json = await resp.json();
        const data = json?.d?.results || [];


if (data.length === 0) {
  speakFunction("No Data matching");

   setTimeout(() => {
    navigate('/Dashboard');
    // navigate(-1); // or navigate('/previous')
  }, 500); // matches the toast duration
} else {

  setApiData(data);
  setFilteredData(data);
  setVisibleRows(data.length);
  speakFunction(`Found ${data.length} Records`);
    window.speechSynthesis.cancel();

}


      } catch (err) {
        console.error("Fetch Error:", err);
        setFilteredData([]);
      
      } finally {
        setIsLoading(false);
        setHasFetched(true);
      }
    };

    if (prNumber) fetchData();
  }, [prNumber]);

  const formatDate = (sapDate) => {
    const match = sapDate?.match(/\d+/);
    return match ? new Date(+match[0]).toLocaleDateString('en-GB') : '';
  };

  const handleDownloadXls = () => {
    if (filteredData.length === 0) {
      alert("No data available to download.");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Filtered_PR_List");
    XLSX.writeFile(wb, `PR_${prNumber}_Data.xlsx`);
  };

  const handleCompare = () => {
    const grouped = {};
    filteredData.forEach(item => {
      const status = item.Status || 'Unknown';
      const site = item.site_plant || 'Unknown';
      const matnr = item.matnr;
      const qty = parseFloat(item.OrdQty || 0);
      const lurgncy = item.prio_urg;
      const desc = item.txz01 || '';

      if (!grouped[status]) grouped[status] = {};
      if (!grouped[status][site]) grouped[status][site] = {};

      if (!grouped[status][site][matnr]) {
        grouped[status][site][matnr] = {
          matnr,
          lstatus: status,
          lsite: site,
          lurgncy,
          txz01: desc,
          totalQty: qty,
        };
      } else {
        grouped[status][site][matnr].totalQty += qty;
      }
    });

    const initialTabs = {};
    Object.keys(grouped).forEach(status => {
      const firstSite = Object.keys(grouped[status])[0];
      initialTabs[status] = firstSite;
    });

    setCompareData(grouped);
    setActiveTabs(initialTabs);
    setShowSummary(true);
  };

  if (showSummary) {
    return (
      <SitePrSummary
        rowData={filteredData}
        compareData={compareData}
        onactiveTab={activeTabs}
        onBack={() => setShowSummary(false)}
      />
    );
  }

  return (
    <div className="p-4 text-sm text-white bg-gray-900 min-h-screen">
      <h2 className="text-lg font-semibold text-green-400 mb-4">
        Showing PR: {prNumber} ({filteredData.length} records)
      </h2>
      <div className="mb-2 flex gap-2 items-center">  
        <button onClick={handleDownloadXls} className="bg-blue-600 px-3 py-1 rounded">Download XLS</button>
        <button onClick={handleCompare} className="bg-purple-600 px-3 py-1 rounded">Compare</button>
        <input
          className="text-black p-1 rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
        />
      </div>

      {isLoading ? (
        <p>Loading data...</p>
      ) : hasFetched && filteredData.length === 0 ? (
        <p>No records found for PR {prNumber}</p>
      ) : (
        <div className="overflow-auto max-h-[70vh]">
          <table className="min-w-full border border-gray-700">
            <thead className="bg-green-700">
              <tr>
                {['Urgency', 'Status', 'PR Number', 'Line', 'PR Date', 'Site', 'Material', 'Description', 'Req Qty'].map((h, i) => (
                  <th key={i} className="px-2 py-1 border border-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, i) => (
                <tr key={i} className={i % 2 ? 'bg-gray-800' : 'bg-gray-700'}>
                  <td className="border px-1 py-1">{item.prio_urg}</td>
                  <td className="border px-1 py-1">{item.Status}</td>
                  <td className="border px-1 py-1">{item.banfn}</td>
                  <td className="border px-1 py-1">{item.bnfpo}</td>
                  <td className="border px-1 py-1">{formatDate(item.creationdate)}</td>
                  <td className="border px-1 py-1">{item.site_plant}</td>
                  <td className="border px-1 py-1">{item.matnr}</td>
                  <td className="border px-1 py-1 truncate max-w-[200px]">{item.txz01}</td>
                  <td className="border px-1 py-1 text-right">{item.OrdQty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SingleSitePrDetail;


//  import React, { useEffect, useState } from 'react';
//  import * as XLSX from 'xlsx';
//  import SitePrSummary from './SitePrSummary';
 
 
//  const SingleSitePrDetail = () => {
//  const { prNumber } = useParams();
//  const [data, setData] = useState([]);
//    const [apiData, setApiData] = useState([]);
//    const [filteredData, setFilteredData] = useState([]);
//    const [visibleRows, setVisibleRows] = useState(20);
//    const [searchQuery, setSearchQuery] = useState('');
//    const [showChartModal, setShowChartModal] = useState(false);
//    const [compareData, setCompareData] = useState({});
//    const [collapsedSites, setCollapsedSites] = useState({});
//    const [fromDate, setFromDate] = useState(() => {
//      const today = new Date();
//      const past = new Date(today.setDate(today.getDate() - 30));
//      return past.toISOString().slice(0, 10);
//    });
//    const [toDate, setToDate] = useState(() => new Date().toISOString().slice(0, 10));
//    const [isLoading, setIsLoading] = useState(true);
//    const [hasFetched, setHasFetched] = useState(false);
//    const [activeTabs, setActiveTabs] = useState({});
//     const [showSummary, setShowSummary] = useState(false);


//    useEffect(() => {

//     const fetchData = (async () => {
       
//       try {
//          setIsLoading(true);
         
//         //  const resp = await fetch(`/sap/opu/odata/sap/ZI_EBAN_CDS_CDS/ZI_EBAN_CDS`, {
//         //    headers: {
//         //      "Content-Type": "application/json",
//         //      "Accept": "application/json",
//         //      Authorization: 'Basic ' + btoa('AMPLCONS:today@02'),
//         //    },
//         //  });



//       const url = `/sap/opu/odata/sap/ZI_EBAN_CDS_CDS/ZI_EBAN_CDS?$filter=Banfn eq '${prNumber}'`;

//       const resp = await fetch(url, {
//         headers: {
//           "Content-Type": "application/json",
//           "Accept": "application/json",
//           Authorization: 'Basic ' + btoa('AMPLCONS:today@02'),
//         },
//       });


//          const json = await resp.json();
//          const data = json?.d?.results || []; 
   
//          setApiData(data);
//          setFilteredData(data);
//          setVisibleRows(data.length);
   
         
//     if (prNumber) {
//       fetchData();
//     }
//   }, [prNumber]);


//         } catch (err) {
//          console.error("Fetch Error:", err);
//          setFilteredData([]);
//        } finally {
//          setIsLoading(false);
//          setHasFetched(true);
//        }
//      })();
//    }, []);
 


//    const formatDate = (sapDate) => {
//      const match = sapDate?.match(/\d+/);
//      return match ? new Date(+match[0]).toLocaleDateString('en-GB') : '';
//    };
 
//    const handleExecute = () => {
//      const filtered = apiData.filter(item => {
//        const match = item.creationdate?.match(/\d+/);
//        const ts = match ? parseInt(match[0]) : null;
//        const iso = ts ? new Date(ts).toISOString().slice(0, 10) : null;
//        if (!iso || iso < fromDate || iso > toDate) return false;
//        if (searchQuery.trim()) {
//          return Object.values(item).some(val =>
//            String(val).toLowerCase().includes(searchQuery.toLowerCase())
//          );
//        }
//        return true;
//      });
//      setFilteredData(filtered);
//      setVisibleRows(filtered.length);
//    };
 
//    const handleDownloadXls = () => {
//      if (filteredData.length === 0) {
//        alert("No data available to download.");
//        return;
//      }
 
//      const ws = XLSX.utils.json_to_sheet(filteredData.slice(0, visibleRows));
//      const wb = XLSX.utils.book_new();
//      XLSX.utils.book_append_sheet(wb, ws, "Filtered_PO_List");
//      XLSX.writeFile(wb, "Filtered_PO_List.xlsx");
//    };
 
//    const handleCompare = () => {
//      const grouped = {};
 
//      filteredData.forEach(item => {
//        const status = item.Status || 'Unknown';
//        const site = item.site_plant || 'Unknown';
//        const matnr = item.matnr;
//        const totalstock = item.Stock_Qty;
//        const qty = parseFloat(item.OrdQty || 0);
//        const desc = item.txz01 || '';
//        const lurgncy = item.prio_urg;
 
//        if (!grouped[status]) grouped[status] = {};
//        if (!grouped[status][site]) grouped[status][site] = {};
 
//        if (!grouped[status][site][matnr]) {
//          grouped[status][site][matnr] = {
//            matnr: matnr,
//            lstatus: status,
//            lsite: site, 
//            lurgncy,
//            txz01: desc,
//            totalStockQty: totalstock ,
//            totalQty: qty,
//          };
//        } else {
//          grouped[status][site][matnr].totalQty += qty;
//        }
//      });
 
//      const initialTabs = {};
//      Object.keys(grouped).forEach(status => {
//        const firstSite = Object.keys(grouped[status])[0];
//        initialTabs[status] = firstSite;
//      });
 
     
//      setCompareData(grouped);
//      setActiveTabs(initialTabs);
//     //  setShowChartModal(true);
//  setShowSummary(true);

//     };
 
//   if (showSummary) {
//     return <SitePrSummary 
//                           rowData={filteredData}
//                           compareData={compareData}
//                           onactiveTab={activeTabs} 
//                           onBack={() => setShowSummary(false)} />;
//   }

//    return (
//      <div className="p-2  font-sans text-xs bg-black min-h-screen w-full rounded">
//       {/* HEADER */}
//       <div className="sticky top-0 z-20 bg-green-500 flex flex-wrap items-center gap-2 px-3 py-2">
//         <h2 className="text-lg font-semibold text-white">
//           Site PR List
//           <span className="text-sm font-bold ml-2">
//             ({Math.min(visibleRows, filteredData.length)} of {apiData.length})
//           </span>
//         </h2>
//         <button onClick={handleDownloadXls}
//           className="ml-4 bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded text-sm font-semibold shadow">
//           Xls Download
//         </button>
//         <button onClick={handleCompare}
//           className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm font-semibold shadow">
//           Compare
//         </button>
//         <input type="text" placeholder="Search..."
//           className="ml-auto w-40 p-1 rounded border border-white text-white bg-black text-sm"
//           value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
//         <label className="text-white text-sm">From</label>
//         <input type="date" className="text-sm px-2 p-0 bg-black rounded border border-gray-300 text-white"
//           value={fromDate} max={toDate} onChange={e => setFromDate(e.target.value)} />
//         <label className="text-white text-sm">To</label>
//         <input type="date" className="text-sm px-2 p-0 bg-black rounded border border-gray-300 text-white"
//           value={toDate} min={fromDate} onChange={e => setToDate(e.target.value)} />
//         <button onClick={handleExecute}
//           className="flex items-center gap-1 bg-white text-green-700 px-2 py-1 rounded hover:bg-yellow-500 transition">
//           ▶️
//         </button>
//       </div>

//       {/* LOADING OR EMPTY STATE */}
//       {isLoading ? (
//         <p className="moving-text">Please wait... Fetching data from API.</p>
//       ) : hasFetched && filteredData.length === 0 ? (
//         <p className="text-red-500 text-center mt-4 text-sm font-semibold animate-pulse">No data to display.</p>
//       ) : (
//         <div className="max-h-[600px] mt-2  rounded border border-green-500 shadow-sm">
//           <table className="min-w-full  text-[11px] border-collapse">
//             <thead className="bg-blue-500 text-white sticky top-0 z-10">
//               <tr>
//                 {[
//                   "Ugncy", "Status", "Delay", "PR Number", "Line", "PR Date", "PRSite", 
//                   "Material No", "Descriptions", "StkQty", "ReqQty","CwhStock", "StdPR No", "Qty",
//                   "SPRDate", "Pro PO No", "PO Date", "PO Plant", "Pro Qty", "GRN No",
//                   "GR Date", "GR Qty", "GR Batch", "Sto_Po_No", "Sto_Date", "OB-DelNo", "OB-Batch"
//                 ].map((h, i) => (
//                   <th key={i} className="px-1 py-1 border  text-center">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData
//               // .slice(0, visibleRows).map((item, idx) => (
//                 .slice(0, visibleRows)
//                 .sort((a, b) => {
//       if (a.banfn < b.banfn) return 1;
//       if (a.banfn > b.banfn) return -1;
//       if (a.bnfpo < b.bnfpo) return -1;
//       if (a.bnfpo > b.bnfpo) return 1;
//       return 0;
//     }) .map((item, idx) => (
//                 <tr key={item.banfn + idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-blue-200'} hover:bg-yellow-200`}>
//                   <td className="px-1 py-1">{item.prio_urg}</td>
//                   <td className="px-1 py-1">{item.Status}</td>
//                   <td className="px-1 py-1">{item.Delay}</td>
//                   <td className="px-1 py-1 text-red-600 font-bold text-center">{item.banfn}</td>
//                   <td className="px-1 py-1">{item.bnfpo}</td>
//                   <td className="px-1 py-1">{formatDate(item.creationdate)}</td>
//                   <td className="px-1 py-1">{item.site_plant}</td>
//                   <td className="px-1 py-1">{item.matnr}</td>
//                   <td className="px-1 py-2 max-w-[250px] truncate whitespace-nowrap ">{item.txz01} </td>
//                   <td className="px-1 py-1 " >{item.Stock_Qty}</td>
//                   <td className="px-1 py-1 ">{item.OrdQty}</td>
//                   <td className="px-1 py-1 ">{item.Cwh_Stock}</td>
                  
//                 {/* <div style="width: 100px;">  */}
//                   <td className="px-1 py-1">{item.std_pr}</td>
//                 {/* </div>   */}
//                   <td className="px-1 py-1">{item.std_pr_qt}</td>
//                   <td className="px-1 py-1">{formatDate(item.std_pr_dt)}</td>
//                   <td className="px-1 py-1">{item.cws_pro_po}</td>
//                   <td className="px-1 py-1">{formatDate(item.pro_po_dt)}</td>
//                   <td className="px-1 py-1">{item.reswk}</td>
//                   <td className="px-1 py-1">{item.pro_po_qt}</td>
//                   <td className="px-1 py-1">{item.gr_pro_po}</td>
//                   <td className="px-1 py-1">{formatDate(item.gr_pro_dt)}</td>
//                   <td className="px-1 py-1">{item.gr_pro_qt}</td>
//                   <td className="px-1 py-1">{item.gr_pro_bt}</td>
//                   <td className="px-1 py-1">{item.sto_po}</td>
//                   <td className="px-1 py-1">{formatDate(item.sto_po_dt)}</td>
//                   <td className="px-1 py-1">{item.bednr}</td>
//                   <td className="px-1 py-1">{item.charg}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}


//        {/* MODAL WITH TABS */}
//        {showChartModal && (
//          <div className="fixed inset-0 z-50 bg-blue-300 bg-opacity-70 flex items-center justify-center p-4">
//            <div className="bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-6xl p-4">
//              {Object.entries(compareData).map(([status, siteGroup]) => (
//                <div key={status} className="mb-8">
//                  <h2 className="text-2xl text-white bg-purple-800 px-4 py-2 rounded font-bold mb-2">Status: {status}</h2>
//                  <div className="flex gap-2 mb-4 flex-wrap">
//                    {Object.keys(siteGroup).map(site => (
//                      <button
//                        key={site}
//                        className={`px-4 py-1 rounded text-sm ${activeTabs[status] === site ? 'bg-blue-700 text-white' : 'bg-gray-200 text-black'}`}
//                        onClick={() => setActiveTabs(prev => ({ ...prev, [status]: site }))}
//                      >
//                        {site}
//                      </button>
//                    ))}
//                  </div>
 
//                  {/* ACTIVE TAB CONTENT */}
//                  <div className="overflow-x-auto">
//                    <table className="min-w-full text-[11px] border-collapse">
//                      <thead className="bg-gray-100 sticky top-0 z-10">
//                        <tr>
//                          <th className="border px-2 py-1">Urgency</th>
//                          <th className="border px-2 py-1">Status</th>
//                          <th className="border px-2 py-1">Material No</th>
//                          <th className="border px-2 py-1">Material Description</th>
//                          <th className="border px-2 py-1 text-right">Total PR Qty</th>
//                        </tr>
//                      </thead>
//                      <tbody>
//                        {Object.entries(siteGroup[activeTabs[status]] || {}).map(([matnr, details], idx) => (
//                          <tr key={matnr} className={idx % 2 === 0 ? 'bg-blue-50' : 'bg-green-50'}>
//                            <td className="px-1 py-1">{details.lurgncy}</td>
//                            <td className="px-1 py-1">{details.lstatus}</td>
//                            <td className="border px-2 py-1">{matnr}</td>
//                            <td className="border px-2 py-1">{details.txz01}</td>
//                            <td className="border px-2 py-1 text-right">{details.totalQty}</td>
//                          </tr>
//                        ))}
//                      </tbody>
//                    </table>
//                  </div>
//                </div>
//              ))}
//              <div className="text-center mt-6">
//                <button
//                  onClick={() => setShowChartModal(false)}
//                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition"
//                >
//                  Close
//                </button>
//              </div>
//            </div>
//          </div>
//        )}
//      </div>
//    );
//  };
 
//  export default SingleSitePrDetail;
 