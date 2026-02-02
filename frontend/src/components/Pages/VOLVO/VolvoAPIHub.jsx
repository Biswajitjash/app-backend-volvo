import { color, hover } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";
import "../vehicleInfo.css";

const apiCatalog = [
  {
    title: "Vehicle Information",
    desc: "Authorized access to selected vehicle-generated data."
  },
  {
    title: "rFMS specification",
    desc: "Retrieval of vehicle information, position and vehicle status."
  },
  {
    title: "Volvo Group Driver",
    desc: "Get driver information and driver times for one or several drivers."
  },
  {
    title: "Volvo Group Messaging",
    desc: "Communicate with users in Volvo Connect portal, mobile app, and onboard Messaging app."
  },
  {
    title: "Volvo Group Scores",
    desc: "Returns driver and vehicle utilization scores for a fleet over a given time period."
  },
  {
    title: "Volvo Group Tachograph Files",
    desc: "Get driver card files and/or tachograph files for drivers and vehicles."
  },
  {
    title: "Volvo Group Vehicle Alerts",
    desc: "Get vehicle alerts and event details such as fuel level status and position."
  },
  {
    title: "Volvo Group Vehicle API",
    desc: "Get vehicle data including positions and vehicle statuses."
  },
  {
    title: "API Testing",
    desc: "Send VOVLO API Call and View Response"
  }
];

const VolvoAPIHub = () => {
  const navigate = useNavigate();

  const handleCardClick = (title) => {
    // alert(`You clicked on "${title}" API.\n\nPopup for now – routing will be implemented later.`);

   
    if (title === "Vehicle Information") {
      navigate("/vehicle-info");
    }

    if (title === "rFMS specification") {
      navigate("/rfms-spec");
    }

    if (title === "Volvo Group Driver") {
      navigate("/volvo-group-driver");
    }

    if (title === "Volvo Group Messaging") {
      navigate("/volvo-group-messaging");
    }
    if (title === "Volvo Group Scores") {
      navigate("/VolvoTrackScore2");
    }
    if (title === "Volvo Group Tachograph Files") {
      navigate("/volvo-group-tech-files");
    }
    if (title === "Volvo Group Vehicle Alerts") {
      navigate("/volvo-group-vehicle-alert");
    }
    if (title === "Volvo Group Vehicle API") {
      navigate("/volvo-group-vehicle-Api");
    }
     if (title === "API Testing") {
      navigate("/volvo-api-tester");
    }

  };

  const getCardBackground = (title) => {
    switch (title) {
      case "Volvo Group Vehicle API":
        return "#fa38da"; // light pink
      case "Volvo Group Scores":
        return "#fa38da"; // light pink
      case "API Testing":
        return "#fa38da"; // light pink
      case "Truck Analytics API":
        return "#c8e6f5"; // light blue
      case "Fleet Management API":
        return "#d4f5c8"; // light green
      default:
        return "#7b67ebff"; // default purple
    }
  };

  const getCardColor = (title) => {
    switch (title) {
      case "Volvo Group Vehicle API":
        return "#f84e42"; // light pink
      default:
        return "rgb(255, 255, 255)"; // default purple
    }
  };

  return (
    <div style={styles.container}>
      {/* Heading */}
      <h1 className="animated-heading2">Volvo API Catalog</h1>
      <p style={styles.subHeading}>
        Explore the possibilities with Volvo Group APIs.
      </p>

      <div style={styles.cardGrid}>
        {apiCatalog.map((api, index) => (
          <div
            key={index}
            style={{
              ...styles.card,
              backgroundColor: getCardBackground(api.title),
              color: getCardColor(api.title),
            }}
            onClick={() => handleCardClick(api.title)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
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

export default VolvoAPIHub;

/* ===================== STYLES ===================== */

const styles = {
  container: {
    padding: "40px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif"
  },
  heading: {
    fontSize: "50px",
    color: "blue",
    fontWeight: "bold",
    marginBottom: "0px"
  },
  subHeading: {
    fontSize: "15px",
    color: "red",
    marginBottom: "40px"
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px"
  },
  card: {
    backgroundColor: "#7b67ebff", // light blue
    // color: "white",
    // hoverBackgroundColor: "yellow",
    // hoverColor: "red",
    transform: "scale(.9)",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "transform 0.3s ease",
    boxShadow: "0 6px 15px rgba(0,0,0,0.15)"
  },
  cardTitle: {
    fontSize: "25px",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "yellow"
  },
  cardDesc: {
    fontSize: "14px",
    lineHeight: "1.5",
    color: "white"
  }
};
