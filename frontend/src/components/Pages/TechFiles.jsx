import React from "react";
import "../Pages/vehicleInfo.css";

const apiCatalog = [
  {
    title: "H-1",
    desc: "Product (vehicle) information "
  },
  {
    title: "h2",
    desc: "Detailed reading information."
  },
  {
    title: "h-3",
    desc: "Metadata information for parameters."
  },
  {
    title: "h-4",
    desc: "Vehicle sensor(s) data values."
  }
];

const TechFiles = () => {
  const handleCardClick = (title) => {
    alert(`You clicked on "${title}" API`);
  };

  return (
    <div style={styles.container}>
      {/* Animated Heading */}
      <h1 className="animated-heading">Group Techo Files </h1>

      <p style={styles.subHeading}>
        Standardized API that enables authorized access to selected
        vehicle-generated data.
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
              e.currentTarget.style.backgroundColor = "#54e680";
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

export default TechFiles;

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
