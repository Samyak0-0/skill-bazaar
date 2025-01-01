import React from "react";
import { createContext, useState } from "react";

export const MessagingContext = createContext();

export const MessagingContextProvider = ({ children }) => {
    
  const [selectedContact, setSelectedContact] = useState("");

  return (
    <MessagingContext.Provider value={{ selectedContact, setSelectedContact }}>
      {children}
    </MessagingContext.Provider>
  );
};
