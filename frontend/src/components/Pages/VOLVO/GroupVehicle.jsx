import React from "react";
import "../vehicleInfo.css";

const apiCatalog = [
  {
    title: "List of vehicles",
    desc: "The vehicle resource is used to get a list of all the vehicles the client credentials has access to. The vehicle list is always returned in the same order."
  },
  {
    title: "Positions for one or more vehicles",
    desc: "The vehicle position resource is used to get the positions for one or several vehicles. The starttime, stoptime & latestOnly parameters can be used to get all historical positions between a start and stop time or the latest known position only. The vin parameter can be used to get all historical positions between starttime and stoptime or latest position for one individual vehicle. If the vin parameter isn’t set the response will contain all vehicles the client has access to. If a request is made for data in a period where no data has been received, an empty list will be returned."
  },
  {
    title: "Status for one or more vehicles",
    desc: "The vehicle status resource is used to get the status reports for one or several vehicles. Using the starttime, stoptime & latestOnly parameters it can be used to get all historical status reports between a start and stop time or the latest known status only. Using the vin parameter it can be used to get all historical vehicle reports or latest status for one individual vehicle. If a request is made for data in a period where no data has been received, an empty list will be returned."
  }

];

const GroupVehicle = () => {
  const handleCardClick = (title) => {
    // alert(`You clicked on "${title}" API`);
    if (title === "List of vehicles") {
      window.location.href = "/list-of-vehicles";
    }
 
    if (title === "Positions for one or more vehicles") {
      window.location.href = "/position-of-vehicles";
    }
 
 
        if (title === "Status for one or more vehicles") {
      window.location.href = "/status-of-vehicles";
    }

  };

  return (
    <div style={styles.container}>
      {/* Animated Heading */}
      <h1 className="animated-heading">Vehicle Data </h1>

      <p style={styles.subHeading}>
Volvo Group vehicle API
      </p>

      {/* Cards */}
      <div style={styles.cardGrid}>
        {apiCatalog.map((api, index) => (
          <div
            key={index}
            style={styles.card}
            onClick={() => handleCardClick(api.title)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.backgroundColor = "#fa38da";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.backgroundColor = "#4a48da";
            }}
          >
            <h3 style={styles.cardTitle}>{api.title}</h3>
            <p style={styles.cardDesc}>{api.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupVehicle;

/* ===================== STYLES ===================== */

const styles = {
  container: {
    padding: "10px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif"
  },
  subHeading: {
    fontSize: "15px",
    color: "red",
    marginBottom: "10px"
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(1, 1fr)",
    gap: "10px",
    maxWidth: "700px",
    margin: "0 auto"
  },
  card: {
    backgroundColor: "#5664ddff",
    color: "white",
    padding: "15px",
    borderRadius: "30px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 6px 15px rgba(0,0,0,0.15)"
  },
  cardTitle: {
    fontSize: "25px",
    fontWeight: "bold",
    marginBottom: "8px",
    color: "yellow"
  },
  cardDesc: {
    fontSize: "16px",
    lineHeight: "1.3",
    color: "white"
  }
};
