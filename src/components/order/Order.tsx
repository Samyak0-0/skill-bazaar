"use client";
import React from 'react'
type Props = {}

const Order = (props: Props) => {
  return (
    <div>Order Component</div>
  )
}




import { useState } from "react";
import Sold from "./sold";
import Bought from "./bought";

export default function Orders() {
  const [activeTab, setActiveTab] = useState("sold");

  return (
    <div style={styles.container}>
      {/* Tabs */}
      <div style={styles.tabContainer}>
        <button
          style={activeTab === "sold" ? styles.activeTab : styles.tabButton}
          onClick={() => setActiveTab("sold")}
        >
          Sold by
        </button>
        <button
          style={activeTab === "bought" ? styles.activeTab : styles.tabButton}
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
    width: "98%",
    margin: "20px auto",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "black",
    borderRadius: "10px",
    overflow: "hidden",
  },
  tabContainer: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "white",
  },
  tabButton: {
    flex: 1,
    padding: "10px",
    backgroundColor: "black",
    borde: "none",
    cursor: "pointer",
    fontWeight: "bold",
    color:"white",
  },
  activeTab: {
    flex: 1,
    padding: "10px",
    backgroundColor: "gray",
    border: "none",
    fontWeight: "bold",
  },
  tabContent: {
    padding: "10px",
    color: "black",
  },
};
