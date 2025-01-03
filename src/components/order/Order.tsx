"use client";

import React, { useState } from "react";
import Sold from "./sold";
import Bought from "./bought";

export default function Orders() {
  const [activeTab, setActiveTab] = useState<"sold" | "bought">("sold");
  const [hoveredTab, setHoveredTab] = useState<"sold" | "bought" | null>(null);

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
      onClick={() => setActiveTab(tab as "sold" | "bought")}
      onMouseEnter={() => setHoveredTab(tab as "sold" | "bought")}
      onMouseLeave={() => setHoveredTab(null)}
      >
      {tab === "sold" ? "Sold by" : "Bought by"}
      </button>
      ))}
      </div>


      {/* Tab Content */}
      <div style={styles.tabContent}>
        <div style={styles.cardContainer}>
          {activeTab === "sold" ? <Sold /> : <Bought />}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "black",
    width: "98%",
    margin: "5px auto",
    fontFamily: "Arial, sans-serif",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  tabContainer: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#d1d5db",
    borderBottom: "1px solid #ddd",
    borderRadius: "8px 8px 0 0",
    position: "sticky" as "sticky",
    top: 0,
    zIndex: 2,
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
    backgroundColor: "#929292",
    color: "black",
  },
  tabContent: {
    padding: "10px",
    color: "#333",
    backgroundColor: "black",
    textAlign: "center" as "center",
    borderRadius: "0 0 12px 12px",
    maxHeight: "530px",
    overflowY: "auto" as "auto",
    marginTop: "1px",
  },
  cardContainer: {
    padding: "2px",
  },
};
