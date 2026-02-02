import React, { useState } from 'react';
import { PlusCircle, Trash2, ShoppingCart, CheckCircle } from "react-feather";
import { buildPrPayload } from "../../utils/buildPrPayload";

const siteColors = ['bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-pink-200', 'bg-gray-200'];

const SitePrSummary = ({ rowData, compareData, onactiveTab, onBack }) => {
  const [activeTabs, setActiveTabs] = useState(onactiveTab || {});
  const [activeStatus, setActiveStatus] = useState(Object.keys(compareData)[0] || '');
  const [activePrioUrg, setActivePrioUrg] = useState('');
  const [isShowHeader, setShowHeader] = useState(true);
  const [cart, setCart] = useState([]);
  const [isShowCartDetails, setShowCartDetails] = useState(true);
  const [rowFilteredData, setRowFilteredData] = useState({});

  console.log("rowData", rowData);

  const urgencyLabels = {
    '00': 'Normal', '51': 'Urgent', '52': 'Accidental', '53': 'Breakdown',
    '54': 'Refurbishment', '55': 'Preventive', '56': 'Standard', '57': 'Sales',
    '58': 'Replacement', '59': 'Import',
  };

  const handleSiteTabClick = (status, site) => {
    setActiveTabs(prev => ({ ...prev, [status]: site }));
    const allPrioUrgs = [...new Set(Object.values(compareData[status]?.[site] || {}).map(e => e.lurgncy || ''))];
    setActivePrioUrg(allPrioUrgs[0] || '');
  };

  const currentData = compareData[activeStatus]?.[activeTabs[activeStatus]] || {};
  const prioUrgList = [...new Set(Object.values(currentData).map(d => d.lurgncy || ''))];

  // ----------------- Cart functions -----------------
  const addToCart = (item, matnr, site, status, fullRowData) => {
    setCart(prev => {
      if (prev.find(i => i.id === item.id)) return prev;
      return [...prev, { ...item }];
    });

    // Add related rows to rowFilteredData (merge)
    setRowFilteredData(prev => {
      const filtered = Object.entries(fullRowData || {})
        .filter(([_, d]) => d.matnr === matnr && (d.site_plant === site || d.lsite === site) && d.Status === status)
        .reduce((acc, [key, val]) => {
          acc[key] = val;
          return acc;
        }, {});
      return { ...prev, ...filtered };
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));

    // Remove associated rowFilteredData entries whose matnr@site matches id
    setRowFilteredData(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        const val = updated[key];
        // support either site_plant or lsite in row objects
        const valSite = val.site_plant || val.lsite || '';
        const valId = `${val.matnr}@${valSite}`;
        if (valId === id) delete updated[key];
      });
      return updated;
    });
  };

  const isInCart = (id) => cart.some(i => i.id === id);

  // ----------------- Consolidated PR -----------------
  const onConsolidatedPr = (cartItems) => {
    if (!cartItems || cartItems.length === 0) {
      alert("Cart is empty.");
      return;
    }
    if (!window.confirm(`Create consolidated PR for ${cartItems.length} items?`)) return;

    try {
      const payload = buildPrPayload(cartItems, {
        docType: "ZNB1",
        purchGroup: "110",
        companyCode: "3100"
      });

      fetch("/sap/opu/odata/sap/ZPR_CREATE_SRV/PRSet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(response => {
          console.log("PR Created:", response);
          alert("Cart PR Created Successfully");
          // optional: clear cart after success
          // setCart([]);
          // setRowFilteredData({});
        })
        .catch(err => {
          console.error("Error creating Cart PR:", err);
          alert("Failed to create Cart PR");
        });
    } catch (err) {
      alert(err.message);
    }
  };

  // ----------------- Linewise PR -----------------
  const onLinewisePr = (data) => {
    const count = Object.keys(data || {}).length;
    if (count === 0) {
      alert("No line data available.");
      return;
    }
    if (!window.confirm(`Create linewise PR for ${count} lines?`)) return;

    try {
      const items = Object.values(data);
      const payload = buildPrPayload(items, {
        docType: "ZNB1",
        purchGroup: "110",
        companyCode: "3100"
      });

      fetch("/sap/opu/odata/sap/ZPR_CREATE_SRV/PRSet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
        .then(response => {
          console.log("PR Created:", response);
          alert("Linewise PR Created Successfully");
          // optional: clear rowFilteredData after success
          // setRowFilteredData({});
        })
        .catch(err => {
          console.error("Error creating PR:", err);
          alert("Failed to create Linewise PR");
        });
    } catch (err) {
      alert(err.message);
    }
  };

  // ----------------- JSX (responsive) -----------------
  return (
    <div className="fixed inset-0 z-50 bg-blue-300">
      <div className="bg-white w-full h-full overflow-hidden shadow-xl flex flex-col">

        {/* Header */}
        <div className="bg-purple-700 text-white px-2 py-1 flex flex-wrap justify-between items-center gap-2">
          <h2 className="text-base sm:text-lg font-bold">
            Summary of : <span className="underline">{activeStatus} Site PR</span>
          </h2>

          {/* Site tabs (scrollable on small screens) */}
          <div className="flex overflow-x-auto gap-2">
            {Object.keys(compareData[activeStatus] || {}).map(site => (
              <button
                key={site}
                onClick={() => handleSiteTabClick(activeStatus, site)}
                className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium shadow ${activeTabs[activeStatus] === site ? 'bg-green-400 text-white' : 'bg-gray-200 text-black'}`}
              >
                {site}
              </button>
            ))}
          </div>

          {/* Status tabs */}
          <div className="flex gap-2 flex-wrap">
            {Object.keys(compareData || {}).map(status => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow ${activeStatus === status ? 'bg-yellow-400 text-black' : 'bg-white text-purple-900'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Content: table(s) + cart */}
        {isShowHeader && (
          <div className="flex flex-col md:flex-row gap-2 px-1 mt-1 pb-16 overflow-auto">

            {/* Main Table (flex-1) */}
            <div className="flex-1 overflow-auto border border-gray-300">
              <div className="min-w-full overflow-x-auto">
                <table className="table-auto text-[10px] sm:text-xs md:text-sm  border-collapse w-full min-w-[680px]">
                  <thead className="bg-blue-500 text-white sticky top-0 z-20">
                    <tr>
                      <th className="border px-1">Urgency</th>
                      <th className="border px-1">Status</th>
                      <th className="border px-1">Material No</th>
                      <th className="border px-1">Site</th>
                      <th className="border px-1">Material Description</th>
                      <th className="border px-1 text-right">Stock Qty</th>
                      <th className="border px-1 text-right">Total PR Qty</th>
                      <th className="border px-1 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(currentData || {})
                      .filter(([_, details]) => !activePrioUrg || details.lurgncy === activePrioUrg)
                      .map(([matnr, details], idx) => {
                        const itemId = details.matnr + '@' + details.lsite;
                        const inCart = isInCart(itemId);
                        return (
                          <tr key={matnr} className={`${siteColors[idx % siteColors.length]} ${inCart ? 'bg-gray-300' : ''} hover:bg-yellow-100`}>
                            <td className="px-1 border">{urgencyLabels[details.lurgncy] || details.lurgncy}</td>
                            <td className="px-1 border">{details.lstatus}</td>
                            <td className="px-1 border font-semibold">{details.matnr}</td>
                            <td className="px-1 border font-semibold">{details.lsite}</td>
                            <td className="px-1 border">{details.txz01}</td>
                            <td className="px-1 text-sm border text-right">{details.totalStockQty}</td>
                            <td className="px-1 text-sm border text-right">{details.totalQty}</td>
                            <td className="px-1 border text-center">
                              <button
                                onClick={() => addToCart({
                                  id: itemId,
                                  matnr: details.matnr,
                                  site: details.lsite,
                                  itemtext: details.txz01,
                                  prqty: details.totalQty,
                                  status: details.lstatus
                                }, details.matnr, activeTabs[activeStatus], details.lstatus, rowData)}
                                disabled={inCart}
                                className={`hover:text-blue-800 ${inCart ? 'text-green-600 cursor-default' : 'text-blue-600'}`}
                                title={inCart ? 'Added' : 'Add to cart'}
                              >
                                {inCart ? <CheckCircle size={16} /> : <PlusCircle size={16} />}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* ---------------- Linewise PR Section (kept exactly as you provided, made responsive) ---------------- */}
              {isShowCartDetails && Object.keys(rowFilteredData).length > 0 && (
                <div className="mt-0 px-1">
                  <p className="text-[10px] font-bold text-sm text-red-500">
                    PR Line Wise Details ({Object.keys(rowFilteredData).length})
                  </p>

                  <div className="flex mt-0 h-55 w-full overflow-auto border border-red-300">
                    <div className="min-w-full overflow-x-auto">
                      <table className="table-auto text-[10px] font-semibold border-collapse min-w-[600px] w-full">
                        <thead className="bg-purple-500 text-white sticky top-0 z-20">
                          <tr>
                            <th className="px-2">Urgency</th>
                            <th className="px-2">Status</th>
                            <th className="px-2">PR Number</th>
                            <th className="px-2">PR Line</th>
                            <th className="px-2">Material No</th>
                            <th className="px-2">Material Description</th>
                            <th className="px-2 text-right">Stock Qty</th>
                            <th className="px-2 text-right">PR Qty</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(rowFilteredData).map(([matnr, details], idx) => (
                            <tr key={matnr} className={`${siteColors[idx % siteColors.length]} hover:bg-yellow-100`}>
                              <td className="px-2 border">{urgencyLabels[details.prio_urg] || details.prio_urg}</td>
                              <td className="px-2 border">{details.Status}</td>
                              <td className="px-2 border">{details.banfn}</td>
                              <td className="px-2 border">{details.bnfpo}</td>
                              <td className="px-2 border font-semibold">{details.matnr}</td>
                              <td className="px-2 border">{details.txz01}</td>
                              <td className="px-2 text-sm border text-right">{details.Stock_Qty}</td>
                              <td className="px-2 text-sm border text-right">{details.OrdQty}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              {/* ---------------- end Linewise PR Section ---------------- */}

            </div>

            {/* Cart (right on desktop, stacked on mobile) */}
            <div className="p-2 w-full md:w-1/3 text-xs sm:text-sm overflow-auto border shadow bg-gray-100">
              <h2 className="text-sm sm:text-base font-bold mb-3 flex justify-between items-center">
                Cart
                <div className="relative flex items-center">
                  {cart.length > 0 && (
                    <>
                      <ShoppingCart size={42} className="text-green-400" />
                      <button
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full cursor-pointer"
                        title="Make Consolidated PR"
                        onClick={() => onConsolidatedPr(cart)}
                      >
                        {cart.length}
                      </button>
                    </>
                  )}
                </div>
              </h2>

              <ul className="space-y-2">
                {cart.map(item => (
                  <li key={item.id} className="flex flex-wrap items-center gap-2 border-t pt-1">
                    <span className="flex-[1_1_120px] text-blue-500">{item.matnr}</span>
                    <span className="flex-[1_1_80px]">{item.site}</span>
                    <span className="flex-[2_1_160px] text-blue-500">{item.itemtext}</span>
                    <span className="flex-[1_1_80px]">{item.status}</span>
                    <span className="flex-[0_0_40px] text-right">{item.prqty}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-purple-700 p-2 flex flex-wrap justify-between items-center gap-2 z-50">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={onBack} className="bg-red-600 px-3 py-1 rounded-full text-white text-xs sm:text-sm">
              ← Back
            </button>
            {prioUrgList.map(prio => (
              <button
                key={prio}
                onClick={() => setActivePrioUrg(prio)}
                className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${prio === activePrioUrg ? 'bg-yellow-400 text-black' : 'bg-green-400 text-black'}`}
              >
                {urgencyLabels[prio] || prio || 'Unknown'}
              </button>
            ))}
          </div>

          <div>
            {Object.keys(rowFilteredData).length > 0 && (
              <button
                className="px-3 py-1 bg-green-500 rounded-lg text-xs sm:text-sm text-white"
                onClick={() => onLinewisePr(rowFilteredData)}
                title="Create Line by Line PR"
              >
                Create Standard PR ({Object.keys(rowFilteredData).length})
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SitePrSummary;



// import React, { useState } from 'react';
// import { PlusCircle, Trash2, ShoppingCart, CheckCircle } from "react-feather";
// import { buildPrPayload } from "../../utils/buildPrPayload";

// const siteColors = ['bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-pink-200', 'bg-gray-200'];

// const SitePrSummary = ({ rowData, compareData, onactiveTab, onBack }) => {
//   const [activeTabs, setActiveTabs] = useState(onactiveTab || {});
//   const [activeStatus, setActiveStatus] = useState(Object.keys(compareData)[0] || '');
//   const [activePrioUrg, setActivePrioUrg] = useState('');
//   const [isShowHeader, setShowHeader] = useState(true);
//   const [cart, setCart] = useState([]);
//   const [isShowCartDetails, setShowCartDetails] = useState(true);
//   const [rowFilteredData, setRowFilteredData] = useState({});

//   const urgencyLabels = {
//     '00': 'Normal', '51': 'Urgent', '52': 'Accidental', '53': 'Breakdown',
//     '54': 'Refurbishment', '55': 'Preventive', '56': 'Standard', '57': 'Sales',
//     '58': 'Replacement', '59': 'Import',
//   };

//   const handleSiteTabClick = (status, site) => {
//     setActiveTabs(prev => ({ ...prev, [status]: site }));
//     const allPrioUrgs = [...new Set(Object.values(compareData[status]?.[site] || {}).map(e => e.lurgncy || ''))];
//     setActivePrioUrg(allPrioUrgs[0] || '');
//   };

//   const currentData = compareData[activeStatus]?.[activeTabs[activeStatus]] || {};
//   const prioUrgList = [...new Set(Object.values(currentData).map(d => d.lurgncy || ''))];

//   // Cart functions
//   const addToCart = (item, matnr, site, status, rowData) => {
//     setCart(prev => {
//       if (prev.find(i => i.id === item.id)) return prev;
//       return [...prev, { ...item }];
//     });

//     setRowFilteredData(prev => {
//       const filtered = Object.entries(rowData)
//         .filter(([_, d]) => d.matnr === matnr && d.site_plant === site && d.Status === status)
//         .reduce((acc, [key, val]) => {
//           acc[key] = val;
//           return acc;
//         }, {});
//       return { ...prev, ...filtered };
//     });
//   };

//   const removeFromCart = (id) => {
//     setCart(prev => prev.filter(i => i.id !== id));
//     setRowFilteredData(prev => {
//       const updated = { ...prev };
//       Object.keys(updated).forEach(key => {
//         const val = updated[key];
//         const valId = val.matnr + '@' + val.site_plant;
//         if (valId === id) delete updated[key];
//       });
//       return updated;
//     });
//   };

//   const isInCart = (id) => cart.some(i => i.id === id);

//   const onConsolidatedPr = (cartItems) => {
//     try {
//       const payload = buildPrPayload(cartItems, {
//         docType: "ZNB1",
//         purchGroup: "110",
//         companyCode: "3100"
//       });
//       console.log("Cart PR Payload:", payload);
//       fetch("/sap/opu/odata/sap/ZPR_CREATE_SRV/PRSet", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       })
//         .then(res => res.json())
//         .then(response => {
//           alert("Cart PR Created Successfully");
//         })
//         .catch(() => alert("Failed to create Cart PR"));
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const onLinewisePr = (data) => {
//     try {
//       const items = Object.values(data);
//       const payload = buildPrPayload(items, {
//         docType: "ZNB1",
//         purchGroup: "110",
//         companyCode: "3100"
//       });
//       console.log("Linewise PR Payload:", payload);
//       fetch("/sap/opu/odata/sap/ZPR_CREATE_SRV/PRSet", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       })
//         .then(res => res.json())
//         .then(response => {
//           alert("Linewise PR Created Successfully");
//         })
//         .catch(() => alert("Failed to create Linewise PR"));
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-blue-300">
//       <div className="bg-white w-full h-full overflow-hidden shadow-xl flex flex-col">

//         {/* Header */}
//         <div className="bg-purple-700 text-white px-2 py-1 flex flex-wrap justify-between items-center gap-2">
//           <h2 className="text-sm sm:text-lg font-bold">
//             Summary of : <span className="underline">{activeStatus} Site PR</span>
//           </h2>

//           <div className="flex overflow-x-auto gap-2">
//             {Object.keys(compareData[activeStatus]).map(site => (
//               <button
//                 key={site}
//                 onClick={() => handleSiteTabClick(activeStatus, site)}
//                 className={`px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium 
//                   shadow ${activeTabs[activeStatus] === site ? 'bg-green-400 text-white' : 'bg-gray-200 text-black'}`}
//               >
//                 {site}
//               </button>
//             ))}
//           </div>

//           <div className="flex gap-2">
//             {Object.keys(compareData).map(status => (
//               <button
//                 key={status}
//                 onClick={() => setActiveStatus(status)}
//                 className={`px-4 py-1 rounded-full font-semibold text-xs sm:text-sm shadow 
//                   ${activeStatus === status ? 'bg-yellow-400 text-black' : 'bg-white text-purple-900'}`}
//               >
//                 {status}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Table Section */}
//         {isShowHeader && (
//           <div className="flex flex-col md:flex-row px-1 gap-2 mt-1 pb-20 overflow-auto">

//             {/* Main Table */}
//             <div className="flex-1 overflow-auto border border-gray-300">
//               <table className="table-auto text-[10px] sm:text-xs md:text-sm font-semibold border-collapse w-full">
//                 <thead className="bg-blue-500 text-white sticky top-0 z-20">
//                   <tr>
//                     <th className="border px-1">Urgency</th>
//                     <th className="border px-1">Status</th>
//                     <th className="border px-1">Material</th>
//                     <th className="border px-1">Site</th>
//                     <th className="border px-1">Description</th>
//                     <th className="border px-1 text-right">Stock Qty</th>
//                     <th className="border px-1 text-right">Total PR Qty</th>
//                     <th className="border px-1 text-center">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Object.entries(currentData)
//                     .filter(([_, d]) => !activePrioUrg || d.lurgncy === activePrioUrg)
//                     .map(([matnr, details], idx) => {
//                       const itemId = details.matnr + '@' + details.lsite;
//                       const inCart = isInCart(itemId);
//                       return (
//                         <tr key={matnr} className={`${siteColors[idx % siteColors.length]} ${inCart ? 'bg-gray-300' : ''}`}>
//                           <td className="px-1 border">{urgencyLabels[details.lurgncy] || details.lurgncy}</td>
//                           <td className="px-1 border">{details.lstatus}</td>
//                           <td className="px-1 border">{details.matnr}</td>
//                           <td className="px-1 border">{details.lsite}</td>
//                           <td className="px-1 border">{details.txz01}</td>
//                           <td className="px-1 border text-right">{details.totalStockQty}</td>
//                           <td className="px-1 border text-right">{details.totalQty}</td>
//                           <td className="px-1 border text-center">
//                             <button
//                               onClick={() => addToCart({
//                                 id: itemId,
//                                 matnr: details.matnr,
//                                 site: details.lsite,
//                                 itemtext: details.txz01,
//                                 prqty: details.totalQty,
//                                 status: details.lstatus
//                               }, details.matnr, activeTabs[activeStatus], details.lstatus, rowData)}
//                               disabled={inCart}
//                               className={`hover:text-blue-800 ${inCart ? 'text-green-600 cursor-default' : 'text-blue-600'}`}
//                             >
//                               {inCart ? <CheckCircle size={16} /> : <PlusCircle size={16} />}
//                             </button>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                 </tbody>
//               </table>
//             </div>



//             {/* Cart */}
//             <div className="p-2 w-full md:w-1/3 text-xs sm:text-sm overflow-auto border shadow bg-gray-100">
//               <h2 className="text-sm sm:text-base font-bold mb-3 flex justify-between items-center">
//                 Cart
//                 {cart.length > 0 && (
//                   <div className="relative flex items-center">
//                     <ShoppingCart size={32} className="text-green-400" />
//                     <span
//                       className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full cursor-pointer"
//                       onClick={() => onConsolidatedPr(cart)}
//                     >
//                       {cart.length}
//                     </span>
//                   </div>
//                 )}
//               </h2>

//               <ul className="space-y-1">
//                 {cart.map(item => (
//                   <li key={item.id} className="flex flex-wrap items-center gap-2 border-t pt-1">
//                     <span className="flex-1 text-blue-500">{item.matnr}</span>
//                     <span className="flex-1">{item.site}</span>
//                     <span className="flex-1">{item.itemtext}</span>
//                     <span className="text-xs">{item.status}</span>
//                     <span className="text-xs">{item.prqty}</span>
//                     <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:text-red-800">
//                       <Trash2 size={16} />
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}

//         {/* Footer */}
//         <div className="fixed bottom-0 w-full bg-purple-700 p-1 flex flex-wrap justify-between items-center gap-2">
//           <div className="flex flex-wrap gap-2">
//             <button onClick={onBack} className="bg-red-600 px-4 py-1 rounded-full text-white text-xs sm:text-sm">
//               ← Back
//             </button>
//             {prioUrgList.map(prio => (
//               <button
//                 key={prio}
//                 onClick={() => setActivePrioUrg(prio)}
//                 className={`px-4 py-1 rounded-full text-xs sm:text-sm font-medium 
//                   ${prio === activePrioUrg ? 'bg-yellow-400 text-black' : 'bg-green-400 text-black'}`}
//               >
//                 {urgencyLabels[prio] || prio}
//               </button>
//             ))}
//           </div>

//           {Object.keys(rowFilteredData).length > 0 && (
//             <button
//               className="px-3 py-1 bg-green-500 rounded-lg text-xs sm:text-sm text-white"
//               onClick={() => onLinewisePr(rowFilteredData)}
//             >
//               Create Standard PR ({Object.keys(rowFilteredData).length})
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SitePrSummary;























// import React, { useState } from 'react';
// import { PlusCircle, Trash2, ShoppingCart, CheckCircle } from "react-feather";
// import { buildPrPayload } from "../../utils/buildPrPayload";

// const siteColors = ['bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-pink-200', 'bg-gray-200'];

// const SitePrSummary = ({ rowData, compareData, onactiveTab, onBack }) => {
//   const [activeTabs, setActiveTabs] = useState(onactiveTab || {});
//   const [activeStatus, setActiveStatus] = useState(Object.keys(compareData)[0] || '');
//   const [activePrioUrg, setActivePrioUrg] = useState('');
//   const [isShowHeader, setShowHeader] = useState(true);
//   const [cart, setCart] = useState([]);
//   const [isShowCartDetails, setShowCartDetails] = useState(true);
//   const [rowFilteredData, setRowFilteredData] = useState({});

//   const urgencyLabels = {
//     '00': 'Normal', '51': 'Urgent', '52': 'Accidental', '53': 'Breakdown',
//     '54': 'Refurbishment', '55': 'Preventive', '56': 'Standard', '57': 'Sales',
//     '58': 'Replacement', '59': 'Import',
//   };

//   const handleSiteTabClick = (status, site) => {
//     setActiveTabs(prev => ({ ...prev, [status]: site }));
//     const allPrioUrgs = [...new Set(Object.values(compareData[status]?.[site] || {}).map(e => e.lurgncy || ''))];
//     setActivePrioUrg(allPrioUrgs[0] || '');
//   };

//   const currentData = compareData[activeStatus]?.[activeTabs[activeStatus]] || {};
//   const prioUrgList = [...new Set(Object.values(currentData).map(d => d.lurgncy || ''))];

//   // 🔹 Cart Functions
//   const addToCart = (item, matnr, site, status, rowData) => {
//     setCart(prev => {
//       if (prev.find(i => i.id === item.id)) return prev;
//       return [...prev, { ...item }];
//     });

//     setRowFilteredData(prev => {
//       const filtered = Object.entries(rowData)
//         .filter(([_, d]) => d.matnr === matnr && d.site_plant === site && d.Status === status)
//         .reduce((acc, [key, val]) => {
//           acc[key] = val;
//           return acc;
//         }, {});
//       return { ...prev, ...filtered };
//     });
//   };

//   const removeFromCart = (id) => {
//     setCart(prev => prev.filter(i => i.id !== id));
//     setRowFilteredData(prev => {
//       const updated = { ...prev };
//       Object.keys(updated).forEach(key => {
//         const val = updated[key];
//         const valId = val.matnr + '@' + val.site_plant;
//         if (valId === id) {
//           delete updated[key];
//         }
//       });
//       return updated;
//     });
//   };

//   const isInCart = (id) => cart.some(i => i.id === id);

//   // 🔹 Consolidated PR
//   const onConsolidatedPr = (cartItems) => {
//     if (!window.confirm("Are you sure you want to create a Consolidated PR?")) return;

//     try {
//       const payload = buildPrPayload(cartItems, {
//         docType: "ZNB1",
//         purchGroup: "110",
//         companyCode: "3100"
//       });

//       fetch("/sap/opu/odata/sap/ZPR_CREATE_SRV/PRSet", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       })
//         .then(res => res.json())
//         .then(response => {
//           alert("Cart PR Created Successfully: " + JSON.stringify(response));
//         })
//         .catch(err => {
//           alert("Failed to create Cart PR");
//         });
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   // 🔹 Linewise PR
//   const onLinewisePr = (data) => {
//     if (!window.confirm("Are you sure you want to create Linewise PRs?")) return;

//     try {
//       const items = Object.values(data);
//       const payload = buildPrPayload(items, {
//         docType: "ZNB1",
//         purchGroup: "110",
//         companyCode: "3100"
//       });

//       fetch("/sap/opu/odata/sap/ZPR_CREATE_SRV/PRSet", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       })
//         .then(res => res.json())
//         .then(response => {
//           alert("Linewise PR Created Successfully: " + JSON.stringify(response));
//         })
//         .catch(err => {
//           alert("Failed to create Linewise PR");
//         });
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-blue-300">
//       <div className="bg-white w-full h-full overflow-hidden shadow-xl flex flex-col">

//         {/* 🔹 Header */}
//         <div className="bg-purple-700 text-white px-2 py-0 flex flex-wrap justify-between items-center">
//           <h2 className="text-lg font-bold">
//             Summary of : <span className="underline">{activeStatus} Site PR</span>
//           </h2>

//           {/* Site Tabs */}
//           <div className="flex flex-wrap overflow-x-auto justify-center gap-2">
//             {Object.keys(compareData[activeStatus]).map(site => (
//               <button
//                 key={site}
//                 onClick={() => handleSiteTabClick(activeStatus, site)}
//                 className={`px-4 py-0 rounded-full text-sm font-medium shadow-xl 
//                   ${activeTabs[activeStatus] === site ? 'bg-green-400 blink text-white' : 'bg-gray-200 text-black'}`}
//               >
//                 {site}
//               </button>
//             ))}
//           </div>

//           {/* Status Tabs */}
//           <div className="flex gap-3 flex-wrap">
//             {Object.keys(compareData).map(status => (
//               <button
//                 key={status}
//                 onClick={() => setActiveStatus(status)}
//                 className={`px-6 py-0 rounded-full font-semibold text-sm shadow 
//                   ${activeStatus === status ? 'bg-yellow-400 blink text-black' : 'bg-white text-purple-900'}`}
//               >
//                 {status}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* 🔹 Content Area */}
//         {isShowHeader && (
//           <div className="flex flex-col md:flex-row gap-2 px-1 mt-1 overflow-auto pb-12">

//             {/* Data Table */}
//             <div className="flex-1">
//               <div className="h-85 mt-0 border border-gray-300 overflow-auto">
//                 <table className="table-auto text-[10px] font-semibold border-collapse w-full min-w-[600px]">
//                   <thead className="bg-blue-500 text-white sticky top-0 z-20">
//                     <tr>
//                       <th className="border px-1">Urgency</th>
//                       <th className="border px-1">Status</th>
//                       <th className="border px-1">Material No</th>
//                       <th className="border px-1">Site</th>
//                       <th className="border px-1">Material Description</th>
//                       <th className="border px-1 text-right">Stock Qty</th>
//                       <th className="border px-1 text-right">Total PR Qty</th>
//                       <th className="border px-1 text-center">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {Object.entries(currentData)
//                       .filter(([_, details]) => !activePrioUrg || details.lurgncy === activePrioUrg)
//                       .map(([matnr, details], idx) => {
//                         const itemId = details.matnr + '@' + details.lsite;
//                         const inCart = isInCart(itemId);
//                         return (
//                           <tr key={matnr} className={`${siteColors[idx % siteColors.length]} ${inCart ? 'bg-gray-300' : ''} hover:bg-yellow-100`}>
//                             <td className="px-1 border">{urgencyLabels[details.lurgncy] || details.lurgncy}</td>
//                             <td className="px-1 border">{details.lstatus}</td>
//                             <td className="px-1 border font-semibold">{details.matnr}</td>
//                             <td className="px-1 border font-semibold">{details.lsite}</td>
//                             <td className="px-1 border">{details.txz01}</td>
//                             <td className="px-1 text-sm border text-right">{details.totalStockQty}</td>
//                             <td className="px-1 text-sm border text-right">{details.totalQty}</td>
//                             <td className="px-1 border text-center">
//                               <button
//                                 onClick={() => addToCart({
//                                   id: itemId,
//                                   matnr: details.matnr,
//                                   site: details.lsite,
//                                   itemtext: details.txz01,
//                                   prqty: details.totalQty,
//                                   status: details.lstatus
//                                 }, details.matnr, activeTabs[activeStatus], details.lstatus, rowData)}
//                                 disabled={inCart}
//                                 className={`hover:text-blue-800 ${inCart ? 'text-green-600 blink cursor-default' : 'text-blue-600'}`}
//                               >
//                                 {inCart ? <CheckCircle size={20} /> : <PlusCircle size={20} />}
//                               </button>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                   </tbody>
//                 </table>
//               </div>

            //   {/* Linewise PR Section */}
            //   {isShowCartDetails && Object.keys(rowFilteredData).length > 0 && (
            //     <div className="mt-2">
            //       <p className="text-[10px] font-bold text-sm text-red-500">
            //         PR Line Wise Details ({Object.keys(rowFilteredData).length})
            //       </p>
            //       <div className="flex mt-1 h-55 w-full overflow-auto border border-red-300">
            //         <table className="table-auto text-[10px] font-semibold border-collapse min-w-[600px]">
            //           <thead className="bg-purple-500 text-white sticky top-0 z-20">
            //             <tr>
            //               <th className="w-15">Urgency</th>
            //               <th className="w-10">Status</th>
            //               <th className="w-20">PR Number</th>
            //               <th className="w-20">PR Line</th>
            //               <th className="w-25">Material No</th>
            //               <th className="w-50">Material Description</th>
            //               <th className="w-20 text-right">Stock Qty</th>
            //               <th className="w-20 text-right">PR Qty</th>
            //             </tr>
            //           </thead>
            //           <tbody>
            //             {Object.entries(rowFilteredData).map(([matnr, details], idx) => (
            //               <tr key={matnr} className={`${siteColors[idx % siteColors.length]} hover:bg-yellow-100`}>
            //                 <td className="px-2 border">{urgencyLabels[details.prio_urg] || details.prio_urg}</td>
            //                 <td className="px-2 border">{details.Status}</td>
            //                 <td className="px-2 border">{details.banfn}</td>
            //                 <td className="px-2 border">{details.bnfpo}</td>
            //                 <td className="px-2 border font-semibold">{details.matnr}</td>
            //                 <td className="px-2 border">{details.txz01}</td>
            //                 <td className="px-2 text-sm border text-right">{details.Stock_Qty}</td>
            //                 <td className="px-2 text-sm border text-right">{details.OrdQty}</td>
            //               </tr>
            //             ))}
            //           </tbody>
            //         </table>
            //       </div>
            //     </div>
            //   )}
            // </div>

//             {/* Cart Section */}
//             <div className="p-2 h-139 text-[12px] overflow-auto border shadow bg-gray-100 relative flex-1">
//               <h2 className="text-lg font-bold mb-3 flex justify-between items-center">
//                 Cart
//                 <div className="relative flex items-center">
//                   {cart.length > 0 && (
//                     <>
//                       <ShoppingCart size={45} className="text-green-400" />
//                       <span
//                         className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full cursor-pointer"
//                         title="Make Consolidated PR"
//                         onClick={() => onConsolidatedPr(cart)}
//                       >
//                         {cart.length}
//                       </span>
//                     </>
//                   )}
//                 </div>
//               </h2>

//               <ul className="space-y-0">
//                 {cart.map(item => (
//                   <li key={item.id} className="flex flex-wrap gap-2 border-t pb-0">
//                     <span className="w-20 text-blue-500">{item.matnr}</span>
//                     <span className="w-10 text-blue-500">{item.site}</span>
//                     <span className="flex-1 text-blue-500">{item.itemtext}</span>
//                     <span className="w-15">{item.status}</span>
//                     <span className="w-5 text-right">{item.prqty}</span>
//                     <button
//                       onClick={() => removeFromCart(item.id)}
//                       className="text-red-600 hover:text-red-800"
//                     >
//                       <Trash2 size={20} />
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}

//         {/* 🔹 Footer */}
//         <div className="fixed bottom-0 justify-between w-full bg-purple-700 p-1 flex flex-wrap gap-2 z-50">
//           <div>
//             <button onClick={onBack} className="bg-red-600 mr-2 hover:bg-purple-500 text-white text-sm px-6 rounded-full">
//               ← Back
//             </button>
//             {prioUrgList.map(prio => (
//               <button key={prio} onClick={() => setActivePrioUrg(prio)}
//                 className={`px-8 mr-3 py-0 rounded-full text-sm hover:bg-yellow-500 font-medium shadow 
//                   ${prio === activePrioUrg ? 'bg-yellow-400 blink text-black' : 'bg-green-400 text-black'}`}>
//                 {urgencyLabels[prio] || prio || 'Unknown'}
//               </button>
//             ))}
//           </div>

//           <div>
//             {Object.keys(rowFilteredData).length > 0 && (
//               <button
//                 className="px-2 mb-0 mt-0 blink py-0 bg-green-500 font-medium text-sm rounded-lg shadow hover:bg-blue-600 transition"
//                 title="Create Line by Line PR"
//                 onClick={() => onLinewisePr(rowFilteredData)}
//               >
//                 Create Standard PR ({Object.keys(rowFilteredData).length})
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SitePrSummary;












// import React, { useState } from 'react';
// import { PlusCircle, Trash2, ShoppingCart, CheckCircle } from "react-feather";
// import { buildPrPayload } from "../../utils/buildPrPayload";

// const siteColors = ['bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-pink-200', 'bg-gray-200'];

// const SitePrSummary = ({ rowData, compareData, onactiveTab, onBack }) => {
//   const [activeTabs, setActiveTabs] = useState(onactiveTab || {});
//   const [activeStatus, setActiveStatus] = useState(Object.keys(compareData)[0] || '');
//   const [activePrioUrg, setActivePrioUrg] = useState('');
//   const [isShowHeader, setShowHeader] = useState(true);
//   const [cart, setCart] = useState([]);
//   const [isShowCartDetails, setShowCartDetails] = useState(true);
//   const [rowFilteredData, setRowFilteredData] = useState({});


//   console.log("rowData", rowData);
//   // console.log("compdata",compareData);

//   const urgencyLabels = {
//     '00': 'Normal', '51': 'Urgent', '52': 'Accidental', '53': 'Breakdown',
//     '54': 'Refurbishment', '55': 'Preventive', '56': 'Standard', '57': 'Sales',
//     '58': 'Replacement', '59': 'Import',
//   };

//   const handleSiteTabClick = (status, site) => {
//     setActiveTabs(prev => ({ ...prev, [status]: site }));
//     const allPrioUrgs = [...new Set(Object.values(compareData[status]?.[site] || {}).map(e => e.lurgncy || ''))];
//     setActivePrioUrg(allPrioUrgs[0] || '');
//   };

//   const currentData = compareData[activeStatus]?.[activeTabs[activeStatus]] || {};
//   const prioUrgList = [...new Set(Object.values(currentData).map(d => d.lurgncy || ''))];



//   // Cart functions
//   const addToCart = (item, matnr, site, status, rowData) => {
//     setCart(prev => {
//       if (prev.find(i => i.id === item.id)) return prev;
//       return [...prev, { ...item }];
//     });

//     // 🔹 Add related row details to rowFilteredData
//     setRowFilteredData(prev => {
//       const filtered = Object.entries(rowData)
//         .filter(([_, d]) => d.matnr === matnr && d.site_plant === site && d.Status === status)
//         .reduce((acc, [key, val]) => {
//           acc[key] = val;
//           return acc;
//         }, {});

//       return { ...prev, ...filtered };
//     });
//   };



//   const removeFromCart = (id) => {
//     setCart(prev => prev.filter(i => i.id !== id));

//     // 🔹 Remove related entries from rowFilteredData
//     setRowFilteredData(prev => {
//       const updated = { ...prev };
//       Object.keys(updated).forEach(key => {
//         const val = updated[key];
//         const valId = val.matnr + '@' + val.site_plant;
//         if (valId === id) {
//           delete updated[key];
//         }
//       });
//       return updated;
//     });
//   };


//   const isInCart = (id) => cart.some(i => i.id === id);




//   // const onConsolidatedPr = (data) => {
//   // alert(data.length);
//   //   };


//   const onConsolidatedPr = (cartItems) => {
//     try {
//       const payload = buildPrPayload(cartItems, {
//         docType: "ZNB1",
//         purchGroup: "110",
//         companyCode: "3100"
//       });

//       console.log("Cart PR Payload:", payload);

//       fetch("/sap/opu/odata/sap/ZPR_CREATE_SRV/PRSet", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       })
//         .then(res => res.json())
//         .then(response => {
//           console.log("PR Created:", response);
//           alert("Cart PR Created Successfully: " + JSON.stringify(response));
//         })
//         .catch(err => {
//           console.error("Error creating Cart PR:", err);
//           alert("Failed to create Cart PR");
//         });

//     } catch (err) {
//       alert(err.message);
//     }
//   };




//   //   const onLinewisePr = (data) => {
//   // alert(Object.keys(data).length);
//   //   };


//   const onLinewisePr = (data) => {
//     try {
//       const items = Object.values(data);
//       const payload = buildPrPayload(items, {
//         docType: "ZNB1",
//         purchGroup: "110",
//         companyCode: "3100"
//       });

//       console.log("Linewise PR Payload:", payload);

//       fetch("/sap/opu/odata/sap/ZPR_CREATE_SRV/PRSet", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       })
//         .then(res => res.json())
//         .then(response => {
//           console.log("PR Created:", response);
//           alert("Linewise PR Created Successfully: " + JSON.stringify(response));
//         })
//         .catch(err => {
//           console.error("Error creating PR:", err);
//           alert("Failed to create Linewise PR");
//         });

//     } catch (err) {
//       alert(err.message);
//     }
//   };




//   return (
//     <div className="fixed inset-0 z-50 bg-blue-300">
//       <div className="bg-white w-full h-full overflow-hidden shadow-xl flex flex-col">

//         {/* Header Row */}
//         <div className="bg-purple-700 text-white px-2 py-0 flex justify-between items-center">
//           <h2 className="text-lg font-bold">
//             Summary of : <span className="underline">{activeStatus} Site PR</span>
//           </h2>

//           <div className="flex  loverflow-x-auto justify-center  gap-2">

//             {Object.keys(compareData[activeStatus]).map(site => (
//               <button
//                 key={site}
//                 onClick={() => handleSiteTabClick(activeStatus, site)}
//                 className={`px-4 py-0 rounded-full text-sm font-medium 
//                   shadow-xl ${activeTabs[activeStatus] === site ? 'bg-green-400  blink flip-btn-inner  text-white' : 'bg-gray-200 text-black'}`}
//               >
//                 {site}
//               </button>
//             ))}
//           </div>


//           <div className="flex gap-3">
//             {Object.keys(compareData).map(status => (
//               <button
//                 key={status}
//                 onClick={() => setActiveStatus(status)}
//                 className={`px-6 py-0 rounded-full font-semibold text-sm shadow ${activeStatus === status ? 'bg-yellow-400 blink text-black' : 'bg-white text-purple-900'}`}
//               >
//                 {status}
//               </button>
//             ))}
//           </div>




//         </div>


//         {/* Table Section */}
//         {isShowHeader && (
//           <div className="flex px-1 justify-between mt-1 py-0 overflow-auto pb-10  gap-2">

//             {/* Data Table */}

//             <div className="flex-col">
//               <div className="h-85 mt-0 w-ful loverflow-x-auto border border-gray-300 
//                              overflow-y-auto" >

//                 <table className="table-auto text-[10px] font-semibold border-collapse w-full">
//                   <thead className="bg-blue-500 text-white sticky top-0 z-20">
//                     <tr>
//                       <th className="border px-1 ">Urgency</th>
//                       <th className="border px-1 ">Status</th>
//                       <th className="border px-1 ">Material No</th>
//                       <th className="border px-1 ">Site</th>
//                       <th className="border px-1 ">Material Description</th>
//                       <th className="border px-1  text-right">Stock Qty</th>
//                       <th className="border px-1  text-right">Total PR Qty</th>
//                       <th className="border px-1  text-center">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {Object.entries(currentData)
//                       .filter(([_, details]) => !activePrioUrg || details.lurgncy === activePrioUrg)
//                       .map(([matnr, details], idx) => {
//                         const itemId = details.matnr + '@' + details.lsite;
//                         const inCart = isInCart(itemId);
//                         return (
//                           <tr key={matnr} className={`${siteColors[idx % siteColors.length]} ${inCart ? 'bg-gray-300' : ''} hover:bg-yellow-100 transition`}>
//                             <td className="px-1 border">{urgencyLabels[details.lurgncy] || details.lurgncy}</td>
//                             <td className="px-1 border">{details.lstatus}</td>
//                             <td className="px-1 border font-semibold">{details.matnr}</td>
//                             <td className="px-1 border font-semibold">{details.lsite}</td>
//                             <td className="px-1 border">{details.txz01}</td>
//                             <td className="px-1 text-sm border text-right">{details.totalStockQty}</td>
//                             <td className="px-1 text-sm border text-right">{details.totalQty}</td>
//                             <td className="px-1 border text-center">
//                               <button
//                                 onClick={() => addToCart({
//                                   id: itemId,
//                                   matnr: details.matnr,
//                                   site: details.lsite,
//                                   itemtext: details.txz01,
//                                   prqty: details.totalQty,
//                                   status: details.lstatus
//                                 },
//                                   details.matnr, activeTabs[activeStatus], details.lstatus, rowData

//                                 )}
//                                 disabled={inCart}
//                                 className={`hover:text-blue-800 ${inCart ? 'text-green-600 blink cursor-default' : 'text-blue-600'}`}
//                               >
//                                 {inCart ? <CheckCircle size={20} /> : <PlusCircle size={20} />}
//                               </button>

//                             </td>
//                           </tr>
//                         );
//                       })}
//                   </tbody>
//                 </table>
//               </div>




//               {isShowCartDetails && (
//                 <div>

//                   <div className="flex  items-center justify-between">
//                     <p className=" text-[10px] font-bold  text-sm text-red-500">
//                       Pr Line Wise Details ({Object.keys(rowFilteredData).length})
//                     </p>

//                   </div>


//                   <div className="flex mt-0 h-55  w-full overflow-x-auto  border-red-500  overflow-y-auto">

//                     <table className=" table-auto text-[10px] font-semibold border-collapse ">
//                       <thead className="bg-purple-500 px-2 text-white sticky top-0 z-20">
//                         <tr >
//                           <th className="w-15 ">Urgency</th>
//                           <th className="w-10 ">Status</th>
//                           <th className="w-20 ">PR Number</th>
//                           <th className="w-20 ">PR Line</th>
//                           <th className="w-25 ">Material No</th>
//                           <th className="w-50 ">Material Description</th>
//                           <th className="w-20  text-right">Stock Qty</th>
//                           <th className="w-20  text-right">PR Qty</th>
//                           {/* <th className="border px-2 py-1 text-center">Action</th> */}
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {Object.entries(rowFilteredData)
//                           .map(([matnr, details], idx) => (

//                             <tr
//                               key={matnr}
//                               className={`${siteColors[idx % siteColors.length]} hover:bg-yellow-100 transition`}
//                             >
//                               <td className="px-2 border">{urgencyLabels[details.prio_urg] || details.prio_urg}</td>
//                               <td className="px-2 border">{details.Status}</td>
//                               <td className="px-2 border">{details.banfn}</td>
//                               <td className="px-2 border">{details.bnfpo}</td>
//                               <td className="px-2 border font-semibold">{details.matnr}</td>
//                               <td className="px-2 border">{details.txz01}</td>
//                               <td className="px-2 text-sm border text-right">{details.Stock_Qty}</td>
//                               <td className="px-2 text-sm border text-right">{details.OrdQty}</td>
//                             </tr>
//                           ))}
//                       </tbody>
//                     </table>

//                   </div>
//                 </div>
//               )};




//             </div>


//             <div className="p-2 h-139 text-[12px] overflow-auto border  shadow bg-gray-100 relative">
//               <h2 className="text-lg font-bold mb-3 flex justify-between items-center">
//                 Cart
//                 <div className="relative flex items-center">
//                   {cart.length > 0 && (
//                     <>
//                       {/* Cart Icon */}
//                       <ShoppingCart size={45} className="text-green-400" />

//                       {/* Cart Count Badge */}
//                       <span
//                         className="absolute top-2.5 right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full cursor-pointer"
//                         title="Make Consolidated PR"
//                         onClick={() => onConsolidatedPr(cart)}
//                       >
//                         {cart.length}
//                       </span>
//                     </>
//                   )}
//                 </div>




//               </h2>

//               <ul className="space-y-0">
//                 {cart.map(item => (
//                   <li key={item.id} className="flex gap-4 border-t pb-0">
//                     <span className="w-20 text-blue-500">{item.matnr}</span>
//                     <span className="w-10 text-blue-500">{item.site}</span>
//                     <span className="w-80 text-blue-500">{item.itemtext}</span>
//                     <span className="w-15">{item.status}</span>
//                     <span className="w-5 justify-end">{item.prqty}</span>
//                     <button
//                       onClick={() => removeFromCart(item.id)}
//                       className="text-red-600 hover:text-red-800"
//                     >
//                       <Trash2 size={20} />
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//           </div>

//         )}




//         {/* Fixed Footer */}
//         <div className="fixed bottom-0 justify-between w-full bg-purple-700 p-1  flex gap-10  z-50">
//           <div >
//             <button onClick={onBack} className="bg-red-600 mr-2 hover:bg-purple-500 text-white text-sm 
//                       px-6 rounded-full">
//               ← Back
//             </button>
//             {prioUrgList.map(prio => (
//               <button key={prio} onClick={() => setActivePrioUrg(prio)}
//                 className={`px-8 mr-3 py-0 rounded-full text-sm hover:bg-yellow-500  
//                           font-medium shadow ${prio === activePrioUrg ? 'bg-yellow-400 blink text-black' :
//                     'bg-green-400 text-black'}`}>
//                 {urgencyLabels[prio] || prio || 'Unknown'}
//               </button>
//             ))}
//           </div>

//           <div>
//             {Object.keys(rowFilteredData).length > 0 && (
//               <button className="px-2 mb-0 mt-0 blink py-0 bg-green-500 font-medium
//                     text-sm rounded-lg shadow hover:bg-blue-600 transition"
//                 title='Create Line by Line PR'
//                 onClick={() => onLinewisePr(rowFilteredData)}>

//                 Create Standart PR ({Object.keys(rowFilteredData).length})
//               </button>
//             )}

//           </div>
//           <div>

//           </div>

//         </div>



//       </div>
//     </div>
//   );
// };



// export default SitePrSummary;
