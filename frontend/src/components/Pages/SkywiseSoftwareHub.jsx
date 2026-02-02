import { color, hover } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";
import "../Pages/vehicleInfo.css";
import skywiseLogo from "../../assets/skywiselogo.png";
import "./indexpage.css";

const apiCatalog = [
  {
    title: "SAP Hana 2023",
    desc: "Manage Accounts, Supplychain, Procurement, Plant and Maintenance."
  },
  {
    title: "Srishti",
    desc: "Mining Operational Monitoring."
  },
  {
    title: "Drishti",
    desc: "Transportation Management(Coal/OB)."
  },
  {
    title: "LIMS",
    desc: "Manage Coal and Minerals Testing."
  },
  {
    title: "EquiX",
    desc: "Works Management System."
  },
  {
    title: "TMS",
    desc: "Tyre Management System."
  },
  {
    title: "VOLVO API HUB",
    desc: "Volvo Group Vehicle API Collection."
  },
    {
    title: "ATS",
    desc: "Applicant Tracking System."
  }
];

const SkywiseSoftwareHub = () => {
  const navigate = useNavigate();

  const handleCardClick = (title) => {
    // alert(`You clicked on "${title}" API.\n\nPopup for now – routing will be implemented later.`);
    
    if (title === "Srishti") {
      navigate("/srishti-index");
    }


  

    if (title === "LIMS") {
      navigate("/lims-index");
    }

        if (title === "VOLVO API HUB") {
      navigate("/volvo-api-hub");
    }
  };

  return (
    <div style={styles.container}>
      {/* Heading */}
        <header className="animated-heading">
              <img
                src={skywiseLogo}
                alt="Skywise Technologies Logo"
                className="logo"
              />
        </header>
              
      {/* <h1 className="animated-heading2">Skywise Techonologies </h1> */}
      <p style={styles.subHeading}>
        Flight with purpose and confidence.
      </p>

      {/* Cards */}
      <div style={styles.cardGrid}>
        {apiCatalog.map((api, index) => (
          <div
            key={index}
            style={styles.card}
            onClick={() => handleCardClick(api.title)}
            
            onMouseEnter={(e) => {
              e.currentTarget.style.transform       = "scale(1.2)";
              e.currentTarget.style.backgroundColor = "#5fd178ff";
              e.currentTarget.style.color = "red";
            }}

            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(.9)";
              e.currentTarget.style.backgroundColor = "#7b67ebff" 
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

export default SkywiseSoftwareHub;

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
    color: "white",
    hoverBackgroundColor: "yellow",
    hoverColor: "red",
    transform: "scale(.9)",
    padding: "20px",
    borderRadius: "12px",
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
    fontSize: "16px",
    lineHeight: "1.1",
    color: "white"
  }
};
