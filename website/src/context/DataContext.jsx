// src/context/DataContext.jsx
import React, { createContext, useContext, useState } from "react";

// Create Context
const DataContext = createContext();

// Provider
export const DataProvider = ({ children }) => {
  const [attemptedData, setAttemptedData] = useState({});
  const [pageTitle, setPageTitle] = useState("");

  return (
    <DataContext.Provider value={{ attemptedData, setAttemptedData, pageTitle, setPageTitle }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom Hook
export const useData = () => useContext(DataContext);
