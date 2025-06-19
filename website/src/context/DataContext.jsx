import React, { createContext, useContext, useState } from 'react';

// Step 1: Create Context
const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [state, setState] = useState("Hello, World!");

  return (
    <DataContext.Provider value={{ state, setState }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);