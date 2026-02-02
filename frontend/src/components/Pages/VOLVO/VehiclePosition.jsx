import { useState, useRef } from "react";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import "../vehicleInfo.css";

const VehiclePosition = () => {

  /* ---------------- CONFIG ---------------- */

  const collectionsConfig = {
    "1 Vehicles Position": {
      url: "https://api.volvotrucks.com/vehicle/vehiclepositions",
      params: [
        { key: "requestId", value: "" },
        { key: "datetype", value: "received" },
        { key: "starttime", value: "2026-01-05T00:00:00Z" },
        { key: "endtime", value: "2026-01-15T00:00:00Z" },
        { key: "vin", value: "" } ,
        { key: "latestOnly", value: "false" },
        { key: "triggerFilter", value: "" },
        { key: "lastVin", value: "" } 
      ],
      headers: [
        {
          key: "Accept",
          value: "application/x.volvogroup.com.vehiclepositions.v1.0+json; UTF-8"
        }
      ]
    }
  };

  const collectionNames = Object.keys(collectionsConfig);

  /* ---------------- STATE ---------------- */

  const [selectedCollection, setSelectedCollection] = useState(collectionNames[0]);
  const [url, setUrl] = useState(collectionsConfig[collectionNames[0]].url);
  const [params, setParams] = useState(collectionsConfig[collectionNames[0]].params);
  const [headers, setHeaders] = useState(collectionsConfig[collectionNames[0]].headers);

  const [username, setUsername] = useState("BB3F384DD9");
  const [password, setPassword] = useState("2j6yCXK1vd");


  const [status, setStatus] = useState(null);
  const [response, setResponse] = useState(null);

  const [allVehicles, setAllVehicles] = useState([]);
  const [viewMode, setViewMode] = useState("table");
  const [loading, setLoading] = useState(false);

  const responseEndRef = useRef(null);

  /* ---------------- HELPERS ---------------- */

  const buildQueryFromParams = (paramsArr) =>
    paramsArr
      .filter(p => p.key && p.value)
      .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
      .join("&");

  /* ---------------- API CALL (PAGINATED) ---------------- */

  const sendRequest = async () => {
    setLoading(true);
    setAllVehicles([]);
    setResponse(null);

    let hasMore = true;
    let accumulatedVehicles = [];
    let localParams = [...params];

    try {
      while (hasMore) {
        const query = buildQueryFromParams(localParams);

        const res = await fetch(`${url}?${query}`, {
          method: "GET",
          headers: {
            ...Object.fromEntries(headers.map(h => [h.key, h.value])),
            Authorization: "Basic " + btoa(`${username}:${password}`)
          }
        });

        setStatus(res.status);
        const data = await res.json();

        const vehicles = data?.vehiclePositionResponse?.vehiclePositions || [];
        const moreDataAvailable = data?.vehiclePositionResponse?.moreDataAvailable;

        accumulatedVehicles = [...accumulatedVehicles, ...vehicles];

        if (moreDataAvailable && vehicles.length > 0) {
          const lastVin = vehicles[vehicles.length - 1].vin;
          localParams = localParams.map(p =>
            p.key === "lastVin" ? { ...p, value: lastVin } : p
          );
        }

        hasMore = moreDataAvailable === true;
      }

      setAllVehicles(accumulatedVehicles);
      setResponse({ vehicleResponse: { vehicles: accumulatedVehicles } });

      setTimeout(() => {
        responseEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 2000);

    } catch (err) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FLATTEN VEHICLE ---------------- */

const flattenVehicle = (vehicle, index) => ({
  rowNo: index + 1, // ✅ first column

  vin: vehicle.vin || "",

  // ---- Trigger Type ----
  triggerType: vehicle.triggerType?.triggerType || "",
  triggerContext: vehicle.triggerType?.context || "",

  // ---- Timestamps ----
  createdDateTime: vehicle.createdDateTime || "",
  receivedDateTime: vehicle.receivedDateTime || "",

  // ---- GNSS Position ----
  latitude: vehicle.gnssPosition?.latitude ?? "",
  longitude: vehicle.gnssPosition?.longitude ?? "",
  heading: vehicle.gnssPosition?.heading ?? "",
  altitude: vehicle.gnssPosition?.altitude ?? "",
  speed: vehicle.gnssPosition?.speed ?? "",
  positionDateTime: vehicle.gnssPosition?.positionDateTime || "",

  // ---- Other ----
  wheelBasedSpeed: vehicle.wheelBasedSpeed ?? ""
});


  const getFlattenedVehicles = () =>
    allVehicles.map((v, idx) => flattenVehicle(v, idx));

  /* ---------------- EXCEL DOWNLOAD ---------------- */

  const downloadExcel = () => {
    if (allVehicles.length === 0) {
      alert("No vehicle data available");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(getFlattenedVehicles());
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Vehicles");
    XLSX.writeFile(workbook, "volvo-vehicles-data.xlsx");
  };

  /* ---------------- TABLE ---------------- */

  const renderTable = () => {
    const data = getFlattenedVehicles();
    if (data.length === 0) return null;

    const columns = Object.keys(data[0]);

    return (
      <div className="overflow-x-auto" style={{ maxHeight: "500px" }}>
        <table className="min-w-full bg-white text-sm ">
          <thead className="bg-green-600 text-white  sticky top-0">
            <tr>
              {columns.map(col => (
                <th key={col} className="px-3 py-2 border">
                  {col.replace(/_/g, " ").toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
                {columns.map(col => (
                  <td key={col} className="px-3 py-2 border whitespace-nowrap">
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div ref={responseEndRef} />
      </div>
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="p-5 max-w-8xl space-y-2">

      <div className="flex gap-2 items-center">
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

        <input
          className="border p-2 w-[600px] rounded"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />

        <button
          onClick={sendRequest}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Send
        </button>



        {loading && (
          <span className="text-blue-600 font-semibold">
            Fetching all pages…
          </span>
        )}
      </div>


     {/* Params */}
       <div>
         <h2 className="pt-2 font-medium text-red-500">Params</h2>
         {params.map((p, i) => (
           <div key={i} className="flex gap-2 mt-2 items-center">
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


      <div className="flex gap-2">
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

      {status === 200 && allVehicles.length > 0 && (
        <div className="flex justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 rounded ${viewMode === "table" ? "bg-gray-800 text-white" : "bg-gray-300"}`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode("json")}
              className={`px-3 py-1 rounded ${viewMode === "json" ? "bg-gray-800 text-white" : "bg-gray-300"}`}
            >
              JSON
            </button>
          </div>

          <button
            onClick={downloadExcel}
            className="px-3 py-1 bg-green-600 text-white rounded flex items-center gap-2"
          >
            <Download size={16} />
            Download Excel
          </button>
        </div>
      )}

      {viewMode === "table" ? renderTable() : (
        <pre className="bg-black text-white p-4 rounded text-sm overflow-auto">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default VehiclePosition;


