"use client";

import React, { useState } from "react";
import Sold from "./sold";
import Bought from "./bought";

export default function Orders() {
  const [activeTab, setActiveTab] = useState("sold");

  return (
    <div style={styles.container}>
      {/* Tabs */}
      <div style={styles.tabContainer}>
        <button
          style={
            activeTab === "sold"
              ? { ...styles.tabButton, ...styles.activeTab }
              : styles.tabButton
          }
          onClick={() => setActiveTab("sold")}
        >
          Sold by
        </button>
        <button
          style={
            activeTab === "bought"
              ? { ...styles.tabButton, ...styles.activeTab }
              : styles.tabButton
          }
          onClick={() => setActiveTab("bought")}
        >
          Bought by
        </button>
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
    backgroundColor: "black", // Light background
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow
    overflow: "hidden",
  },
  tabContainer: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#d1d5db", // White background for tabs
    borderBottom: "1px solid #ddd", // Subtle border
  },
  tabButton: {
    flex: 1,
    padding: "15px",
    cursor: "pointer",
    fontWeight: "bold",
    color: "black", // Neutral color
    backgroundColor: "transparent",
    transition: "color 0.3s ease, background-color 0.3s ease",
    fontSize: "16px",
  },
  activeTab: {
    color: "#fff", // White text for active tab
    backgroundColor: "#616161", // Modern blue for active tab
    borderBottom: "3px solid #dbdbdb", // Accent border for active tab
    borderRadius: "8px 8px 0 0", // Smooth rounded corners on top
  },
  tabContent: {
    padding: "20px",
    color: "#333",
    backgroundColor: "#676767",
    textAlign: "center" as "center",
    borderRadius: "0 0 12px 12px",
  },
};
