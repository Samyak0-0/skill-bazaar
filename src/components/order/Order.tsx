"use client";

import React, { useState } from "react";
import Sold from "./sold";
import Bought from "./bought";

export default function Orders() {
  const [activeTab, setActiveTab] = useState("sold");
  const [hoveredTab, setHoveredTab] = useState<string | null>(null); // Add hovered state

  return (
    <div style={styles.container}>
      {/* Tabs */}
      <div style={styles.tabContainer}>
        {["sold", "bought"].map((tab) => (
          <button
            key={tab}
            style={{
              ...styles.tabButton,
              ...(activeTab === tab ? styles.activeTab : {}),
              ...(hoveredTab === tab ? styles.hoverTab : {}),
            }}
            onClick={() => setActiveTab(tab)}
            onMouseEnter={() => setHoveredTab(tab)} // Set hovered tab on mouse enter
            onMouseLeave={() => setHoveredTab(null)} // Clear hovered tab on mouse leave
          >
            {tab === "sold" ? "Sold by" : "Bought by"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={styles.tabContent}>
        {activeTab === "sold" ? <Sold /> : <Bought />}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "90%",
    margin: "30px auto",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "black",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  tabContainer: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#d1d5db",
    borderBottom: "1px solid #ddd",
  },
  tabButton: {
    flex: 1,
    padding: "15px",
    cursor: "pointer",
    fontWeight: "bold",
    color: "black",
    backgroundColor: "transparent",
    transition: "color 0.3s ease, background-color 0.3s ease",
    fontSize: "16px",
  },
  activeTab: {
    color: "#fff",
    backgroundColor: "#616161",
    borderBottom: "3px solid #dbdbdb",
    borderRadius: "8px 8px 0 0",
  },
  hoverTab: {
    backgroundColor: "white", // Light gray for hover
    color: "black", // White text on hover
  },
  tabContent: {
    padding: "20px",
    color: "#333",
    backgroundColor: "#676767",
    textAlign: "center" as "center",
    borderRadius: "0 0 12px 12px",
  },
};
