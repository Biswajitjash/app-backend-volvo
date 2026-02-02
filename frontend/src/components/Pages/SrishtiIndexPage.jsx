import React from "react";
import "./indexpage.css";
import skywiseLogo from "../../assets/skywiselogo.png";

const indexItems = [
  { id: 1, title: "Overview", desc: "Srishti platform introduction and purpose" },
  { id: 2, title: "Architecture", desc: "System architecture and integrations" },
  { id: 3, title: "Modules", desc: "Functional modules and capabilities" },
  { id: 4, title: "Data Flow", desc: "End-to-end operational data flow" },
  { id: 5, title: "Security", desc: "Authentication, authorization & compliance" },
];

const SrishtiIndexPage = () => {
  return (
    <div className="container">
      
      {/* Header Section */}
      <header className="header">
        <img
          src={skywiseLogo}
          alt="Skywise Technologies Logo"
          className="logo"
        />
        <h1>Srishti</h1>
        <p className="subtitle">
          Mining Operational Monitoring Platform
        </p>
      </header>

      {/* Index Section */}
      <section className="index">
        <h2>Index</h2>
        <ul>
          {indexItems.map((item) => (
            <li key={item.id}>
              <span className="index-no">{item.id}.</span>
              <div className="index-content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

    </div>
  );
};

export default SrishtiIndexPage;
