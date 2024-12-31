import React, { useState } from "react";

export default function OrderCard({ username, skill, work, status, date, reviews }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.cardContainer,
        ...(isHovered ? styles.cardHover : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.profileSection}>
        <div style={styles.avatar}>👤</div>
        <div>
          <p><strong>Username</strong>: {username}</p>
          <p><strong>Skill</strong>: {skill}</p>
          <p><strong>Work</strong>: {work}</p>
        </div>
      </div>
      <div>
        <p><strong>Status</strong>: {status}</p>
        <p>Date: {date}</p>
        <div style={styles.reviewsSection}>
          ⭐⭐⭐⭐☆ {reviews} <button style={styles.reviewButton}>REVIEWS</button>
        </div>
      </div>
    </div>
  );
}

export function OrderList({ orders }) {
  return (
    <div style={styles.container}>
      {/* Tabs */}
      <div style={styles.tabContainer}>
        <div style={{ ...styles.tab, ...styles.activeTab }}>Sold by</div>
        <div style={styles.tab}>Bought by</div>
      </div>


    
        {orders.map((order, index) => (
          <OrderCard
            key={index}
            username={order.username}
            skill={order.skill}
            work={order.work}
            status={order.status}
            date={order.date}
            reviews={order.reviews}
          />
        ))}
      </div>
    
  );
}

const styles = {
  cardContainer: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#f8f8f8",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  cardHover: {
    transform: "scale(1.015)", // Slightly expand the card
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Increase shadow depth
  },
  profileSection: {
    display: "flex",
    gap: "10px",
  },
  avatar: {
    backgroundColor: "#ccc",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    textAlign: "center",
    lineHeight: "40px",
  },
  reviewsSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  reviewButton: {
    padding: "5px 10px",
    border: "none",
    backgroundColor: "#ddd",
    cursor: "pointer",
    borderRadius: "5px",
  },
};
