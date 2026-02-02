import React, { useState, useEffect } from 'react';
const ApiTester = () => {
  const servr = [
    'https://amwebdisp.ampl.in:44390',    
    'https://amwebdisp.ampl.in:44380',    
    'https://amwebdisp.ampl.in:44370',  
  ];

    const odta = [
    '/sap/opu/odata/sap/ZCWS_WMS_ODATA_SRV/',
    '/sap/opu/odata/sap/ZRFQ_APPROVAL_SRV/',

  ];
  const mthds = ['INSP_MAT_Set/', 'INSP_EQP_Set/', 'SALES_ORDER_Set/', 'ZDEEP_DATASet/', 'RFQ_BILLEDSet/'];

const methodOptionsMap = {
  '/sap/opu/odata/sap/ZCWS_WMS_ODATA_SRV/': [
    'INSP_MAT_Set/',
    'INSP_EQP_Set/',
    'SALES_ORDER_Set/',
    'ZDEEP_DATASet/',
    'ZMOPM04HSet/',
  ],
  '/sap/opu/odata/sap/ZRFQ_APPROVAL_SRV/': [
    'RFQ_BILLEDSet/',
  ]
};


 const postbodydeeldata = {
    JobNo: '120121',
    Plant: '3102',
    DATATOSTOCK: {
      results: [
        {
          MaterialNo: '500026119',
          LineNo: '00001',
          Plant: '3102',
          ValuationType: '',
          DSTOCKTOBATCH: {
            results: [],
          },
        },
        {
          MaterialNo: '500026123',
          LineNo: '00002',
          Plant: '3102',
          ValuationType: 'NEW-IMP',
          DSTOCKTOBATCH: {
            results: [],
          },
        },
      ],
    },
  };

 const postbodyZMOPM04H = {
  "JobNo": "0000000173",
  "MaterialNo": "120000013",
  "Batch": "",
  "Plant": "3103",
  "ValuationType": "",
  "Qty": "1.000",
  "Unit": "NOS",
  "Totcost": "0.000", 
  "MO_Number": "4000200",
  "Reservation_no": "",
  "PR_Number": "",
  "MO_TO_MAN": {
    "results": [
      {
        "LineNo": "00020",
        "ActivityNumber": "0020",
        "Method": "CREATE",
        "WorkCenter": "KCWSGBOX",
        "OperationText": "Engine Dis Assembling Work 02",
        "No_of_Man": "1.00",
        "Each_Man_Hr": "10.00",
        "Total_Man_Hr": "20.00",
        "Rate": "500.000",
        "TotalValue": "10000.000"
      }
    ]
  },
  "MO_TO_MAT": {
    "results": [
      {
        "LineNo": "0002",
        "MaterialNo": "500025559",
        "Method": "CREATE",
        "ActivityNumber": "0020",
        "Qty": "2.000"
      },
      {
        "LineNo": "0003",
        "MaterialNo": "500025559",
        "Method": "CREATE",
        "ActivityNumber": "0020",
        "Qty": "3.000"
      }
    ]
  }
}
  // const [apiBody, setApiBody] = useState(JSON.stringify(postbody, null, 2)); // pretty print
  const [apiBody, setApiBody] = useState(''); // pretty print
  const [serverUrl, setServerUrl] = useState([servr[0]]);
  const [odataService, setOdataService] = useState(odta[0]);
  const [method, setMethod] = useState(mthds[0]);
  const [result, setResult] = useState(null);
  const [statusCode, setStatusCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedPanels, setExpandedPanels] = useState({});
  const [showBodyModal, setShowBodyModal] = useState(false);
  const [file, setFile] = useState(null);
  const [jsonError, setJsonError] = useState('');

  const speakFunction = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utter);
  };


  const isValidJSON = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };


