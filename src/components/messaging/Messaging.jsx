"use client";

import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // Replace with your server URL

export default function Messaging() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Listen for incoming messages
    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      const message = { text: input, sender: "You", timestamp: new Date() };
      socket.emit("message", message); // Send message to the server
      setMessages((prevMessages) => [...prevMessages, message]);
      setInput(""); // Clear the input field
    }
  };

  return (
    <div style={{ margin: "0 auto", padding: "1rem", color: "#000000", backgroundColor: "lightblue", width: "100%" }}>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "1rem",
          height: "75vh",
          overflowY: "auto",
          marginBottom: "1rem",
        }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "0.5rem" }}>
            <strong>{msg.sender}:</strong> {msg.text}
            <div style={{ fontSize: "0.8rem", color: "#000000" }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.5rem", }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: "0.5rem",
            borderRadius: "4px",
            color: "#000000",
          }}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} style={{ padding: "0.5rem 1rem" }}>
          Send
        </button>
      </div>
    </div>
  );
}
