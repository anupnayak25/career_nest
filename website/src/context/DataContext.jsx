// src/context/DataContext.jsx
import React, { createContext, useContext, useState } from 'react';

// Create Context
const DataContext = createContext();

// Provider
export const DataProvider = ({ children }) => {
  const [attemptedData, setAttemptedData] = useState({});

  return (
    <DataContext.Provider value={{ attemptedData, setAttemptedData }}>
      {children}
    </DataContext.Provider>
  );
};

// Custom Hook
export const useData = () => useContext(DataContext);