const formatSAPDatesInData = (dataArray) => {
  return dataArray.map(obj => {
    const formattedObj = {};

    for (const key in obj) {
      const value = obj[key];

      // Check for SAP OData date format: /Date(1234567890000)/
      if (typeof value === 'string' && /\/Date\(\d+\)\//.test(value)) {
        const match = value.match(/\/Date\((\d+)\)\//);
        if (match) {
          const timestamp = parseInt(match[1], 10);
          const date = new Date(timestamp);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based
          const year = date.getFullYear();
          formattedObj[key] = `${day}-${month}-${year}`;
        } else {
          formattedObj[key] = value;
        }
      } else {
        formattedObj[key] = value;
      }
    }

    return formattedObj;
  });
};


 const fetchData = async () => {
  setIsLoading(true);
  setJsonError('');

  const isPost = apiBody.trim() !== '' || file;
  if (isPost && !isValidJSON(apiBody)) {
    speakFunction("No Valid Json");
    setJsonError('❌ Invalid JSON format.');
    setIsLoading(false);
    return;
  }

  try {
    const formData = new FormData();
    formData.append('serverUrl', serverUrl);
    formData.append('odataService', odataService);
    formData.append('method', method);
    formData.append('isPost', isPost);
    if (file) {
      formData.append('file', file);
    } else if (apiBody) {
      formData.append('apiBody', apiBody);
    }

  console.log("formdata",formData);
//////////////////////////////////////////////////////////////////////////////////////
       const resp = await fetch('http://localhost:8800/apiTesting', {    
      method: 'POST',
      body: formData
    });
//////////////////////////////////////////////////////////////////////////////////////

    setStatusCode(resp.status);
    const json = await resp.json();

    const Data = isPost
      ? json?.d?.DATATOSTOCK?.results || []
      : json?.d?.results || [];


let sortedData = [];
    console.log("before sort", Data );

if (Data.length > 0) {
  sortedData = [...Data].sort((a, b) => {
    const idA = a.__metadata?.id || '';
    const idB = b.__metadata?.id || '';
    return idB.localeCompare(idA); // Descending order
  });
}


  const data = formatSAPDatesInData(sortedData);
    console.log("before after", data );

    if (data.length === 0) {

      speakFunction(`status ${resp.status} error is ${json?.error?.message?.value}`);
      setResult([]);
    } else {
      speakFunction(`status ${resp.status} Found ${data.length} Records`);
      const cleaned = data.map(({ __metadata, ...rest }) => rest);
      setResult(cleaned);

      const collapsedState = {};
      cleaned.forEach((_, i) => collapsedState[i] = false);
      setExpandedPanels(collapsedState);
    }

  } catch (err) {
    alert('Error in service, please check..');
    console.error("Fetch Error:", err);
    setResult([{ error: err.message }]);
    setStatusCode("Error");
  } finally {
    setIsLoading(false);
  }
};

//////////////////////////////////////////////////////////////////////////////////
  const togglePanel = (index) => {
    setExpandedPanels(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const bgColors = ['#e3f2fd', '#ffe0b2', '#dcedc8', '#f8bbd0', '#d1c4e9'];


useEffect(() => {
  const methods = methodOptionsMap[odataService] || [];
  if (!methods.includes(method)) {
    setMethod(methods[0] || '');
  }
}, [odataService]);


const onSobody = ()=>{
alert('SO Body');
setApiBody(JSON.stringify(postbodyZMOPM04H, null, 2)); // pretty JSON format

};

  return (
    <div style={{ padding: '10px', fontFamily: 'Segoe UI', backgroundColor: '#f0f4f8' }}>
      {!showBodyModal && (
        <>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'left', flexWrap: 'wrap' }}>
            <h2 style={{ color: '#2a2a72', marginBottom: '1px', width: '150px'}}>🎯 Multipurpose OData API Tester</h2>

            <select 
                value={serverUrl} 
                onChange={(e) => setServerUrl(e.target.value)} 
                style={dropdownStyle}>
              {servr.map((key, index) => (
                <option key={index} value={key}>{key}</option>
              ))}
            </select>


            <select value={odataService} onChange={(e) => setOdataService(e.target.value)} style={dropdownStyle}>
              {odta.map((service, index) => (
                <option key={index} value={service}>{service}</option>
              ))}
            </select>

<select
  value={method}
  onChange={(e) => setMethod(e.target.value)}
  style={dropdownStyle}
>
  {(methodOptionsMap[odataService] || []).map((m, index) => (
    <option key={index} value={m}>{m}</option>
  ))}
</select>

           <button onClick={fetchData} style={buttonStyle}>
              {isLoading ? 'Loading...' : '🚀 Send'}
            </button>

            <button onClick={() => setShowBodyModal(true)} style={buttonStyleGrey}>
              📝 BODY
            </button>
            <button style={getStyle}>
              GET
            </button>
            <button style={statusStyle}>
              📝 Status
            </button>
 
          </div>


          <div className='flex gap-2' style={{ marginTop: '10px', color: '#333' }}>
            {/* <strong>🔗 Final URL:</strong>&nbsp; {`${odataService}${method}`} */}

           {/* <strong>🔗 Final URL:</strong>&nbsp;{`${serverUrl}${odataService}${method}`} */}

          <strong>🔗 Final URL:</strong>&nbsp;
          <a href={`${serverUrl}${odataService}${method}`} target="_blank" rel="noopener noreferrer" style={{ color: '#0a66c2', textDecoration: 'underline' }}>
            {`${serverUrl}${odataService}${method}`}  
          </a>

            <div className='flex gap-2'>            <strong>📦 API Response:</strong> 
        <span style={{ color: '#f30404',  backgroundColor: '#76f73bff'}}>
          {statusCode ? `   Status Code ${statusCode} ` : '—'} 
          {Array.isArray(result) ? `   Total Records ${result.length}` : 0 }
          {statusCode >= 400   ? `   Error in resource` : '' } 
          
        </span>
          </div>

          </div>

          <div style={{ backgroundColor: '#c7bfbeff', marginTop: '5px' }}>

            {result && result.length > 0 ? (
              result.map((entry, index) => {
                const label = entry.Jobno
                  ? `JobNo: ${entry.Jobno}`
                  : Object.keys(entry).length > 0
                    ? `${Object.keys(entry)[0]}: ${entry[Object.keys(entry)[0]]}`
                    : `Entry #${index + 1}`;


                const isExpanded = expandedPanels[index];
                return (
                  <div
                    key={index}
                    style={{
                      backgroundColor: bgColors[index  % bgColors.length ],
                      padding: '15px',
                      borderRadius: '8px',
                      marginTop: '12px',
                    }}
                  >
                    <div
                      onClick={() => togglePanel(index)}
                      style={{
                      
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        color: '#333',
                      
                      }}
                    >
                      🔽 {label}
                      <span>{isExpanded ? '🔼 Collapse' : '🔽 Expand'}</span>
                    </div>

                    {isExpanded && (
                      <div
                        style={{
                          marginTop: '15px',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '12px',
                        }}
                      >
                        {Object.entries(entry).map(([key, value], i) => (
                          <div
                            key={i}
                          style={{
                                  display: 'flex',                   // Enables flex layout
                                  justifyContent: 'space-between',  // Distributes space between items
                                  alignItems: 'center',             // (Optional) Vertically align items
                                  flex: '0 1 14%',
                                  backgroundColor: '#fff',
                                  padding: '5px',
                                  borderRadius: '10px',
                                  boxShadow: '0 3px 8px rgba(6, 30, 241, 0.9)',
                                  wordBreak: 'break-word',
                                }}

                          >
                            
                        <strong  >
                          <span style={{ marginRight: '5px' }}>{key}</span>
                        </strong>
                          <span style={{ color: 'red', marginRight: '5px' }}>{String(value)}</span>
                        

                            {/* <strong style={{ color: '#222' gap: '5px' }} >{key} {String(value)} </strong> */}
                            
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{
                padding: '10px',
                backgroundColor: '#fff3cd',
                borderRadius: '8px',
                marginTop: '10px'
              }}>
                No response yet
              </div>
            )}
          </div>
        </>
      )}

      {/* API BODY MODAL */}
      {showBodyModal && (
        <div style={modalContainer}>
          <h3 style={{ marginBottom: '10px', color: '#333' }}>📝 Enter JSON Body or Upload File</h3>
          <textarea
            value={apiBody}
            onChange={(e) => setApiBody(e.target.value)}
            placeholder='Paste or type valid JSON here...'
            style={textareaStyle}
          />
          {jsonError && <div style={{ color: 'red', marginTop: '5px' }}>{jsonError}</div>}
          <div style={{ margin: '10px 0' }}>
            <label><strong>📁 Upload File (overrides body):</strong></label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={buttonStyle} onClick={() => setShowBodyModal(false)}>🔙 Back</button>
            <button style={buttonStyle} onClick={onSobody}> SO body </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const dropdownStyle = {
  padding: '10px',
  fontSize: '14px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  backgroundColor: '#ffffff',
};

const buttonStyle = {
  padding: '10px',
  fontSize: '16px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
};

const statusStyle = {
  padding: '10px',
  fontSize: '20px',
  backgroundColor: '#ff3c00ff',
  color: 'yellow',
  border: 'none',
  borderRadius: '8px'
};

const getStyle = {
  padding: '10px',
  fontSize: '20px',
  backgroundColor: '#05e905ff',
  color: 'yellow',
  border: 'none',
  borderRadius: '8px'
};

const buttonStyleGrey = {
  ...buttonStyle,
  backgroundColor: '#6c757d'
};

const modalContainer = {
  backgroundColor: '#fff',
  border: '2px solid #007bff',
  padding: '20px',
  borderRadius: '10px',
  width: '80%',
  margin: 'auto',
  marginTop: '40px',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
};

const textareaStyle = {
  width: '100%',
  height: '400px',
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  fontFamily: 'monospace',
  fontSize: '14px'
};

export default ApiTester;























// import React, { useState } from 'react';

// const ApiTester = () => {
//   const odta = [
//     '/sap/opu/odata/sap/ZCWS_WMS_ODATA_SRV/',
//     '/sap/opu/odata/sap/ZRFQ_APPROVAL_SRV/',
//   ];
//   const mthds = ['INSP_MAT_Set/', 'INSP_EQP_Set/', 'SALES_ORDER_Set/', 'ZDEEP_DATASet/', 'RFQ_BILLEDSet/'];

//   const [odataService, setOdataService] = useState(odta[0]);
//   const [method, setMethod] = useState(mthds[0]);
//   const [result, setResult] = useState(null);
//   const [statusCode, setStatusCode] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [expandedPanels, setExpandedPanels] = useState({});
//   const [showBodyModal, setShowBodyModal] = useState(false);
//   const [apiBody, setApiBody] = useState('');

//   const speakFunction = (text) => {
//     const utter = new SpeechSynthesisUtterance(text);
//     window.speechSynthesis.speak(utter);
//   };

//   const fetchData = async () => {
//     setIsLoading(true);
//     const finalUrl = `${odataService}${method}`;

//     try {
//       const resp = await fetch(finalUrl, {
//         method: apiBody.trim() ? 'POST' : 'GET',
       
       
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           Authorization: 'Basic ' + btoa('AMPLCONS:today@02'),
//         },
//         ...(apiBody.trim() && { body: apiBody }),
//       });

//       setStatusCode(resp.status);

//       const json = await resp.json();
//       const data = json?.d?.results || [];

//       if (data.length === 0) {
//         speakFunction("No Data matching");
//         setTimeout(() => {
//           setResult([]);
//         }, 500);
//       } else {
//         speakFunction(`Found ${data.length} Records`);
//         window.speechSynthesis.cancel();

//         const cleaned = data.map(({ __metadata, ...rest }) => rest);
//         setResult(cleaned);

//         const collapsedState = {};
//         cleaned.forEach((_, i) => collapsedState[i] = false); // initially collapsed
//         setExpandedPanels(collapsedState);
//       }
//     } catch (err) {
//       console.error("Fetch Error:", err);
//       setResult([{ error: err.message }]);
//       setStatusCode("Error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const togglePanel = (index) => {
//     setExpandedPanels(prev => ({
//       ...prev,
//       [index]: !prev[index]
//     }));
//   };

//   const bgColors = ['#e3f2fd', '#ffe0b2', '#dcedc8', '#f8bbd0', '#d1c4e9'];

//   return (
//     <div style={{ padding: '30px', fontFamily: 'Segoe UI', backgroundColor: '#f0f4f8' }}>
//       {!showBodyModal && (
//         <>
//           <div className="flex gap-5" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
//             <h2 style={{ color: '#2a2a72', marginBottom: '20px' }}>🎯 Multipurpose OData API Tester</h2>

//             <select value={odataService} onChange={(e) => setOdataService(e.target.value)} style={dropdownStyle}>
//               {odta.map((service, index) => (
//                 <option key={index} value={service}>{service}</option>
//               ))}
//             </select>

//             <select value={method} onChange={(e) => setMethod(e.target.value)} style={dropdownStyle}>
//               {mthds.map((m, index) => (
//                 <option key={index} value={m}>{m}</option>
//               ))}
//             </select>

//             <button onClick={fetchData} style={buttonStyle}>
//               {isLoading ? 'Loading...' : '🚀 Test API'}
//             </button>

//             <button onClick={() => setShowBodyModal(true)} style={buttonStyleGrey}>
//               📝 API BODY
//             </button>
//           </div>

//           <div className='flex text-blue-500' style={{ marginTop: '10px' }}>
//             <strong>🔗 Final URL:</strong>&nbsp; {`${odataService}${method}`}
//           </div>

//           <div style={{ marginTop: '25px' }}>
//             <strong>📦 API Response:</strong> <span style={{ color: '#0077cc' }}>{statusCode || '—'}</span>

//             {result ? (
//               result.map((entry, index) => {
//                 const label = entry.Jobno || `Entry #${index + 1}`;
//                 const isExpanded = expandedPanels[index];
//                 return (
//                   <div
//                     key={index}
//                     style={{
//                       backgroundColor: bgColors[index % bgColors.length],
//                       padding: '15px',
//                       borderRadius: '8px',
//                       marginTop: '12px',
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                         cursor: 'pointer',
//                         fontWeight: 'bold',
//                         fontSize: '18px',
//                         color: '#333',
//                       }}
//                       onClick={() => togglePanel(index)}
//                     >
//                       🔽 {label}
//                       <span>{isExpanded ? '🔼 Collapse' : '🔽 Expand'}</span>
//                     </div>

//                     {isExpanded && (
//                       <div
//                         style={{
//                           marginTop: '15px',
//                           display: 'flex',
//                           flexWrap: 'wrap',
//                           gap: '12px',
//                         }}
//                       >
//                         {Object.entries(entry).map(([key, value], i) => (
//                           <div
//                             key={i}
//                             style={{
//                               flex: '0 1 10%',
//                               backgroundColor: '#fff',
//                               padding: '5px',
//                               borderRadius: '10px',
//                               boxShadow: '0 3px 8px rgba(37, 0, 250, 0.93)',
//                               wordBreak: 'break-word'
//                             }}
//                           >
//                             <strong>{key}</strong>
//                             <div style={{ color: '#333' }}>{String(value)}</div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })
//             ) : (
//               <div style={{
//                 padding: '10px',
//                 backgroundColor: '#fff3cd',
//                 borderRadius: '8px',
//                 marginTop: '10px'
//               }}>
//                 No response yet
//               </div>
//             )}
//           </div>
//         </>
//       )}

//       {/* 🌐 Modal for API BODY input */}
//       {showBodyModal && (
//         <div style={modalContainer}>
//           <h3 style={{ marginBottom: '10px', color: '#333' }}>📝 Enter JSON Body for POST API</h3>
//           <textarea
//             value={apiBody}
//             onChange={(e) => setApiBody(e.target.value)}
//             placeholder='Paste or type valid JSON here...'
//             style={textareaStyle}
//           />
//           <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
//             <button style={buttonStyle} onClick={() => setShowBodyModal(false)}>🔙 Back</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // 🎨 Styles
// const dropdownStyle = {
//   padding: '10px',
//   fontSize: '16px',
//   borderRadius: '6px',
//   border: '1px solid #ccc',
//   backgroundColor: '#ffffff',
// };

// const buttonStyle = {
//   padding: '12px',
//   fontSize: '16px',
//   backgroundColor: '#007bff',
//   color: 'white',
//   border: 'none',
//   borderRadius: '8px',
//   cursor: 'pointer',
// };

// const buttonStyleGrey = {
//   ...buttonStyle,
//   backgroundColor: '#6c757d'
// };

// const modalContainer = {
//   backgroundColor: '#fff',
//   border: '2px solid #007bff',
//   padding: '20px',
//   borderRadius: '10px',
//   width: '80%',
//   margin: 'auto',
//   marginTop: '40px',
//   boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
// };

// const textareaStyle = {
//   width: '100%',
//   height: '200px',
//   padding: '10px',
//   borderRadius: '8px',
//   border: '1px solid #ccc',
//   fontFamily: 'monospace',
//   fontSize: '14px'
// };

// export default ApiTester;







// import React, { useState } from 'react';

// const ApiTester = () => {
//   const odta = [
//     '/sap/opu/odata/sap/ZCWS_WMS_ODATA_SRV/',
//     '/sap/opu/odata/sap/ZRFQ_APPROVAL_SRV/',
//   ];
//   const mthds = ['INSP_MAT_Set/', 'INSP_EQP_Set/', 'RFQ_BILLEDSet/'];

//   const [odataService, setOdataService] = useState(odta[0]);
//   const [method, setMethod] = useState(mthds[0]);
//   const [result, setResult] = useState(null);
//   const [statusCode, setStatusCode] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [expandedPanels, setExpandedPanels] = useState({});

//   const speakFunction = (text) => {
//     const utter = new SpeechSynthesisUtterance(text);
//     window.speechSynthesis.speak(utter);
//   };

//   const fetchData = async () => {
//     setIsLoading(true);
//     const finalUrl = `${odataService}${method}`;

//     try {
//       const resp = await fetch(finalUrl, {
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           Authorization: 'Basic ' + btoa('AMPLCONS:today@02'),
//         },
//       });

//       setStatusCode(resp.status);

//       const json = await resp.json();
//       const data = json?.d?.results || [];

//       if (data.length === 0) {
//         speakFunction("No Data matching");
//         setTimeout(() => {
//           setResult([]);
//         }, 500);
//       } else {
//         speakFunction(`Found ${data.length} Records`);
//         window.speechSynthesis.cancel();

//         const cleaned = data.map(({ __metadata, ...rest }) => rest);
//         setResult(cleaned);

//         const collapsedState = {};
//         cleaned.forEach((_, i) => collapsedState[i] = false); // initially collapsed
//         setExpandedPanels(collapsedState);
//       }
//     } catch (err) {
//       console.error("Fetch Error:", err);
//       setResult([{ error: err.message }]);
//       setStatusCode("Error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const togglePanel = (index) => {
//     setExpandedPanels(prev => ({
//       ...prev,
//       [index]: !prev[index]
//     }));
//   };

//   const bgColors = ['#e3f2fd', '#ffe0b2', '#dcedc8', '#f8bbd0', '#d1c4e9'];

//   return (
//     <div style={{ padding: '30px', fontFamily: 'Segoe UI', backgroundColor: '#f0f4f8' }}>
//       <div className="flex gap-5" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
//         <h2 style={{ color: '#2a2a72', marginBottom: '20px' }}>🎯 Multipurpose OData API Tester</h2>

//         <select value={odataService} onChange={(e) => setOdataService(e.target.value)} style={dropdownStyle}>
//           {odta.map((service, index) => (
//             <option key={index} value={service}>{service}</option>
//           ))}
//         </select>

//         <select value={method} onChange={(e) => setMethod(e.target.value)} style={dropdownStyle}>
//           {mthds.map((m, index) => (
//             <option key={index} value={m}>{m}</option>
//           ))}
//         </select>

//         <button onClick={fetchData} style={buttonStyle}>
//           {isLoading ? 'Loading...' : '🚀 Test API'}
//         </button>
//       </div>

//       <div className='flex text-blue-500' style={{ marginTop: '10px' }}>
//         <strong>🔗 Final URL:</strong>&nbsp; {`${odataService}${method}`}
//       </div>

//       <div style={{ marginTop: '25px' }}>
//         <strong>📦 API Response:</strong> <span style={{ color: '#0077cc' }}>{statusCode || '—'}</span>

//         {result ? (
//           result.map((entry, index) => {
//             const label = entry.Jobno || `Entry #${index + 1}`;
//             const isExpanded = expandedPanels[index];
//             return (
//               <div
//                 key={index}
//                 style={{
//                   backgroundColor: bgColors[index % bgColors.length],
//                   padding: '15px',
//                   borderRadius: '8px',
//                   marginTop: '12px',
//                 }}
//               >
//                 <div
//                   style={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     cursor: 'pointer',
//                     fontWeight: 'bold',
//                     fontSize: '18px',
//                     color: '#333',
//                   }}
//                   onClick={() => togglePanel(index)}
//                 >
//                   🔽 {label}
//                   <span>{isExpanded ? '🔼 Collapse' : '🔽 Expand'}</span>
//                 </div>

//                 {isExpanded && (
//                   <div
//                     style={{
//                       marginTop: '15px',
//                       display: 'flex',
//                       flexWrap: 'wrap',
//                       gap: '12px',
//                     }}
//                   >
//                     {Object.entries(entry).map(([key, value], i) => (
//                       <div
//                         key={i}
//                         style={{
//                           flex: '0 1 10%',
//                           backgroundColor: '#fff',
//                           padding: '5px',
//                           borderRadius: '10px',
//                           boxShadow: '0 3px 8px rgba(37, 0, 250, 0.93)',
//                           wordBreak: 'break-word'
//                         }}
//                       >
//                         <strong>{key}</strong>
//                         <div style={{ color: '#333' }}>{String(value)}</div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             );
//           })
//         ) : (
//           <div style={{
//             padding: '10px',
//             backgroundColor: '#fff3cd',
//             borderRadius: '8px',
//             marginTop: '10px'
//           }}>
//             No response yet
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // 🎨 Styles
// const dropdownStyle = {
//   padding: '10px',
//   fontSize: '16px',
//   borderRadius: '6px',
//   border: '1px solid #ccc',
//   backgroundColor: '#ffffff',
// };

// const buttonStyle = {
//   padding: '12px',
//   fontSize: '16px',
//   backgroundColor: '#007bff',
//   color: 'white',
//   border: 'none',
//   borderRadius: '8px',
//   cursor: 'pointer',
// };

// export default ApiTester;


