import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx"; 
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const VolvoTrackScore = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextLink, setNextLink] = useState(null);

  const [vinSearch, setVinSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // const [totalVin, setTotalVin] = useState("0");

  const filteredVehicles = vehicles.filter(v =>
  v.vin?.toLowerCase().includes(vinSearch.toLowerCase())
);

const totalVin = filteredVehicles.length;

  const role = localStorage.getItem("role"); // ADMIN / USER

  const BASE_URL = "http://localhost:8800/api/volvo";

  // =========================
  // Fetch Scores
  // =========================
  const fetchScores = async (url) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const result = data?.vuScoreResponse;



      if (result?.vehicles) {
        setVehicles((prev) => [...prev, ...result.vehicles]);
        setNextLink(
          result.moreDataAvailable ? result.moreDataAvailableLink : null
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    setVehicles([]);
    fetchScores(
      `${BASE_URL}/scores?starttime=${startDate}&stoptime=${endDate}`
    );
  }, []);

useEffect(() => {
  if (!nextLink) {
    // No more data → scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const timer = setTimeout(() => {
//    loadMore();
  }, 1000);

  return () => clearTimeout(timer);
}, [nextLink]);



const loadMore = () => {
  if (nextLink && !loading) {
    fetchScores(
      `${BASE_URL}/proxy?path=${encodeURIComponent(nextLink)}`
    );
  }
};

  // =========================
  // Pagination
  // =========================
  // const loadMore = () => {
  //   if (nextLink) {
  //     fetchScores(
  //       `${BASE_URL}/proxy?path=${encodeURIComponent(nextLink)}`
  //     );
  //   }
  // };

  // =========================
  // VIN Filter



  // =========================
  // CSV Export (Admin Only)
  // =========================
  const exportCSV = () => {
    const headers = [
      "VIN",
      "Total Score",
      "Avg Speed",
      "Distance (km)",
      "Fuel",
      "CO2",
    ];

    const rows = filteredVehicles.map((v) => [
      v.vin,
      v.scores?.total,
      v.avgSpeedDriving,
      (v.totalDistance / 1000).toFixed(2),
      v.avgFuelConsumption,
      v.co2Emissions,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "volvo_vehicle_scores.csv";
    link.click();
  };


const downloadExcel = () => {
  // Convert vehicles data into Excel-friendly JSON
  const excelData = filteredVehicles.map((v, index) => ({
    "S.No": index + 1,
    "VIN Number": v.vin || "",
    "Total Score": v.scores?.total ?? "",
    "Anticipation": v.scores?.anticipation ?? "",
    "Braking": v.scores?.braking ?? "",
    "Coasting": v.scores?.coasting ?? "",
    "Top Gear": v.scores?.topgear ?? "",
    "Speed Adaption": v.scores?.speedAdaption ?? "",
    "Cruise": v.scores?.cruiseControl ?? "",
    "Overspeed": v.scores?.overspeed ?? "",
    "Idling": v.scores?.idling ?? "",
    "Avg Speed": v.avgSpeedDriving ?? "",
    "Distance (km)": v.totalDistance
      ? (v.totalDistance / 1000).toFixed(2)
      : "",
    "Fuel": v.avgFuelConsumption ?? "",
    "CO₂": v.co2Emissions ?? "",
  }));

  // Create worksheet & workbook
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Vehicles");

  // Optional: Auto column width
  worksheet["!cols"] = Object.keys(excelData[0]).map(() => ({
    wch: 18,
  }));

  // Download file
  XLSX.writeFile(workbook, "vehicle.xlsx");
};


      {/* ========================= */}
      {/* Excel Download */}

//   const downloadExcel = () => {
//   let table = `
//     <table border="1">
//       <tr>
//         <th>#</th>
//         <th>VIN</th>
//         <th>Total Score</th>
//         <th>Anticipation</th>
//         <th>Braking</th>
//         <th>Coasting</th>
//         <th>Top Gear</th>
//         <th>Speed Adaption</th>
//         <th>Cruise</th>
//         <th>Overspeed</th>
//         <th>Idling</th>
//         <th>Avg Speed</th>
//         <th>Distance (km)</th>
//         <th>Fuel</th>
//         <th>CO₂</th>
//       </tr>
//   `;

//   // vehicles.forEach((v, index) => {
//   filteredVehicles.forEach((v, index) => {
//     table += `
//       <tr>
//         <td>${index + 1}</td>
//         <td style={{ fontWeight: "bold", color: "red" }}>${v.vin || ""}</td>
//         <td>${v.scores?.total ?? ""}</td>
//         <td style={{ color: "red" }>${v.scores?.anticipation ?? ""}</td>
//         <td>${v.scores?.braking ?? ""}</td>
//         <td>${v.scores?.coasting ?? ""}</td>
//         <td>${v.scores?.topgear ?? ""}</td>
//         <td>${v.scores?.speedAdaption ?? ""}</td>
//         <td>${v.scores?.cruiseControl ?? ""}</td>
//         <td>${v.scores?.overspeed ?? ""}</td>
//         <td>${v.scores?.idling ?? ""}</td>
//         <td>${v.avgSpeedDriving ?? ""}</td>
//         <td>${v.totalDistance ? (v.totalDistance / 1000).toFixed(2) : ""}</td>
//         <td>${v.avgFuelConsumption ?? ""}</td>
//         <td>${v.co2Emissions ?? ""}</td>
//       </tr>
//     `;
//   });

//   table += `</table>`;

//   const blob = new Blob([table], {
//     type: "application/vnd.ms-excel",
//   });

//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "vehicle.html";
//   a.click();
//   window.URL.revokeObjectURL(url);
// };


  return (
    <div style={{ padding: "10px" }}>
   <div className="flex flex-wrap gap-4 ">
     <div>
      
        <p style={{ color: "#d60416ff", fontWeight: "bold" }}>  Volvo Vehicle Performance & Vehicle scores
        </p>

      
        {/* Vehicle scores, fuel efficiency, and CO₂ emissions */}
      {/* </p> */}

     </div>

        <h3
          className="cursor-pointer p-1 w-45 text-center text-lg color-yellow font-semibold rounded-md shadow bg-purple-300 hover:scale-120 transition"
          onClick={() => {
            // navigate('/AITaskCreate');
            // setSelectedStatus(null);
          }}
        >
          Vehicle [ {totalVin}/{vehicles.length} ]
        </h3>
      
        <h3
          className="cursor-pointer p-1 w-40 text-center text-lg font-semibold rounded-md shadow bg-orange-300 hover:scale-120 transition"
          onClick={() => {
            // navigate('/AITaskCreate');
            // setSelectedStatus(null);
          }}
        >
          Avg Fuel  
        </h3>

        <h3
          className="cursor-pointer p-1 w-40 text-center text-lg font-semibold rounded-md shadow bg-yellow-300 hover:scale-120 transition"
          onClick={() => {
            // navigate('/AITaskCreate');
            // setSelectedStatus(null);
          }}
        >
          Avg Speed
        </h3>

        <h3
          className="cursor-pointer  p-1 w-45 text-center text-lg font-semibold rounded-md shadow bg-green-300 hover:scale-120 transition"
          onClick={() => {
            // navigate('/AITaskCreate');
            // setSelectedStatus(null);
          }}
        >
          Avg Distance
        </h3>


    {!nextLink && vehicles.length > 0 && (
     <button
      onClick={downloadExcel}
      style={{
        padding: "4px 10px",
        backgroundColor: "#2e7d32",
        color: "white",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold"
      }}
    >
      Download(Excel)
    </button>
    )}


       </div>   
      {/* ========================= */}
      {/* Filters */}
      {/* ========================= */}
      <div style={{ marginBottom: 15 }}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ marginLeft: 8 }}
        />
        <button
          style={{ marginLeft: 8 }}
          onClick={() => {
            setVehicles([]);
            setNextLink(null);
            fetchScores(
              `${BASE_URL}/scores?starttime=${startDate}&stoptime=${endDate}`
            );
          }}
        >
          Apply
        </button>

        <input
          type="text"
          placeholder="Search by VIN"
          value={vinSearch}
          onChange={(e) => setVinSearch(e.target.value)}
          style={{ marginLeft: 10, padding: 0, width: 150 }}
        />

        {role === "ADMIN" && (
          <button
            onClick={exportCSV}
            style={{ marginLeft: 10 }}
          >
            Export CSV
          </button>
        )}
 

  </div>

  

      {/* ========================= */}
      {/* Chart */}
      {/* ========================= */}
      {/* <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filteredVehicles}>
          <XAxis dataKey="vin" hide />
          <YAxis />
          <Tooltip />
         <Bar dataKey="scores.total" />
        </BarChart>
      </ResponsiveContainer> */}

      {/* ========================= */}
      {/* Table */}
      {/* ========================= */}
      {loading && <p style={{ color: "red", fontWeight: "bold" }} >Loading data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ overflowX: "auto" }}>
        <table border="0" cellPadding="0" width="100%">

            <thead style={{ backgroundColor: "#7c0fe2ff", color: "white", fontWeight: "bold" }}>

            <tr>
              <th>#</th>
              <th>VIN</th>
              <th>Total</th>
              <th>Anticipation</th>
              <th>Braking</th>
              <th>Coasting</th>
              <th>Top Gear</th>
              <th>Speed Adaption</th>
              <th>Cruise</th>
              <th>Overspeed</th>
              <th>Idling</th>
              <th>Avg Speed</th>
              <th>Distance (km)</th>
              <th>Fuel</th>
              <th>CO₂</th>
            </tr>
          </thead>

          <tbody>
            {filteredVehicles.map((v, index) => (
              <tr key={`${v.vin}-${index}`}
                style={{backgroundColor: index % 2 === 0 ? "rgba(229, 230, 225, 1)" : "rgba(255, 255, 255, 255)", }}
                >

                <td>{index + 1}</td>
                <td style={{ fontWeight: "bold", color: "red" }}>{v.vin}</td>
                <td>{v.scores?.total?.toFixed(2) ?? "-"}</td>
                <td>{v.scores?.anticipation ?? "-"}</td>
                <td>{v.scores?.braking ?? "-"}</td>
                <td>{v.scores?.coasting ?? "-"}</td>
                <td>{v.scores?.topgear ?? "-"}</td>
                <td>{v.scores?.speedAdaption ?? "-"}</td>
                <td>{v.scores?.cruiseControl ?? "-"}</td>
                <td>{v.scores?.overspeed ?? "-"}</td>
                <td>{v.scores?.idling ?? "-"}</td>
                <td>{v.avgSpeedDriving ?? "-"}</td>
                <td>
                  {v.totalDistance
                    ? (v.totalDistance / 1000).toFixed(2)
                    : "-"}
                </td>
                <td>{v.avgFuelConsumption ?? "-"}</td>
                <td>{v.co2Emissions ?? "-"}</td>
              </tr>
            ))}

            {!filteredVehicles.length && !loading && (
              <tr>
                <td colSpan="15" align="center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* {nextLink && (
        <button
          onClick={loadMore}
          disabled={loading}
          style={{ marginTop: 15 }}
        >
          Load More
        </button>
      )} */}

    </div>
  );
};

export default VolvoTrackScore;

