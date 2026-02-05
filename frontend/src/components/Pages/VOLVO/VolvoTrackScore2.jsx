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

const VolvoTrackScore2 = () => {
  const [vehicles, setVehicles] = useState([]);
  const [vehiclesid, setVehiclesId] = useState([]);
  const [vehicleStatuses, setVehicleStatuses] = useState([]);

  const [fleetdata, setFleetData] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  
  const [error, setError] = useState(null);
  const [error2, setError2] = useState(null);
  const [error3, setError3] = useState(null);
  
  const [nextLink, setNextLink] = useState(null);
  const [nextLink2, setNextLink2] = useState(null);
  const [nextLink3, setNextLink3] = useState(null);

  const [vinSearch, setVinSearch] = useState("");
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredVehicles = vehicles.filter(v =>
    v.vin?.toLowerCase().includes(vinSearch.toLowerCase())
  );

  const filteredFleetData = vehicles.filter(v =>
    v.vin?.toLowerCase().includes(vinSearch.toLowerCase())
  );

  const totalVin = filteredVehicles.length;

  const role = localStorage.getItem("role"); // ADMIN / USER

   // const BASE_URL  = "http://localhost:8800/api/volvo";
  // const BASE_URL2 = "http://localhost:8800/api/rfms";
  // const BASE_URL3 = "http://localhost:8800/api/rfms2";
const prd_url = 'https://app-backend-volvo.onrender.comgit';

const BASE_URL  = "https://app-backend-volvo.onrender.com/api/volvo";
const BASE_URL2 = "https://app-backend-volvo.onrender.com/api/rfms";
const BASE_URL3 = "https://app-backend-volvo.onrender.com/api/rfms2";

  https://app-backend-volvo.onrender.com/
// const BASE_URL  = `${import.meta.env.VITE_API_UR}/api/volvo`;
// const BASE_URL2 = `${import.meta.env.VITE_API_URL}/api/rfms`;
// const BASE_URL3 = `${import.meta.env.VITE_API_URL}/api/rfms2`;


// =========================
  // Fetch Scores (First API)
  // =========================
  const fetchScores = async (url) => {
    console.log("🟢 Fetching Volvo Scores from:", url);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      console.log("🟢 Volvo Response status:", response.status);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const result = data?.vuScoreResponse;
      console.log("🟢 Volvo Data received:", result);

      if (result?.vehicles) {
        setVehicles((prev) => [...prev, ...result.vehicles]);
        setNextLink(
          result.moreDataAvailable ? result.moreDataAvailableLink : null
        );
        console.log("🟢 NextLink set to:", result.moreDataAvailable ? result.moreDataAvailableLink : "null");
      }

      if (result?.fleet) {
        setFleetData((prev) => [...prev, ...result.fleet]);
      }

    } catch (err) {
      console.error("🔴 Volvo Scores Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

// =========================
// Fetch Scores2 (Second API - RFMS Vehicles)
// =========================
const fetchScores2 = async (url) => {
  console.log("🔵 Fetching RFMS from:", url);
  setLoading2(true);
  setError2(null);

  try {
    const response2 = await fetch(url);
    console.log("🔵 RFMS Response status:", response2.status);

    if (!response2.ok) {
      throw new Error(`API Error: ${response2.status}`);
    }
    
    const data2 = await response2.json();
    const result2 = data2?.vehicleResponse;
    console.log("🔵 RFMS Data received:", result2);

    if (result2?.vehicles) {
      setVehiclesId((prev) => [...prev, ...result2.vehicles]);
      
      // Check if we have exactly 100 vehicles (pagination limit)
      if (result2.vehicles.length === 100) {
        // Access the last vehicle (index 99) to get its VIN for pagination
        const lastVin = result2.vehicles[99]?.vin;
        
        if (lastVin) {
          setNextLink2(`/vehicle/vehicles?additionalContent=VOLVOGROUPVEHICLE&lastVin=${lastVin}`);
          console.log("🔵 NextLink2 set with lastVin:", lastVin);
        } else {
          setNextLink2(null);
          console.warn("⚠️ Last vehicle has no VIN");
        }
      } else {
        // Less than 100 vehicles means no more data
        setNextLink2(null);
        console.log("🔵 No more RFMS data (received", result2.vehicles.length, "vehicles)");
      }
      
    } else if (Array.isArray(result2)) {
      setVehiclesId((prev) => [...prev, ...result2]);
      setNextLink2(null);
    } else {
      console.warn("⚠️ Unexpected RFMS response structure:", result2);
    }

  } catch (err) {
    console.error("🔴 RFMS Error:", err);
    setError2(err.message);
  } finally {
    setLoading2(false);
  }
};


// =========================
// Fetch Scores3 (Third API - RFMS Vehicle Statuses)
// =========================
const fetchScores3 = async (url) => {
  console.log("🟡 Fetching Vehicle Statuses from:", url);
  setLoading3(true);
  setError3(null);

  try {
    const response3 = await fetch(url);
    console.log("🟡 Vehicle Statuses Response status:", response3.status);

    if (!response3.ok) {
      const errorData = await response3.json().catch(() => ({ error: 'Unknown error' }));
      console.error("🟡 Error response:", errorData);
      throw new Error(`API Error: ${response3.status} - ${JSON.stringify(errorData)}`);
    }

    const data3 = await response3.json();
    console.log("🟡 Vehicle Statuses Full Response:", data3);
    console.log("🟡 VehicleStatus Array Length:", data3?.VehicleStatus?.length);

    // Handle the response structure: { VehicleStatus: [...] }
    if (data3?.VehicleStatus && Array.isArray(data3.VehicleStatus)) {
      setVehicleStatuses((prev) => [...prev, ...data3.VehicleStatus]);
      
      // Check if we have exactly 1000 vehicle statuses (pagination limit)
      if (data3.VehicleStatus.length === 100) {
        // Access the last vehicle status (index 999) to get its VIN for pagination
        const lastVin = data3.VehicleStatus[99]?.Vin;
        
        if (lastVin) {
          // Format dates to ISO format in UTC for API 3
          const formatDateToUTC = (dateStr, isEndOfDay = false) => {
            if (!dateStr) return '';
            // Create date in UTC to avoid timezone conversion
            const [year, month, day] = dateStr.split('-');
            if (isEndOfDay) {
              return `${year}-${month}-${day}T23:59:59.999Z`;
            } else {
              return `${year}-${month}-${day}T00:00:00.000Z`;
            }
          };
          
          const formattedStartDate = startDate ? formatDateToUTC(startDate, false) : '';
          const formattedEndDate = endDate ? formatDateToUTC(endDate, true) : '';

          // Build the path with all parameters including lastVin
          const path = `/rfms/vehiclestatuses?starttime=${encodeURIComponent(formattedStartDate)}&stoptime=${encodeURIComponent(formattedEndDate)}&datetype=received&contentFilter=ACCUMULATED&latestOnly=false&lastVin=${encodeURIComponent(lastVin)}`;
          
          setNextLink3(path);
          console.log("🟡 NextLink3 set with path:", path);
          console.log("🟡 LastVin:", lastVin);
        } else {
          setNextLink3(null);
          console.warn("⚠️ Last vehicle status has no VIN");
        }
      } else {
        // Less than 1000 statuses means no more data
        setNextLink3(null);
        console.log("🟡 No more data available (received", data3.VehicleStatus.length, "statuses)");
      }
      
    } else {
      console.warn("⚠️ Unexpected Vehicle Statuses response structure:", data3);
    }

  } catch (err) {
    console.error("🔴 Vehicle Statuses Error:", err);
    setError3(err.message);
  } finally {
    setLoading3(false);
  }
};


  // =========================
  // Initial Load - NO API CALLS on mount
  // =========================
  useEffect(() => {
    // Don't fetch anything on initial load
    // User must click "Apply" button to fetch data
    console.log("📌 Component mounted - waiting for user to click Apply button");
  }, []);

  // =========================
  // Auto-load more data when nextLink changes (API 1)
  // =========================
  useEffect(() => {
    if (!nextLink) {
      // No more data
      if (vehicles.length > 0) {
        console.log("✅ All Volvo Scores data loaded. Total vehicles:", vehicles.length);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const timer = setTimeout(() => {
      console.log("⏳ Auto-loading more Volvo Scores data...");
      loadMore();
    }, 1000);

    return () => clearTimeout(timer);
  }, [nextLink]);

  const loadMore = () => {
    if (nextLink && !loading) {
      console.log("🟢 Loading more with nextLink:", nextLink);
      fetchScores(
        `${BASE_URL}/proxy?path=${encodeURIComponent(nextLink)}`
      );
    }
  };

  // =========================
  // Auto-load more data when nextLink2 changes (API 2)
  // =========================
  useEffect(() => {
    if (!nextLink2) {
      // No more data
      if (vehiclesid.length > 0) {
        console.log("✅ All RFMS Vehicles data loaded. Total vehicles:", vehiclesid.length);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const timer = setTimeout(() => {
      console.log("⏳ Auto-loading more RFMS Vehicles data...");
      loadMore2();
    }, 1000);

    return () => clearTimeout(timer);
  }, [nextLink2]);

  const loadMore2 = () => {
    if (nextLink2 && !loading2) {
      console.log("🔵 Loading more with nextLink2:", nextLink2);
      fetchScores2(
        `${BASE_URL2}/proxy?path=${encodeURIComponent(nextLink2)}`
      );
    }
  };

  // =========================
  // Auto-load more data when nextLink3 changes (API 3)
  // =========================
  useEffect(() => {
    if (!nextLink3) {
      // No more data
      if (vehicleStatuses.length > 0) {
        console.log("✅ All Vehicle Statuses data loaded. Total statuses:", vehicleStatuses.length);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const timer = setTimeout(() => {
      console.log("⏳ Auto-loading more Vehicle Statuses data...");
      loadMore3();
    }, 1000);

    return () => clearTimeout(timer);
  }, [nextLink3]);

  const loadMore3 = () => {
    if (nextLink3 && !loading3) {
      console.log("🟡 Loading more with nextLink3:", nextLink3);
      fetchScores3(
        `${BASE_URL3}/proxy?path=${encodeURIComponent(nextLink3)}`
      );
    }
  };

  console.log("📊 Current State:", {
    vehiclesCount: vehicles.length,
    vehiclesIdCount: vehiclesid.length,
    vehicleStatusesCount: vehicleStatuses.length
  });

  // =========================
  // Merge Data by VIN
  // =========================
  const mergeDataByVin = () => {
    console.log("🔄 Merging data by VIN...");
    
    const mergedData = vehicles.map((vehicle) => {
      // Find matching vehicle details by VIN
      const vehicleDetails = vehiclesid.find(v => v.vin === vehicle.vin);
      
      // Find matching vehicle status by VIN
      const vehicleStatus = vehicleStatuses.find(vs => vs.Vin === vehicle.vin);
      
      return {
        ...vehicle,
        vehicleDetails: vehicleDetails || null,
        vehicleStatus: vehicleStatus || null
      };
    });
    
    console.log("✅ Merged data created:", mergedData.length, "records");
    return mergedData;
  };

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

  // =========================
  // Excel Export - Merged Data + Separate Sheets
  // =========================
  const downloadExcel = () => {
    if (!filteredVehicles.length) {
      alert("No data to export");
      return;
    }

    console.log("📥 Preparing Excel export with merged data and separate sheets...");

    // Get merged data
    const mergedData = mergeDataByVin();

    // ===========================
    // SHEET 1: Merged Vehicle Data
    // ===========================
    const mergedExcelData = mergedData
      .filter(m => filteredVehicles.some(fv => fv.vin === m.vin)) // Apply VIN search filter
      .map((m, index) => ({
        "S.No": index + 1,
        "VIN Number": m.vin || "",
        
        // Scores data (from API 1)
        "Total Score": m.scores?.total ?? "",
        "Anticipation": m.scores?.anticipation ?? "",
        "Braking": m.scores?.braking ?? "",
        "Coasting": m.scores?.coasting ?? "",
        "Engine & Gear Utilization": m.scores?.engineAndGearUtilization ?? "",
        "Within Economy": m.scores?.withinEconomy ?? "",
        "Above Economy": m.scores?.aboveEconom ?? "",
        "Engine Load": m.scores?.engineLoad ?? "",
        "Overrev": m.scores?.overrev ?? "",
        "Top Gear": m.scores?.topgear ?? "",
        "Speed Adaption": m.scores?.speedAdaption ?? "",
        "Cruise Control": m.scores?.cruiseControl ?? "",
        "Overspeed": m.scores?.overspeed ?? "",
        "Standstill": m.scores?.standstill ?? "",
        "Idling": m.scores?.idling ?? "",
        "Total Time": m.totalTime ?? "",
        "Avg Speed": m.avgSpeedDriving ?? "",
        "Total Distance (km)": m.totalDistance ? (m.totalDistance / 1000).toFixed(2) : "",
        "Avg Fuel Consumption": m.avgFuelConsumption ?? "",
        "Vehicle Utilization": m.vehicleUtilization ?? "",
        "CO2 Emissions": m.co2Emissions ?? "",
        "CO2 Saved": m.co2Saved ?? "",
        
        // Vehicle Details data (from API 2)
        "Customer Vehicle Name": m.vehicleDetails?.customerVehicleName ?? "",
        "Brand": m.vehicleDetails?.brand ?? "",
        "Model": m.vehicleDetails?.model ?? "",
        "Type": m.vehicleDetails?.type ?? "",
        "Production Date": m.vehicleDetails?.productionDate 
          ? `${m.vehicleDetails.productionDate.year}-${String(m.vehicleDetails.productionDate.month).padStart(2, '0')}-${String(m.vehicleDetails.productionDate.day).padStart(2, '0')}`
          : "",
        "Emission Level": m.vehicleDetails?.emissionLevel ?? "",
        "Country of Operation": m.vehicleDetails?.volvoGroupVehicle?.countryOfOperation ?? "",
        "Delivery Date": m.vehicleDetails?.volvoGroupVehicle?.deliveryDate ?? "",
        "Registration Number": m.vehicleDetails?.volvoGroupVehicle?.registrationNumber ?? "",
        "Road Condition": m.vehicleDetails?.volvoGroupVehicle?.roadCondition ?? "",
        "Transport Cycle": m.vehicleDetails?.volvoGroupVehicle?.transportCycle ?? "",
        "Road Overspeed Limit": m.vehicleDetails?.volvoGroupVehicle?.vehicleReportSettings?.roadOverspeedLimit ?? "",
        
        // Vehicle Status data (from API 3)
        "Trigger Type": m.vehicleStatus?.TriggerType?.TriggerType ?? "",
        "Created DateTime": m.vehicleStatus?.CreatedDateTime ?? "",
        "Received DateTime": m.vehicleStatus?.ReceivedDateTime ?? "",
        "HR Total Vehicle Distance": m.vehicleStatus?.HRTotalVehicleDistance ?? "",
        "Total Engine Hours": m.vehicleStatus?.TotalEngineHours ?? "",
        "Driver1 ID": m.vehicleStatus?.Driver1Id?.OemDriverIdentification?.OemDriverIdentification ?? "",
        "Gross Combination Vehicle Weight": m.vehicleStatus?.GrossCombinationVehicleWeight ?? "",
        "Engine Total Fuel Used": m.vehicleStatus?.EngineTotalFuelUsed ?? "",
        "Duration Wheelbase Speed Over Zero": m.vehicleStatus?.AccumulatedData?.DurationWheelbaseSpeedOverZero ?? "",
        "Distance Cruise Control Active": m.vehicleStatus?.AccumulatedData?.DistanceCruiseControlActive ?? "",
        "Duration Cruise Control Active": m.vehicleStatus?.AccumulatedData?.DurationCruiseControlActive ?? "",
        "Fuel Consumption Cruise Control Active": m.vehicleStatus?.AccumulatedData?.FuelConsumptionCruiseControlActive ?? "",
        "Duration Wheelbase Speed Zero": m.vehicleStatus?.AccumulatedData?.DurationWheelbaseSpeedZero ?? "",
        "Fuel Wheelbase Speed Zero": m.vehicleStatus?.AccumulatedData?.FuelWheelbaseSpeedZero ?? "",
        "Fuel Wheelbase Speed Over Zero": m.vehicleStatus?.AccumulatedData?.FuelWheelbaseSpeedOverZero ?? "",
        "Brake Pedal Counter Speed Over Zero": m.vehicleStatus?.AccumulatedData?.BrakePedalCounterSpeedOverZero ?? "",
        "Distance Brake Pedal Active Speed Over Zero": m.vehicleStatus?.AccumulatedData?.DistanceBrakePedalActiveSpeedOverZero ?? "",
      }));

    // ===========================
    // SHEET 2: Vehicle Details (API 2 data)
    // ===========================
    const vehicleDetailsData = vehiclesid.map((v, index) => ({
      "S.No": index + 1,
      "VIN": v.vin || "",
      "Customer Vehicle Name": v.customerVehicleName || "",
      "Brand": v.brand || "",
      "Model": v.model || "",
      "Type": v.type || "",
      "Production Date": v.productionDate 
        ? `${v.productionDate.year}-${String(v.productionDate.month).padStart(2, '0')}-${String(v.productionDate.day).padStart(2, '0')}`
        : "",
      "Fuel Type": v.possibleFuelType ? v.possibleFuelType.join(", ") : "",
      "Emission Level": v.emissionLevel || "",
      "Country of Operation": v.volvoGroupVehicle?.countryOfOperation || "",
      "Delivery Date": v.volvoGroupVehicle?.deliveryDate || "",
      "Registration Number": v.volvoGroupVehicle?.registrationNumber || "",
      "Road Condition": v.volvoGroupVehicle?.roadCondition || "",
      "Transport Cycle": v.volvoGroupVehicle?.transportCycle || "",
      "Road Overspeed Limit": v.volvoGroupVehicle?.vehicleReportSettings?.roadOverspeedLimit || "",
      "Connected Services": v.volvoGroupVehicle?.connectedServices ? v.volvoGroupVehicle.connectedServices.join(", ") : "",
    }));

    // ===========================
    // SHEET 3: Vehicle Statuses (API 3 data)
    // ===========================
    const vehicleStatusesData = vehicleStatuses.map((vs, index) => ({
      "S.No": index + 1,
      "VIN": vs.Vin || "",
      "Trigger Type": vs.TriggerType?.TriggerType || "",
      "Trigger Context": vs.TriggerType?.Context || "",
      "Created DateTime": vs.CreatedDateTime || "",
      "Received DateTime": vs.ReceivedDateTime || "",
      "HR Total Vehicle Distance": vs.HRTotalVehicleDistance || "",
      "Total Engine Hours": vs.TotalEngineHours || "",
      "Driver1 ID": vs.Driver1Id?.OemDriverIdentification?.OemDriverIdentification || "",
      "Gross Combination Vehicle Weight": vs.GrossCombinationVehicleWeight || "",
      "Engine Total Fuel Used": vs.EngineTotalFuelUsed || "",
      
      // Accumulated Data
      "Duration Wheelbase Speed Over Zero": vs.AccumulatedData?.DurationWheelbaseSpeedOverZero || "",
      "Distance Cruise Control Active": vs.AccumulatedData?.DistanceCruiseControlActive || "",
      "Duration Cruise Control Active": vs.AccumulatedData?.DurationCruiseControlActive || "",
      "Fuel Consumption Cruise Control Active": vs.AccumulatedData?.FuelConsumptionCruiseControlActive || "",
      "Duration Wheelbase Speed Zero": vs.AccumulatedData?.DurationWheelbaseSpeedZero || "",
      "Fuel Wheelbase Speed Zero": vs.AccumulatedData?.FuelWheelbaseSpeedZero || "",
      "Fuel Wheelbase Speed Over Zero": vs.AccumulatedData?.FuelWheelbaseSpeedOverZero || "",
      "Brake Pedal Counter Speed Over Zero": vs.AccumulatedData?.BrakePedalCounterSpeedOverZero || "",
      "Distance Brake Pedal Active Speed Over Zero": vs.AccumulatedData?.DistanceBrakePedalActiveSpeedOverZero || "",
    }));

    if (!mergedExcelData.length) {
      alert("No matching data to export");
      return;
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Add Sheet 1: Merged Data
    const mergedSheet = XLSX.utils.json_to_sheet(mergedExcelData);
    mergedSheet["!cols"] = Object.keys(mergedExcelData[0] || {}).map(() => ({ wch: 25 }));
    XLSX.utils.book_append_sheet(workbook, mergedSheet, "Merged Vehicle Data");

    // Add Sheet 2: Vehicle Details
    if (vehicleDetailsData.length > 0) {
      const vehicleSheet = XLSX.utils.json_to_sheet(vehicleDetailsData);
      vehicleSheet["!cols"] = Object.keys(vehicleDetailsData[0] || {}).map(() => ({ wch: 25 }));
      XLSX.utils.book_append_sheet(workbook, vehicleSheet, "Vehicle");
    }

    // Add Sheet 3: Vehicle Statuses
    if (vehicleStatusesData.length > 0) {
      const statusSheet = XLSX.utils.json_to_sheet(vehicleStatusesData);
      statusSheet["!cols"] = Object.keys(vehicleStatusesData[0] || {}).map(() => ({ wch: 25 }));
      XLSX.utils.book_append_sheet(workbook, statusSheet, "VehicleStatus");
    }

    // Download file
    const fileName = `vehicle_data_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    console.log(`✅ Excel exported with ${workbook.SheetNames.length} sheets: ${fileName}`);
    console.log(`   - Sheet 1: Merged Vehicle Data (${mergedExcelData.length} rows)`);
    console.log(`   - Sheet 2: Vehicle (${vehicleDetailsData.length} rows)`);
    console.log(`   - Sheet 3: VehicleStatus (${vehicleStatusesData.length} rows)`);
  };

  return (
    <div style={{ padding: "10px" }}>
      <div className="flex flex-wrap gap-4 ">
        <div>
          <p style={{ color: "#d60416ff", fontWeight: "bold" }}>
            Volvo Vehicle Performance & Vehicle scores
          </p>
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

        { vehicles.length > 0 && (
          <button
            onClick={downloadExcel}
            style={{
              padding: "4px 10px",
              backgroundColor: "#2e7d32",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              borderRadius: "4px"
            }}
          >
            Download Merged Data (Excel)
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
          placeholder="Start Date"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ marginLeft: 8 }}
          placeholder="End Date"
        />
        <button
          style={{ 
            marginLeft: 8,
            padding: "6px 12px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
          onClick={() => {
            console.log("🔄 Apply button clicked - Fetching all APIs...");
            
            setVehicles([]);
            setVehiclesId([]);
            setVehicleStatuses([]);
            setNextLink(null);
            setNextLink2(null);
            setNextLink3(null);
            
            // Format dates to ISO format in UTC for API 3
            const formatDateToUTC = (dateStr, isEndOfDay = false) => {
              if (!dateStr) return '';
              // Create date in UTC to avoid timezone conversion
              const [year, month, day] = dateStr.split('-');
              if (isEndOfDay) {
                return `${year}-${month}-${day}T23:59:59.999Z`;
              } else {
                return `${year}-${month}-${day}T00:00:00.000Z`;
              }
            };
            
            const formattedStartDate = startDate ? formatDateToUTC(startDate, false) : '';
            const formattedEndDate = endDate ? formatDateToUTC(endDate, true) : '';
            
            console.log("📅 Formatted dates:", { 
              original: { startDate, endDate },
              formatted: { formattedStartDate, formattedEndDate }
            });
            
            Promise.all([
              fetchScores(`${BASE_URL}/scores?starttime=${startDate}&stoptime=${endDate}`),
              fetchScores2(`${BASE_URL2}/vehicles`),
              fetchScores3(`${BASE_URL3}/vehiclestatuses?starttime=${formattedStartDate}&stoptime=${formattedEndDate}&datetype=received&contentFilter=ACCUMULATED&latestOnly=false`)
            ]).catch(err => {
              console.error("❌ Error fetching APIs:", err);
            });
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
      {/* Loading & Error States */}
      {/* ========================= */}
      {loading && <p style={{ color: "red", fontWeight: "bold" }}>Loading Volvo Scores data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading2 && <p style={{ color: "blue", fontWeight: "bold" }}>Loading RFMS Vehicles data...</p>}
      {error2 && <p style={{ color: "blue" }}>{error2}</p>}
      {loading3 && <p style={{ color: "orange", fontWeight: "bold" }}>Loading Vehicle Statuses...</p>}
      {error3 && <p style={{ color: "orange" }}>{error3}</p>}

      {/* ========================= */}
      {/* Table */}
      {/* ========================= */}
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
              <tr 
                key={`${v.vin}-${index}`}
                style={{
                  backgroundColor: index % 2 === 0 ? "rgba(229, 230, 225, 1)" : "rgba(255, 255, 255, 255)", 
                }}
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
    </div>
  );
};

export default VolvoTrackScore2;

