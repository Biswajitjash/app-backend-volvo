import React, { useState, useEffect } from "react";

const PrCustomTree = ({ data, treeFields }) => {
  const [expandedKeys, setExpandedKeys] = useState(new Set());
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState("");

  const groupBy = (array, field) => {
    return array.reduce((acc, obj) => {
      const key = obj[field] ?? "Unknown";
      acc[key] = acc[key] || [];
      acc[key].push(obj);
      return acc;
    }, {});
  };

  const shadowColors = [
    "rgba(255,105,180,0.5)", // Pink
    "rgba(0,255,0,0.5)",     // Green
    "rgba(0,0,255,0.5)",     // Blue
    "rgba(255,165,0,0.5)",   // Orange
    "rgba(128,0,128,0.5)",   // Purple
  ];

  const textColors = [
    "#e91e63", "#4caf50", "#2196f3", "#ff9800", "#9c27b0", "#f44336"
  ];

  const generateAllKeys = (items, fields, level = 0, keySet = new Set()) => {
    if (level >= fields.length) return;
    const fieldId = typeof fields[level] === "object" ? fields[level].id : fields[level];
    const grouped = groupBy(items, fieldId);
    for (let key of Object.keys(grouped)) {
      const uniqueKey = `${fieldId}-${key}-${level}`;
      keySet.add(uniqueKey);
      generateAllKeys(grouped[key], fields, level + 1, keySet);
    }
    return keySet;
  };

  useEffect(() => {
    const allKeys = generateAllKeys(data, treeFields);
    setExpandedKeys(allKeys);
  }, [data, treeFields]);

  const toggleExpand = (key) => {
    const newSet = new Set(expandedKeys);
    newSet.has(key) ? newSet.delete(key) : newSet.add(key);
    setExpandedKeys(newSet);
  };

  const handleExpandAll = () => {
    const allKeys = generateAllKeys(filteredData, treeFields);
    setExpandedKeys(allKeys);
  };

  const handleCollapseAll = () => {
    setExpandedKeys(new Set());
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (!term) {
      setFilteredData(data);
      const allKeys = generateAllKeys(data, treeFields);
      setExpandedKeys(allKeys);
      return;
    }

    const filtered = data.filter(item =>
      Object.values(item).some(
        v => typeof v === "string" && v.toLowerCase().includes(term)
      )
    );
    setFilteredData(filtered);

    const newKeys = generateAllKeys(filtered, treeFields);
    setExpandedKeys(newKeys);
  };

  const buildTree = (data, fields, level = 0) => {
    if (level >= fields.length) return null;
    const field = fields[level];
    const fieldId = typeof field === 'object' ? field.id : field;
    const grouped = groupBy(data, fieldId);

    return Object.entries(grouped).map(([key, items], index) => {
      const uniqueKey = `${fieldId}-${key}-${level}`;
      const shadowColor = shadowColors[(level + index) % shadowColors.length];
      const textColor = textColors[index % textColors.length];
      const isExpanded = expandedKeys.has(uniqueKey);

      return (
        <div
          key={uniqueKey}
          className="rounded-2xl p-2 text-sm transition-all duration-300"
          style={{
            color: textColor,
            boxShadow: `0 0 25px 10px ${shadowColor}`,
            marginLeft: level * 20,
            marginBottom: 8,
            cursor: "pointer",
          }}
        >
          <div onClick={() => toggleExpand(uniqueKey)}>
            <strong>
              {isExpanded ? "📂" : "📁"} {field.label || fieldId}: {key}
            </strong>
          </div>

          <div
            style={{
              maxHeight: isExpanded ? "1000px" : "0px",
              overflow: "hidden",
              transition: "max-height 0.5s ease-in-out",
            }}
          >
            {level === fields.length - 1 ? (
              items.map((item, i) => (
                <div
                  key={i}
                  className="ml-5 mt-2 p-2 rounded bg-white text-black shadow-[0_0_25px_10px_rgba(180,105,250,0.3)]"
                >
                  {Object.entries(item).map(([k, v]) =>
                    !fields.some(f => (f.id || f) === k) &&
                    k !== "__metadata" &&
                    typeof v !== "object" ? (
                      <div key={k}>📄 <strong>{k}</strong>: {String(v)}</div>
                    ) : null
                  )}
                </div>
              ))
            ) : (
              buildTree(items, fields, level + 1)
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      <div className="flex gap-3 mb-4 items-center">
        <input
          type="text"
          placeholder="🔍 Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 rounded w-64"
        />
        <button
          onClick={handleExpandAll}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
        >
          Expand All
        </button>
        <button
          onClick={handleCollapseAll}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Collapse All
        </button>
      </div>

      {buildTree(filteredData, treeFields)}
    </div>
  );
};

export default PrCustomTree;






















// import React, { useState, useEffect } from "react";

// const PrCustomTree = ({ data, treeFields }) => {
//   const [expandedKeys, setExpandedKeys] = useState(new Set());
//   const [filteredData, setFilteredData] = useState(data);
//   const [searchTerm, setSearchTerm] = useState("");

//   const groupBy = (array, field) => {
//     return array.reduce((acc, obj) => {
//       const key = obj[field] ?? "Unknown";
//       acc[key] = acc[key] || [];
//       acc[key].push(obj);
//       return acc;
//     }, {});
//   };

//   const shadowColors = [
//     "rgba(255,105,180,0.5)", // Hot Pink
//     "rgba(0,255,0,0.5)",     // Green
//     "rgba(0,0,255,0.5)",     // Blue
//     "rgba(255,165,0,0.5)",   // Orange
//     "rgba(128,0,128,0.5)",   // Purple
//   ];

//   const textColors = [
//     '#e91e63', '#4caf50', '#2196f3', '#ff9800', '#9c27b0', '#f44336',
//   ];

//   const toggleExpand = (key) => {
//     const newSet = new Set(expandedKeys);
//     newSet.has(key) ? newSet.delete(key) : newSet.add(key);
//     setExpandedKeys(newSet);
//   };

//   const handleExpandAll = () => {
//     const allKeys = new Set();
//     const collectKeys = (items, fields, level = 0) => {
//       if (level >= fields.length) return;
//       const fieldId = typeof fields[level] === "object" ? fields[level].id : fields[level];
//       const grouped = groupBy(items, fieldId);
//       for (let k of Object.keys(grouped)) {
//         allKeys.add(`${fieldId}-${k}-${level}`);
//         collectKeys(grouped[k], fields, level + 1);
//       }
//     };
//     collectKeys(filteredData, treeFields);
//     setExpandedKeys(allKeys);
//   };

//   const handleCollapseAll = () => setExpandedKeys(new Set());

//   const handleSearch = (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);
//     if (!term) {
//       setFilteredData(data);
//       return;
//     }

//     const filtered = data.filter(item =>
//       Object.values(item).some(
//         v => typeof v === "string" && v.toLowerCase().includes(term)
//       )
//     );
//     setFilteredData(filtered);
//   };

//   const buildTree = (data, fields, level = 0) => {
//     if (level >= fields.length) return null;
//     const field = fields[level];
//     const fieldId = typeof field === 'object' ? field.id : field;

//     const grouped = groupBy(data, fieldId);

//     return Object.entries(grouped).map(([key, items], index) => {
//       const uniqueKey = `${fieldId}-${key}-${level}`;
//       const shadowColor = shadowColors[(level + index) % shadowColors.length];
//       const textColor = textColors[index % textColors.length];
//       const isExpanded = expandedKeys.has(uniqueKey);

//       return (
//         <div
//           key={uniqueKey}
//           className="rounded-2xl p-2 text-sm transition-all duration-300"
//           style={{
//             color: textColor,
//             boxShadow: `0 0 25px 10px ${shadowColor}`,
//             marginLeft: level * 20,
//             marginBottom: 8,
//             cursor: "pointer",
//           }}
//         >
//           <div onClick={() => toggleExpand(uniqueKey)}>
//             <strong>
//               {isExpanded ? "📂" : "📁"} {field.label || fieldId}: {key}
//             </strong>
//           </div>

//           <div
//             style={{
//               maxHeight: isExpanded ? "1000px" : "0px",
//               overflow: "hidden",
//               transition: "max-height 0.5s ease-in-out",
//             }}
//           >
//             {level === fields.length - 1 ? (
//               items.map((item, i) => (
//                 <div
//                   key={i}
//                   className="ml-5 mt-2 p-2 rounded bg-white text-black shadow-[0_0_25px_10px_rgba(180,105,250,0.3)]"
//                 >
//                   {Object.entries(item).map(([k, v]) =>
//                     !fields.some(f => (f.id || f) === k) &&
//                     k !== "__metadata" &&
//                     typeof v !== "object" ? (
//                       <div key={k}>📄 <strong>{k}</strong>: {String(v)}</div>
//                     ) : null
//                   )}
//                 </div>
//               ))
//             ) : (
//               buildTree(items, fields, level + 1)
//             )}
//           </div>
//         </div>
//       );
//     });
//   };

//   return (
//     <div>
//       {/* Search and Controls */}
//       <div className="flex gap-3 mb-4 items-center">
//         <input
//           type="text"
//           placeholder="🔍 Search..."
//           value={searchTerm}
//           onChange={handleSearch}
//           className="border p-2 rounded w-64"
//         />
//         <button
//           onClick={handleExpandAll}
//           className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
//         >
//           Expand All
//         </button>
//         <button
//           onClick={handleCollapseAll}
//           className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
//         >
//           Collapse All
//         </button>
//       </div>

//       {/* Tree View */}
//       {buildTree(filteredData, treeFields)}
//     </div>
//   );
// };

// export default PrCustomTree;








// import React, { useState } from "react";

// const PrCustomTree = ({ data, treeFields }) => {
//   const [expandedKeys, setExpandedKeys] = useState(new Set());

//   const toggleExpand = (key) => {
//     setExpandedKeys(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(key)) {
//         newSet.delete(key);
//       } else {
//         newSet.add(key);
//       }
//       return newSet;
//     });
//   };

//   const groupBy = (array, field) => {
//     return array.reduce((acc, obj) => {
//       const key = obj[field] ?? "Unknown";
//       acc[key] = acc[key] || [];
//       acc[key].push(obj);
//       return acc;
//     }, {});
//   };

//   const shadowColors = [
//     "rgba(255,105,180,0.5)",
//     "rgba(0,255,0,0.5)",
//     "rgba(0,0,255,0.5)",
//     "rgba(255,165,0,0.5)",
//     "rgba(128,0,128,0.5)",
//   ];

//   const textColors = [
//     "#e91e63",
//     "#4caf50",
//     "#2196f3",
//     "#ff9800",
//     "#9c27b0",
//     "#f44336",
//   ];

//   const buildTree = (data, fields, level = 0) => {
//     if (level >= fields.length) return null;

//     const field = fields[level];
//     const fieldId = typeof field === "object" ? field.id : field;

//     const grouped = groupBy(data, fieldId);

//     return Object.entries(grouped).map(([key, items], index) => {
//       const shadowColor = shadowColors[(level + index) % shadowColors.length];
//       const textColor = textColors[index % textColors.length];
//       const nodeKey = `${fieldId}-${key}-${level}`;

//       const isExpanded = expandedKeys.has(nodeKey);

//       return (
//         <div
//           key={nodeKey}
//           className=" p-2 text-sm transition-transform duration-300 cursor-pointer"
//           style={{
//             color: textColor,
//             boxShadow: `0 0 25px 15px ${shadowColor}`,
//             marginLeft: level * 20,
//             marginBottom: 8,
//           }}
//         >
//           <div onClick={() => toggleExpand(nodeKey)}>
//             <strong>{isExpanded ? "📂" : "📁"} {field.label || fieldId}: {key}</strong>
//           </div>

//           {isExpanded &&
//             (level === fields.length - 1 ? (
//               items.map((item, i) => (
//                 <div
//                   key={i}
//                   className="shadow-[0_0_25px_10px_rgba(180,105,250,0.5)] rounded p-2"
//                   style={{ marginLeft: 20, marginTop: 8 }}
//                 >
//                   {Object.entries(item).map(
//                     ([k, v]) =>
//                       !fields.some((f) => (f.id || f) === k) &&
//                       k !== "__metadata" &&
//                       typeof v !== "object" && (
//                         <div key={k}>
//                           📄 <strong>{k}</strong>: {String(v)}
//                         </div>
//                       )
//                   )}
//                 </div>
//               ))
//             ) : (
//               buildTree(items, fields, level + 1)
//             ))}
//         </div>
//       );
//     });
//   };

//   return <div>{buildTree(data, treeFields)}</div>;
// };

// export default PrCustomTree;









// import React from "react";

// const PrCustomTree = ({ data, treeFields }) => {
//   console.log("Data:", data);
//   console.log("Tree Fields:", treeFields);

//   const groupBy = (array, field) => {
//     return array.reduce((acc, obj) => {
//       const key = obj[field] ?? "Unknown";
//       acc[key] = acc[key] || [];
//       acc[key].push(obj);
//       return acc;
//     }, {});
//   };

// const shadowColors = [
//   "rgba(255,105,180,0.5)", // Hot Pink
//   "rgba(0,255,0,0.5)",     // Green
//   "rgba(0,0,255,0.5)",     // Blue
//   "rgba(255,165,0,0.5)",   // Orange
//   "rgba(128,0,128,0.5)",   // Purple
// ];

// const textColors = [
//   '#e91e63', // Pink
//   '#4caf50', // Green
//   '#2196f3', // Blue
//   '#ff9800', // Orange
//   '#9c27b0', // Purple
//   '#f44336', // Red
// ];

// const buildTree = (data, fields, level = 0) => {
//   if (level >= fields.length) return null;

//   const field = fields[level];
//   const fieldId = typeof field === 'object' ? field.id : field;

//   const grouped = groupBy(data, fieldId);

//   return Object.entries(grouped).map(([key, items], index) => {
//     const shadowColor = shadowColors[(level + index) % shadowColors.length];

//     return (
//       <div
//         key={`${fieldId}-${key}-${index}`}
//         className="rounded-2xl p-2   text-sm transition-transform duration-300"
//         style={{
//           color: textColors[index % textColors.length], // 👈 dynamic text color
//           boxShadow: `0 0 25px 15  px ${shadowColor}`,
//           marginLeft: level * 20,
//           marginBottom: 8,
//         }}
//       >
//         <strong>📁 {field.label || fieldId}: {key}</strong>

//         {level === fields.length - 1 ? (
//           items.map((item, i) => (
//             <div className='shadow-[0_0_25px_10px_rgba(180,105,250,0.5)]'  
//                 key={i} style={{ marginLeft: 20 }}>
//               {Object.entries(item).map(([k, v]) =>
//                 !fields.some(f => (f.id || f) === k) &&
//                 k !== "__metadata" &&
//                 typeof v !== "object" && (
//                   <div key={k}>📄 <strong>{k}</strong>: {String(v)}</div>
//                 )
//               )}
//             </div>
//           ))
//         ) : (
//           buildTree(items, fields, level + 1)
//         )}
//       </div>
//     );
//   });
// };

//   return <div>{buildTree(data, treeFields)}</div>;
// };

// export default PrCustomTree;

