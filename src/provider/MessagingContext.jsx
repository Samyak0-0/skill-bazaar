"use client"

import React from "react";
import { createContext, useState } from "react";

export const MessagingContext = createContext();

export const MessagingContextProvider = ({ children }) => {
    
  const [selectedContact, setSelectedContact] = useState("");
  const [userId, setUserId] = useState("")

  return (
    <MessagingContext.Provider value={{ selectedContact, setSelectedContact, userId, setUserId }}>
      {children}
    </MessagingContext.Provider>
  );
};
