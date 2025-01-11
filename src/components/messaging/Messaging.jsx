"use client";

import { MessagingContext } from "@/provider/MessagingContext";
import { useSession } from "next-auth/react";
import { useState, useEffect, useContext, useRef } from "react";
import { io } from "socket.io-client";
import styles from "./messaging.module.css";
import { Send, Paperclip } from "lucide-react";
import { app } from "@/utilities/firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

// import multer from "multer";

const socket = io("http://localhost:3001"); // Replace with your server URL

export default function Messaging() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { data } = useSession();

  const [file, setFile] = useState(null);
  const [media, setMedia] = useState("");

  const { selectedContact, setSelectedContact, userId } =
    useContext(MessagingContext);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // useEffect(() => {
  //   const storage = getStorage(app);
  //   const upload = () => {
  //     const name = new Date().getTime() + file.name;
  //     const storageRef = ref(storage, name);

  //     const uploadTask = uploadBytesResumable(storageRef, file);

  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         const progress =
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         console.log("Upload is " + progress + "% done");
  //         switch (snapshot.state) {
  //           case "paused":
  //             console.log("Upload is paused");
  //             break;
  //           case "running":
  //             console.log("Upload is running");
  //             break;
  //         }
  //       },
  //       (error) => {},
  //       () => {
  //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //           setMedia(downloadURL);
  //         });
  //       }
  //     );
  //   };
  //   file && upload();
  // }, [file]);

  // useEffect(() => {
  //   console.log(file)
  // }, [file])

  const uploadFile = async () => {
    if (!file) return null;

    const storage = getStorage(app);
    const name = new Date().getTime() + file.name;
    const storageRef = ref(storage, name);

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const sendMessage = async () => {
    let message;
    let fileURL = "";

    if (file) {
      try {
        fileURL = await uploadFile();
        setMedia(fileURL);
      } catch (error) {
        console.error("Error uploading file:", error);
        return;
      }
    }

    if (input.trim() || fileURL) {
      message = {
        senderId: userId,
        recipientId: selectedContact,
        text: input,
        timestamp: new Date(),
        file: fileURL || null,
      };
      console.log(message);
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
          setFile(null); // Clear file
        } else {
          console.error("Failed to send message:", response.status);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  // const sendMessage = async () => {
  //   let message;
  //   if (input.trim()) {
  //     if (media) {
  //       message = {
  //         senderId: userId,
  //         recipientId: selectedContact,
  //         text: input,
  //         timestamp: new Date(),
  //         file: media,
  //       };
  //     } else {
  //       message = {
  //         senderId: userId,
  //         recipientId: selectedContact,
  //         text: input,
  //         timestamp: new Date(),
  //       };
  //     }

  //     try {
  //       const response = await fetch("http://localhost:3000/api/messages", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(message),
  //       });

  //       if (response.ok) {
  //         socket.emit("sendMessage", message);
  //         setMessages((prevMessages) => [...prevMessages, message]);
  //         setInput("");
  //       } else {
  //         console.error("Failed to send message:", response.status);
  //       }
  //     } catch (error) {
  //       console.error("Error sending message:", error);
  //     }
  //   }
  // };

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

  const isImageUrl = (URL, senderId, userId) => {
    const cleanedUrl = URL.split("?")[0];

    const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i;

    const fullFilename = cleanedUrl.substring(cleanedUrl.lastIndexOf("/") + 1);

    const extractFileName = (filename) => {
      const index = filename.search(/[^\d]/); // Find where numbers end
      return filename.slice(index);
    };

    const filename = extractFileName(fullFilename);

    if (imageExtensions.test(cleanedUrl)) {
      return (
        <a href={URL} target="_blank">
          <img
            src={URL}
            alt="attachment"
            style={{ width: "50vw", maxWidth: "500px", marginTop: "10px", borderRadius:"10px" }}
          />
        </a>
      );
    } else {
      return (
        <div
          className={`${
            senderId === userId ? "bg-blue-500" : "bg-slate-500"
          } rounded-md px-5 py-2 text-white text-xl underline`}
        >
          <a href={URL} target="_blank">
            {filename}
          </a>
        </div>
      );
    }
  };

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
                  {msg.text && (
                    <div
                      className={`${
                        msg.senderId === userId ? "bg-blue-500" : "bg-slate-500"
                      } rounded-md px-5 py-2 text-white text-xl`}
                    >
                      {msg.text}
                    </div>
                  )}

                  {msg.file && isImageUrl(msg.file, msg.senderId, userId)}
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
          <div>
            {file && (
              <div
                style={{
                  backgroundColor: "#2c2c2c",
                  color: "#ffffff",
                  padding: "7px 0 7px 15px",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  maxWidth: "200px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  margin: "0 1rem 1rem 1rem",
                  display: "flex",
                  gap: "1rem",
                }}
              >
                <Paperclip size={22} className="text-white cursor-pointer" />
                {file.name}
              </div>
            )}
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
              <div className="relative">
                <input
                  type="file"
                  id="image"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                />
                <button className="p-2">
                  <label htmlFor="image">
                    <Paperclip
                      size={22}
                      className="text-white cursor-pointer"
                    />
                  </label>
                </button>
              </div>
              <button onClick={sendMessage} style={{ padding: "0.5rem" }}>
                <Send size={25} color="white" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
