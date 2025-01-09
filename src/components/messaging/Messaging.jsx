"use client";

import { MessagingContext } from "@/provider/MessagingContext";
import { useSession } from "next-auth/react";
import { useState, useEffect, useContext, useRef } from "react";
import { io } from "socket.io-client";
import styles from "./messaging.module.css";
import { Send } from "lucide-react";

const socket = io("http://localhost:3001"); // Replace with your server URL

export default function Messaging() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { data } = useSession();

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages])

  const { selectedContact, setSelectedContact, userId } =
    useContext(MessagingContext);

  const sendMessage = async () => {
    if (input.trim()) {
      const message = {
        senderId: userId,
        recipientId: selectedContact,
        text: input,
        timestamp: new Date(),
      };

      try {
        const response = await fetch("http://localhost:3000/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        });

        if (response.ok) {
          socket.emit("sendMessage", message);
          setMessages((prevMessages) => [...prevMessages, message]);
          setInput("");
        } else {
          console.error("Failed to send message:", response.status);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  });

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedContact) {
        try {
          const res = await fetch(
            `http://localhost:3000/api/messages?userId=${userId}&contact=${selectedContact}`
          );
          if (res.ok) {
            const data = await res.json();
            console.log(data);
            setMessages(data.messages); // Adjust based on the structure of your response
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchMessages();
  }, [selectedContact]);

  return (
    <div
      style={{
        margin: "0 auto",
        color: "#000000",
        backgroundColor: "lightblue",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {!selectedContact && (
        <div className="w-full h-full flex flex-col items-center justify-center text-xl gap-5">
          <p>Welcome, {data?.user.name.split(" ")[0]}</p>
          <p>Select a Conversation to Get Started !</p>{" "}
        </div>
      )}

      {selectedContact && (
        <>
          <div className={styles.chatBox}>
            {messages.map((msg, index) => (
              <div key={index}>
                <div
                  className={`flex flex-col ${
                    msg.senderId === userId ? "items-end" : "items-start"
                  } mb-4`}
                >
                  <div
                    className={`${
                      msg.senderId === userId ? "bg-blue-500" : "bg-slate-500"
                    } rounded-md px-5 py-2 text-white text-xl`}
                  >
                    {msg.text}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#000000" }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              margin: "0 1rem 1rem 1rem",
              alignItems: "center",
            }}
          >
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
              <Send size={25} color="white" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
