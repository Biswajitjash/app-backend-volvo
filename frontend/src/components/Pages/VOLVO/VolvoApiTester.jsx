import { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";

const ApiTester = () => {

  const collectionsConfig = {
    
    "1 BVI-Products-failed": {
      url: "https://api.volvotrucks.com/vdds/products",
      params: [
        { key: "requestId", value: "" },
        { key: "vin", value: "" },
        { key: "lastVin", value: "YV2XBZ0G3S8996544" }
      ],
     headers: [
        {
          key: "Accept", 
          value: "application/x.volvogroup.com.products.v1.0+json; UTF-8"
        }
      ],
    },

    "1 BVI-Reading-failed": {
      url: "https://api.volvotrucks.com/vdds/products/getreadings",
      params: [
        { key: "requestId", value: "" },
        { key: "FilterReadings", value: ""  , required: true },
        ],
     headers: [
        {
          key: "Accept", 
          value: "application/x.volvogroup.com.readings.v1.0+json; UTF-8"
        }
      ],
    },

   "1 BVI-Parameters metadata-failed": {
      url: "https://api.volvotrucks.com/vdds/parameters",
      params: [
        { key: "requestId", value: "" },
        { key: "parametersIds", value: "CSOME__VALUE", required: true },
        ],
     headers: [
        {
          key: "Accept", 
          value: "application/x.volvogroup.com.parameters.v1.0+json; UTF-8"
        }
      ],
    },
 
 
    "rFMS-Get vehicle positions-failed": {
      url: "https://api.volvotrucks.com/rfms/vehiclepositions",
      params: [
        { key: "vin", value: "YV2XBZ0G3S8996544" },
        { key: "starttime", value: "2026-01-20T00:00:486Z" },
        { key: "stoptime",  value: "2026-01-20T23:59:486Z" },
        {
          key: "datetype",  value: ["received"], type: "multi" },

          {
          key: "triggerFilter",
                              value: ["TIMER",
                                      "TELL_TALE",
                                      "DRIVER_LOGIN",
                                      // "DRIVER_LOGOUT",
                                      // "IGNITION_ON",
                                      // "IGNITION_OFF",
                                      // "ENGINE_ON",
                                      // "ENGINE_OFF",
                                      // "PTO_ENABLED",
                                      // "PTO_DISABLED",
                                      // "DISTANCE_TRAVELLED",
                                      // "DRIVER_1_WORKING_STATE_CHANGED",
                                      "DRIVER_2_WORKING_STATE_CHANGED"], type: "multi" },
        // { key: "latestOnly", value: ["false","true"],  type: "multi" },
        ],
     headers: [
        {
          key: "Accept", 
          value: "application/vnd.fmsstandard.com.Vehiclepositions.v2.1+xml; UTF-8"
        }
      ],
    },

    "vehicle APIs List of vehicle": {
      url: "https://api.volvotrucks.com/vehicle/vehicles",
      params: [
        { key: "requestId", value: "" },
        { key: "additionalContent", value: "VOLVOGROUPVEHICLE" },
        { key: "lastVin", value: "" },
        ],
     headers: [
        {
          key: "Accept", 
          value: "application/x.volvogroup.com.vehicles.v1.0+json; UTF-8"
        }
      ],
    },


        "vehicle APIs vehicle position": {
      url: "https://api.volvotrucks.com/vehicle/vehiclepositions",
      params: [
        { key: "requestId", value: "" },
        { key: "datetype", value: "received" },
        { key: "starttime", value: "2026-01-20T00:00:00Z" },
        { key: "stoptime",  value: "2026-01-20T23:59:59Z" },
        { key: "vin", value: "YV2XBZ0G3S8996530" },

        { key: "latestOnly", value: "false" },
        { key: "triggerFilter", value: "" },
        { key: "lastVin", value: "" },
        ],
     headers: [
        {
          key: "Accept", 
          value: "application/x.volvogroup.com.vehiclepositions.v1.0+json; UTF-8"
        }
      ],
    },


    
        "vehicle APIs vehicle Status": {
      url: "https://api.volvotrucks.com/vehicle/vehiclestatuses",
      params: [
        { key: "requestId", value: "" },
        { key: "datetype", value: "received" },
        { key: "starttime", value: "2026-01-20T00:00:00Z" },
        { key: "stoptime",  value: "2026-01-20T23:59:59Z" },
        { key: "vin", value: "YV2XBZ0G3S8996530" },
        { key: "contentFilter", value: "ACCUMULATED" },
        { key: "additionalContent", value: "VOLVOGROUPSNAPSHOT" },
        { key: "triggerFilter", value: "TIMER,DRIVER_LOGIN,DISTANCE_TRAVELLED" },
        { key: "latestOnly", value: "false" },
        { key: "triggerFilter", value: "" },
        { key: "lastVin", value: "" },
        ],
     headers: [
        {
          key: "Accept", 
          value: "application/x.volvogroup.com.vehiclestatuses.v1.0+json; UTF-8"
        }
      ],
    },

    
 ///////////////////////////////////////////////////////// 

    "Score for Single": {
      url: "https://api.volvotrucks.com/score/scores",
      params: [
        { key: "vin", value: "YV2XBZ0G3S8996530" },
        {
          key: "contentFilter",
          value: ["VEHICLES", "DRIVERS", "FLEET"], type: "multi" },
        { key: "starttime", value: "2026-01-20", required: true },
        { key: "stoptime", value: "2026-01-20", required: true }
      ],
     headers: [
        {
          key: "Accept", 
          value: "application/x.volvogroup.com.scores.v2.0+json; UTF-8"
        }
      ],
    },

    "Volvo Scores After Vin": {
      url: "https://api.volvotrucks.com/score/scores",
      params: [
        { key: "requestId", value: "" },
        { key: "starttime", value: "2026-01-20", required: true },
        { key: "stoptime", value: "2026-01-20", required: true },
        { key: "vin", value: "" },
        { key: "driverIdType",  value: ["Tacho", "pin", "USB"], type: "multi" },
        { key: "driverId",  value: "" },
        { key: "contentFilter", value: ["VEHICLES", "DRIVERS", "FLEET"], type: "multi" },
        { key: "lastVin", value: "YV2XBZ0G3S8996530" },
        { key: "lastDriverId", value: "" },
      ],
     headers: [
        {
          key: "Accept", 
          value: "application/x.volvogroup.com.scores.v2.0+json; UTF-8"
        }
      ],
    }

  };

  const collectionNames = Object.keys(collectionsConfig);

  const [selectedCollection, setSelectedCollection] = useState(collectionNames[0]);
  const [url, setUrl] = useState(collectionsConfig[collectionNames[0]].url);
  const [params, setParams] = useState(collectionsConfig[collectionNames[0]].params);
  const [headers, setHeaders] = useState(collectionsConfig[collectionNames[0]].headers);

   const [username, setUsername] = useState("BB3F384DD9");
  const [password, setPassword] = useState("2j6yCXK1vd");


  // const [headers] = useState([
  //   {
  //     key: "Accept",
  //     value: "application/x.volvogroup.com.scores.v2.0+json; UTF-8"
  //   }
  // ]);

  const [response, setResponse] = useState(null);
  const responseEndRef = useRef(null);
  const [status, setStatus] = useState(null);

  /* ---------------- HELPERS ---------------- */

  // Build query string
  const buildQuery = () =>
    params
      .filter(p => p.key && p.value)
      .map(p => {

          // ✅ FIX: Ensure starttime / stoptime are valid ISO-8601 (UTC)
      // if (p.key === "starttime" || p.key === "stoptime") {
      //   const valueWithZ = p.value.endsWith("Z")
      //     ? p.value
      //     : `${p.value}Z`;

      //   return `${encodeURIComponent(p.key)}=${encodeURIComponent(valueWithZ)}`;
      // }

        if (p.type === "multi" && Array.isArray(p.value)) {
          // COMMA separated as required by API
          return `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value.join(","))}`;
        }
        return `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`;
      })
      .join("&");

  // Build Postman CLI preview
  const buildPostmanCli = () => {
    const query = buildQuery();
    const headerLines = headers
      .map(h => `--header '${h.key}: ${h.value}' \\\n`)
      .join("");

    return `postman request '${url}?${query}' \\\n${headerLines}--auth-basic-username '${username}' \\\n--auth-basic-password '********'`;
  };

  /* ---------------- API CALL ---------------- */

  const sendRequest = async () => {
    setResponse(null);
    alert(`API Request Preview:\n\n${buildPostmanCli()}`);

    try {
      const res = await fetch(`${url}?${buildQuery()}`, {
        method: "GET",
        headers: {
          ...Object.fromEntries(headers.map(h => [h.key, h.value])),
          Authorization: "Basic " + btoa(`${username}:${password}`)
        }
      });

      setStatus(res.status);
      const data = await res.json();
      setResponse(data);
      // Scroll to bottom like CTRL+END after success
      setTimeout(() => {
        responseEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setResponse({ error: err.message });
      alert(`Error: ${err.message}`);
    }
  };

  /* ---------------- EXCEL SUPPORT ---------------- */

  // const flattenObject = (obj, parent = "", res = {}) => {
  //   for (const key in obj) {
  //     // Remove top-level object name from Excel headers
  //     const cleanKey = parent ? parent.split(".").slice(1).concat(key).join(".") : key;

  //     if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
  //       flattenObject(obj[key], cleanKey, res);
  //     } else {
  //       res[cleanKey] = obj[key];
  //     }
  //   }
  //   return res;
  // };


  const flattenObject = (obj, parent = "", res = {}) => {
  for (const key in obj) {
    const newKey = parent ? `${parent}.${key}` : key;

    if (
      obj[key] &&
      typeof obj[key] === "object" &&
      !Array.isArray(obj[key])
    ) {
      flattenObject(obj[key], newKey, res);
    } else {
      res[newKey] = obj[key];
    }
  }
  return res;
};

// Build rows exactly as per requirement
const buildScoreRows = (apiResponse) => {
  const rows = [];

  const data = apiResponse?.vuScoreResponse;
  if (!data) return rows;

  /* -------- Fleet Row -------- */
  if (data.fleet) {
    const fleetRow = {
      recordType: "FLEET",
      vin: "",
      ...data.fleet.scores,
      totalTime: data.fleet.totalTime,
      avgSpeedDriving: data.fleet.avgSpeedDriving,
      totalDistance: data.fleet.totalDistance,
      avgFuelConsumption: data.fleet.avgFuelConsumption,
      avgFuelConsumptionGaseous: data.fleet.avgFuelConsumptionGaseous,
      avgElectricEnergyConsumption: data.fleet.avgElectricEnergyConsumption,
      vehicleUtilization: data.fleet.vehicleUtilization,
      co2Emissions: data.fleet.co2Emissions,
      co2Saved: data.fleet.co2Saved
    };

    rows.push(fleetRow);
  }


  /* -------- Vehicle Rows -------- */
  if (Array.isArray(data.vehicles)) {
    data.vehicles.forEach(vehicle => {
      const vehicleRow = {
        recordType: "VEHICLE",
        vin: vehicle.vin,
        ...vehicle.scores,
        totalTime: vehicle.totalTime,
        avgSpeedDriving: vehicle.avgSpeedDriving,
        totalDistance: vehicle.totalDistance,
        avgFuelConsumption: vehicle.avgFuelConsumption,
        avgFuelConsumptionGaseous: vehicle.avgFuelConsumptionGaseous,
        avgElectricEnergyConsumption: vehicle.avgElectricEnergyConsumption,
        vehicleUtilization: vehicle.vehicleUtilization,
        co2Emissions: vehicle.co2Emissions,
        co2Saved: vehicle.co2Saved
      };

      rows.push(vehicleRow);
    });
  }

  return rows;
};

const downloadExcel = () => {
  if (!response) return;

  const rows = buildScoreRows(response);

  if (!rows.length) {
    alert("No score data available to export");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Scores");
  XLSX.writeFile(workbook, "vu-score-report.xlsx");
};
  // const downloadExcel = () => {
  //   if (!response) return;

  //   const rows = Array.isArray(response)
  //     ? response.map(r => flattenObject(r))
  //     : [flattenObject(response)];

  //   const worksheet = XLSX.utils.json_to_sheet(rows);
  //   const workbook = XLSX.utils.book_new();

  //   XLSX.utils.book_append_sheet(workbook, worksheet, "API Response");
  //   XLSX.writeFile(workbook, "api-response.xlsx");
  // };

  /* ---------------- UI ---------------- */

  return (
    <div className="p-5 max-w-8xl  space-y-0">
      <div className="flex"> 

      {/* Collection */}
      <select
        className="border p-1 rounded"
        value={selectedCollection}
        onChange={e => {
          const col = e.target.value;
          setSelectedCollection(col);
          setUrl(collectionsConfig[col].url);
          setParams(collectionsConfig[col].params);
          setHeaders(collectionsConfig[col].headers);
        }}
      >
        {collectionNames.map(c => (
          <option key={c}>{c}</option>
        ))}
      </select>

      {/* URL */}
      <div className="flex gap-2">
        <input
          className=" border p-2 w-150 rounded"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <button
          onClick={sendRequest}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Send
        </button>
      </div>
      <h1 className="ml-25  text-2xl text-red-500 font-semibold">VOLVO API Tester</h1>

</div>  
      {/* Params */}
      <div>
        <h2 className="pt-2 font-medium text-red-500">Params</h2>

        {params.map((p, i) => (

<div key={i} className="flex gap-2 mt-2 items-center">
    {/* Param Name with mandatory indicator */}
    <label className="border p-1 rounded w-1/3 bg-gray-50 flex items-center gap-1">
      <span>{p.key}</span>
      {p.required && <span className="text-red-600">*</span>}
    </label>

    <input
      className={`border p-1 rounded flex-1 ${
        p.required && !p.value ? "border-red-500" : ""
      }`}
      value={p.value}
      onChange={e => {
        const copy = [...params];
        copy[i].value = e.target.value;
        setParams(copy);
      }}
    />
  </div>       
        ))}

      </div>

      {/* Authorization */}
      <div>
        <h2 className="font-medium pt-2 text-red-500">Authorization (Basic)</h2>
        <div className="flex gap-2 mt-1">
          <input
            placeholder="Username"
            className="border p-2 rounded w-1/2"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded w-1/2"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
      </div>

      {/* Headers */}
      <div>
        <h2 className="font-medium pt-2 text-red-500">Headers</h2>
        {headers.map((h, i) => (
          <div key={i} className="flex gap-2 mt-1">
            <input className="border p-1 rounded w-1/3" value={h.key} readOnly />
            <input className="border p-1 rounded flex-1" value={h.value} readOnly />
          </div>
        ))}
      </div>

      {/* Response */}
      <div>
        <div className="flex gap-5">
        <h2 className="font-medium pt-2 text-green-500 mb-2">Response</h2>
         {status && <p className={`font-bold pt-2 ${status === 200 ? "text-green-500" : "text-red-500" }`} >Status: {status}</p>}
</div>
        {status === 200 && (
          <div className="flex gap-2 justify-between ">
            <button className="px-3 py-1 bg-gray-800 text-white rounded text-sm">
              JSON
            </button>
            <button
              onClick={downloadExcel}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm"
            >
              Excel
            </button>
          </div>
        )}

       

        <pre
          className="bg-black text-white p-4 rounded text-sm overflow-auto"
          style={{ maxHeight: "600px" }}
        >
          {response && JSON.stringify(response, null, 2)}
          <div ref={responseEndRef} />
        </pre>
      </div>
    </div>
  );
};

export default ApiTester;



// import { useState, useRef, useEffect } from "react";
// import * as XLSX from "xlsx";

// const ApiTester = () => {

//   const collectionsConfig = {
    
//     "1 BVI-Products-failed": {
//       url: "https://api.volvotrucks.com/vdds/products",
//       params: [
//         { key: "requestId", value: "" },
//         { key: "vin", value: "YV2XBZ0G3S8996530" },
//         { key: "lastVin", value: "" }
//       ],
//      headers: [
//         {
//           key: "Accept", 
//           value: "application/x.volvogroup.com.products.v1.0+json; UTF-8"
//         }
//       ],
//     },

//     "1 BVI-Reading-failed": {
//       url: "https://api.volvotrucks.com/vdds/products/getreadings",
//       params: [
//         { key: "requestId", value: "" },
//         { key: "FilterReadings", value: "CSOME__VALUE", required: true },
//         ],
//      headers: [
//         {
//           key: "Accept", 
//           value: "application/x.volvogroup.com.readings.v1.0+json; UTF-8"
//         }
//       ],
//     },

//    "1 BVI-Parameters metadata-failed": {
//       url: "https://api.volvotrucks.com/vdds/parameters",
//       params: [
//         { key: "requestId", value: "" },
//         { key: "parametersIds", value: "CSOME__VALUE", required: true },
//         ],
//      headers: [
//         {
//           key: "Accept", 
//           value: "application/x.volvogroup.com.parameters.v1.0+json; UTF-8"
//         }
//       ],
//     },

//        "1 BVI-Parameters get Single Value-failed": {
//       url: "https://api.volvotrucks.com/vdds/parameters",
//       params: [
//         { key: "requestId", value: "" },
//         { key: "parametersIds", value: "CSOME__VALUE", required: true },
//         ],
//      headers: [
//         {
//           key: "Accept", 
//           value: "application/x.volvogroup.com.parameters.v1.0+json; UTF-8"
//         }
//       ],
//     },


//  ///////////////////////////////////////////////////////// 

//     "Score for Single": {
//       url: "https://api.volvotrucks.com/score/scores",
//       params: [
//         { key: "vin", value: "YV2XBZ0G3S8996530" },
//         {
//           key: "contentFilter",
//           value: ["VEHICLES", "DRIVERS", "FLEET"],
//           type: "multi"
//         },
//         { key: "starttime", value: "2025-12-25" },
//         { key: "stoptime", value: "2026-01-04" }
//       ],
//      headers: [
//         {
//           key: "Accept", 
//           value: "application/x.volvogroup.com.scores.v2.0+json; UTF-8"
//         }
//       ],
//     },

//     "Volvo Scores After Vin": {
//       url: "https://api.volvotrucks.com/score/scores",
//       params: [
//         { key: "lastVin", value: "YV2XBZ0G3S8996530" },
//         { key: "contentFilter", value: ["VEHICLES"], type: "multi" },
//         { key: "starttime", value: "2025-12-25" },
//         { key: "stoptime", value: "2026-01-04" }
//       ],
//      headers: [
//         {
//           key: "Accept", 
//           value: "application/x.volvogroup.com.scores.v2.0+json; UTF-8"
//         }
//       ],
//     },

//     "Test Collection": {
//       url: "https://api.volvotrucks.com/score/scores",
//       params: [
//         { key: "lastVin", value: "YV2XBZ0G3S8996530" },
//         { key: "contentFilter", value: ["VEHICLES"], type: "multi" },
//         { key: "starttime", value: "2025-12-25" },
//         { key: "stoptime", value: "2026-01-04" }
//       ],
//      headers: [
//         {
//           key: "Accept", 
//           value: "application/x.volvogroup.com.scores.v2.0+json; UTF-8"
//         }
//       ],
//     }

//   };

//   const collectionNames = Object.keys(collectionsConfig);

//   const [selectedCollection, setSelectedCollection] = useState(collectionNames[0]);
//   const [url, setUrl] = useState(collectionsConfig[collectionNames[0]].url);
//   const [params, setParams] = useState(collectionsConfig[collectionNames[0]].params);
//   const [headers, setHeaders] = useState(collectionsConfig[collectionNames[0]].headers);

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   // const [headers] = useState([
//   //   {
//   //     key: "Accept",
//   //     value: "application/x.volvogroup.com.scores.v2.0+json; UTF-8"
//   //   }
//   // ]);

//   const [response, setResponse] = useState(null);
//   const responseEndRef = useRef(null);
//   const [status, setStatus] = useState(null);

//   /* ---------------- HELPERS ---------------- */

//   // Build query string
//   const buildQuery = () =>
//     params
//       .filter(p => p.key && p.value)
//       .map(p => {
//         if (p.type === "multi" && Array.isArray(p.value)) {
//           // COMMA separated as required by API
//           return `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value.join(","))}`;
//         }
//         return `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`;
//       })
//       .join("&");

//   // Build Postman CLI preview
//   const buildPostmanCli = () => {
//     const query = buildQuery();
//     const headerLines = headers
//       .map(h => `--header '${h.key}: ${h.value}' \\\n`)
//       .join("");

//     return `postman request '${url}?${query}' \\\n${headerLines}--auth-basic-username '${username}' \\\n--auth-basic-password '********'`;
//   };

//   /* ---------------- API CALL ---------------- */

//   const sendRequest = async () => {
//     setResponse(null);
//     alert(`API Request Preview:\n\n${buildPostmanCli()}`);

//     try {
//       const res = await fetch(`${url}?${buildQuery()}`, {
//         method: "GET",
//         headers: {
//           ...Object.fromEntries(headers.map(h => [h.key, h.value])),
//           Authorization: "Basic " + btoa(`${username}:${password}`)
//         }
//       });

//       setStatus(res.status);
//       const data = await res.json();
//       setResponse(data);
//       // Scroll to bottom like CTRL+END after success
//       setTimeout(() => {
//         responseEndRef.current?.scrollIntoView({ behavior: "smooth" });
//       }, 100);
//     } catch (err) {
//       setResponse({ error: err.message });
//       alert(`Error: ${err.message}`);
//     }
//   };

//   /* ---------------- EXCEL SUPPORT ---------------- */

//   const flattenObject = (obj, parent = "", res = {}) => {
//     for (const key in obj) {
//       // Remove top-level object name from Excel headers
//       const cleanKey = parent ? parent.split(".").slice(1).concat(key).join(".") : key;

//       if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
//         flattenObject(obj[key], cleanKey, res);
//       } else {
//         res[cleanKey] = obj[key];
//       }
//     }
//     return res;
//   };

//   const downloadExcel = () => {
//     if (!response) return;

//     const rows = Array.isArray(response)
//       ? response.map(r => flattenObject(r))
//       : [flattenObject(response)];

//     const worksheet = XLSX.utils.json_to_sheet(rows);
//     const workbook = XLSX.utils.book_new();

//     XLSX.utils.book_append_sheet(workbook, worksheet, "API Response");
//     XLSX.writeFile(workbook, "api-response.xlsx");
//   };

//   /* ---------------- UI ---------------- */

//   return (
//     <div className="p-5 max-w-8xl  space-y-0">
//       <div className="flex"> 

//       {/* Collection */}
//       <select
//         className="border p-1 rounded"
//         value={selectedCollection}
//         onChange={e => {
//           const col = e.target.value;
//           setSelectedCollection(col);
//           setUrl(collectionsConfig[col].url);
//           setParams(collectionsConfig[col].params);
//           setHeaders(collectionsConfig[col].headers);
//         }}
//       >
//         {collectionNames.map(c => (
//           <option key={c}>{c}</option>
//         ))}
//       </select>

//       {/* URL */}
//       <div className="flex gap-2">
//         <input
//           className=" border p-2 w-150 rounded"
//           value={url}
//           onChange={e => setUrl(e.target.value)}
//         />
//         <button
//           onClick={sendRequest}
//           className="px-4 py-2 bg-green-500 text-white rounded"
//         >
//           Send
//         </button>
//       </div>
//       <h1 className="ml-25  text-2xl text-red-500 font-semibold">VOLVO API Tester</h1>

// </div>  
//       {/* Params */}
//       <div>
//         <h2 className="pt-2 font-medium text-red-500">Params</h2>

//         {params.map((p, i) => (

// <div key={i} className="flex gap-2 mt-2 items-center">
//     {/* Param Name with mandatory indicator */}
//     <label className="border p-1 rounded w-1/3 bg-gray-50 flex items-center gap-1">
//       <span>{p.key}</span>
//       {p.required && <span className="text-red-600">*</span>}
//     </label>

//     <input
//       className={`border p-1 rounded flex-1 ${
//         p.required && !p.value ? "border-red-500" : ""
//       }`}
//       value={p.value}
//       onChange={e => {
//         const copy = [...params];
//         copy[i].value = e.target.value;
//         setParams(copy);
//       }}
//     />
//   </div>       
//         ))}

//       </div>

//       {/* Authorization */}
//       <div>
//         <h2 className="font-medium pt-2 text-red-500">Authorization (Basic)</h2>
//         <div className="flex gap-2 mt-1">
//           <input
//             placeholder="Username"
//             className="border p-2 rounded w-1/2"
//             value={username}
//             onChange={e => setUsername(e.target.value)}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             className="border p-2 rounded w-1/2"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Headers */}
//       <div>
//         <h2 className="font-medium pt-2 text-red-500">Headers</h2>
//         {headers.map((h, i) => (
//           <div key={i} className="flex gap-2 mt-1">
//             <input className="border p-1 rounded w-1/3" value={h.key} readOnly />
//             <input className="border p-1 rounded flex-1" value={h.value} readOnly />
//           </div>
//         ))}
//       </div>

//       {/* Response */}
//       <div>
//         <div className="flex gap-5">
//         <h2 className="font-medium pt-2 text-green-500 mb-2">Response</h2>
//          {status && <p className={`font-bold pt-2 ${status === 200 ? "text-green-500" : "text-red-500" }`} >Status: {status}</p>}
// </div>
//         {status === 200 && (
//           <div className="flex gap-2 justify-between ">
//             <button className="px-3 py-1 bg-gray-800 text-white rounded text-sm">
//               JSON
//             </button>
//             <button
//               onClick={downloadExcel}
//               className="px-3 py-1 bg-green-600 text-white rounded text-sm"
//             >
//               Excel
//             </button>
//           </div>
//         )}

       

//         <pre
//           className="bg-black text-white p-4 rounded text-sm overflow-auto"
//           style={{ maxHeight: "600px" }}
//         >
//           {response && JSON.stringify(response, null, 2)}
//           <div ref={responseEndRef} />
//         </pre>
//       </div>
//     </div>
//   );
// };

// export default ApiTester;
