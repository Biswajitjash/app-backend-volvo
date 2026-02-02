import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { speakFunction } from '../../utils/SpeakFunction';
import { Modal, Card, CardContent, Typography } from "@mui/material";

import SitePrSummary from './SitePrSummary';
import PrShowRowModal from './PrshowRowModal';


const SitePrDetail = () => {
  const [selectedRow,  setSelectedRow] = useState(null);
  const [showRowModal, setShowRowModal] = useState(false);

  const [apiData, setApiData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [visibleRows, setVisibleRows] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [showChartModal, setShowChartModal] = useState(false);
  const [compareData, setCompareData] = useState({});
  const [collapsedSites, setCollapsedSites] = useState({});
  const [fromDate, setFromDate] = useState(() => {
    const today = new Date();
    const past = new Date(today.setDate(today.getDate() - 60));
    return past.toISOString().slice(0, 10);
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [activeTabs, setActiveTabs] = useState({});
  const [showSummary, setShowSummary] = useState(false);

useEffect(() => {
  if (selectedRow) {
    console.log("Updated selected row:", selectedRow);
  }
}, [selectedRow]);



  useEffect(() => {
    speakFunction("Fetching Site PR Details ");

    (async () => {
      try {
        setIsLoading(true);
        const resp = await fetch(`/sap/opu/odata/sap/ZI_EBAN_CDS_CDS/ZI_EBAN_CDS`, {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            Authorization: 'Basic ' + btoa('AMPLCONS:today@02'),
          },
        });
        const json = await resp.json();
        const data = json?.d?.results || [];
        setApiData(data);
        setFilteredData(data);
        setVisibleRows(data.length);
      } catch (err) {
        console.error("Fetch Error:", err);
        setFilteredData([]);
      } finally {
        setIsLoading(false);
        setHasFetched(true);
      }
    })();
  }, []);


  const formatDate = (sapDate) => {
    const match = sapDate?.match(/\d+/);
    return match ? new Date(+match[0]).toLocaleDateString('en-GB') : '';
  };

  const handleExecute = () => {
    const filtered = apiData.filter(item => {
      const match = item.creationdate?.match(/\d+/);
      const ts = match ? parseInt(match[0]) : null;
      const iso = ts ? new Date(ts).toISOString().slice(0, 10) : null;
      if (!iso || iso < fromDate || iso > toDate) return false;
      if (searchQuery.trim()) {
        return Object.values(item).some(val =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return true;
    });
    setFilteredData(filtered);
    setVisibleRows(filtered.length);
  };

  const handleDownloadXls = () => {
    if (filteredData.length === 0) {
      alert("No data available to download.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(filteredData.slice(0, visibleRows));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Filtered_PO_List");
    XLSX.writeFile(wb, "Filtered_PO_List.xlsx");
  };

  const handleCompare = () => {
    const grouped = {};

    filteredData.forEach(item => {
      const status = item.Status || 'Unknown';
      const site = item.site_plant || 'Unknown';
      const matnr = item.matnr;
      const totalstock = item.Stock_Qty;
      const qty = parseFloat(item.OrdQty || 0);
      const desc = item.txz01 || '';
      const lurgncy = item.prio_urg;

      if (!grouped[status]) grouped[status] = {};
      if (!grouped[status][site]) grouped[status][site] = {};

      if (!grouped[status][site][matnr]) {
        grouped[status][site][matnr] = {
          matnr: matnr,
          lstatus: status,
          lsite: site,
          lurgncy,
          txz01: desc,
          totalStockQty: totalstock,
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
    //  setShowChartModal(true);
    setShowSummary(true);

  };

  if (showSummary) {
    return < SitePrSummary
      rowData={filteredData}
      compareData={compareData}
      onactiveTab={activeTabs}
      onBack={() => setShowSummary(false)} />;
  }


 const handleRowClick = (row) => {
    setSelectedRow(row);
  setShowRowModal(true);
  console.log(" Row:", row); // Correct way
  // console.log("SelectedRow:", selectedRow); // Correct way
  };

  const handleCloseModal = () => {
    // alert('Close');
    setShowRowModal(false);
    setSelectedRow(null);
  };


  return (
    <div className="p-2  font-sans text-xs bg-black min-h-screen w-full rounded">
      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-green-500 flex flex-wrap items-center gap-2 px-3 py-2">
        <h2 className="text-lg font-semibold text-white">
          Site PR List
          <span className="text-sm font-bold ml-2">
            ({Math.min(visibleRows, filteredData.length)} of {apiData.length})
          </span>
        </h2>
        <button onClick={handleDownloadXls}
          className="ml-4 bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded text-sm font-semibold shadow">
          Xls Download
        </button>
        <button onClick={handleCompare}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm font-semibold shadow">
          Compare
        </button>
        <input type="text" placeholder="Search..."
          className="ml-auto w-40 p-1 rounded border border-white text-white bg-black text-sm"
          value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        <label className="text-white text-sm">From</label>
        <input type="date" className="text-sm px-2 p-0 bg-black rounded border border-gray-300 text-white"
          value={fromDate} max={toDate} onChange={e => setFromDate(e.target.value)} />
        <label className="text-white text-sm">To</label>
        <input type="date" className="text-sm px-2 p-0 bg-black rounded border border-gray-300 text-white"
          value={toDate} min={fromDate} onChange={e => setToDate(e.target.value)} />
        <button onClick={handleExecute}
          className="flex items-center gap-1 bg-white text-green-700 px-2 py-1 rounded hover:bg-yellow-500 transition">
          ▶️
        </button>
      </div>

      {/* LOADING OR EMPTY STATE */}
      {isLoading ? (
        <p className="moving-text">Please wait... Fetching data from API.</p>
      ) : hasFetched && filteredData.length === 0 ? (
        <p className="text-red-500 text-center mt-4 text-sm font-semibold animate-pulse">No data to display.</p>
      ) : (
        <div className="max-h-[600px] mt-2  rounded border border-green-500 shadow-sm">
          <table className="min-w-full  text-[11px] border-collapse">
            <thead className="bg-blue-500 text-white sticky top-0 z-10">
              <tr>
                {[
                  "Ugncy", "Status", "Delay", "PR Number", "Line", "PR Date", "PRSite",
                  "Material No", "Descriptions", "StkQty", "ReqQty", "CwhStock", "MTD",
                  "StdPR No", "Qty", "SPRDate", "Pro PO No", "PO Date", "PO Plant",
                  "Pro Qty", "GRN No", "GR Date", "GR Qty", "GR Batch",
                  "MTD2", "Sto_Po_No", "Sto_Date", "OB-DelNo", "OB-Batch"
                ].map((header, index) => (
                  <th
                    key={index}
                    className="px-1 py-1 border text-center whitespace-nowrap"
                    scope="col"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData
                .slice(0, visibleRows)
                .sort((a, b) => {
                  if (a.banfn < b.banfn) return 1;
                  if (a.banfn > b.banfn) return -1;
                  if (a.bnfpo < b.bnfpo) return -1;
                  if (a.bnfpo > b.bnfpo) return 1;
                  return 0;
                }).map((item, idx) => (

                  <tr key={item.banfn + idx}
                    className={`${idx % 2 === 0 ? 'bg-white' : 'bg-blue-200'} hover:bg-yellow-200 cursor-pointer`}
                    onClick={ () => handleRowClick(item) } >

                    <td className="px-1 py-1">{item.prio_urg}</td>
                    <td className="px-1 py-1">{item.Status}</td>
                    <td className="px-1 py-1">{item.Delay}</td>
                    <td className="px-1 py-1 text-red-600 font-bold text-center">{item.banfn}</td>
                    <td className="px-1 py-1">{item.bnfpo}</td>
                    <td className="px-1 py-1">{formatDate(item.creationdate)}</td>
                    <td className="px-1 py-1">{item.site_plant}</td>
                    <td className="px-1 py-1">{item.matnr}</td>
                    <td className="px-1 py-2 max-w-[250px] truncate whitespace-nowrap ">{item.txz01} </td>
                    <td className="px-1 py-1 " >{item.Stock_Qty}</td>
                    <td className="px-1 py-1 ">{item.OrdQty}</td>
                    <td className="px-1 py-1 ">{item.Cwh_Stock}</td>

                    <td className="px-1 py-1 text-red-500">{item.MTD}</td>

                    <td className="px-1 py-1">{item.std_pr}</td>
                    <td className="px-1 py-1">{item.std_pr_qt}</td>
                    <td className="px-1 py-1">{formatDate(item.std_pr_dt)}</td>
                    <td className="px-1 py-1">{item.cws_pro_po}</td>
                    <td className="px-1 py-1">{formatDate(item.pro_po_dt)}</td>
                    <td className="px-1 py-1">{item.reswk}</td>
                    <td className="px-1 py-1">{item.pro_po_qt}</td>
                    <td className="px-1 py-1">{item.gr_pro_po}</td>
                    <td className="px-1 py-1">{formatDate(item.gr_pro_dt)}</td>
                    <td className="px-1 py-1">{item.gr_pro_qt}</td>
                    <td className="px-1 py-1">{item.gr_pro_bt}</td>

                    <td className="px-1 py-1 text-red-500">{item.MTD2}</td>
                    
                    <td className="px-1 py-1">{item.sto_po}</td>
                    <td className="px-1 py-1">{formatDate(item.sto_po_dt)}</td>
                    <td className="px-1 py-1">{item.bednr}</td>
                    <td className="px-1 py-1">{item.charg}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL WITH TABS */}
      {showChartModal && (
        <div className="fixed inset-0 z-50 bg-blue-300 bg-opacity-70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-6xl p-4">
            {Object.entries(compareData).map(([status, siteGroup]) => (
              <div key={status} className="mb-8">
                <h2 className="text-2xl text-white bg-purple-800 px-4 py-2 rounded font-bold mb-2">Status: {status}</h2>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {Object.keys(siteGroup).map(site => (
                    <button
                      key={site}
                      className={`px-4 py-1 rounded text-sm ${activeTabs[status] === site ? 'bg-blue-700 text-white' : 'bg-gray-200 text-black'}`}
                      onClick={() => setActiveTabs(prev => ({ ...prev, [status]: site }))}
                    >
                      {site}
                    </button>
                  ))}
                </div>

                {/* ACTIVE TAB CONTENT */}
                <div className="overflow-x-auto">
                  <table className="min-w-full text-[11px] border-collapse">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                      <tr>
                        <th className="border px-2 py-1">Urgency</th>
                        <th className="border px-2 py-1">Status</th>
                        <th className="border px-2 py-1">Material No</th>
                        <th className="border px-2 py-1">Material Description</th>
                        <th className="border px-2 py-1 text-right">Total PR Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(siteGroup[activeTabs[status]] || {}).map(([matnr, details], idx) => (
                        <tr key={matnr} className={idx % 2 === 0 ? 'bg-blue-50' : 'bg-green-50'}>
                          <td className="px-1 py-1">{details.lurgncy}</td>
                          <td className="px-1 py-1">{details.lstatus}</td>
                          <td className="border px-2 py-1">{matnr}</td>
                          <td className="border px-2 py-1">{details.txz01}</td>
                          <td className="border px-2 py-1 text-right">{details.totalQty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            <div className="text-center mt-6">
              <button
                onClick={() => setShowChartModal(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

       {showRowModal && selectedRow && (
         <PrShowRowModal
           open={showRowModal}
           onClose={handleCloseModal}
           clickedRow={selectedRow}
           
         />
       )}

  
      {/* {showRowModal && selectedRow && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-2xl p-6 overflow-y-auto max-h-[80vh]">
            <h2 className="text-lg font-bold text-center mb-4 text-blue-600">
              Row Detail View – PR No: {selectedRow.banfn}
            </h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(selectedRow).map(([key, value]) => (
                <div key={key} className="border-b py-1 flex justify-between">
                  <span className="font-medium text-gray-600">{key}</span>
                  <span className="text-right text-gray-900">{String(value)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowRowModal(false)}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )} */}


    </div>
  );
};

export default SitePrDetail;
