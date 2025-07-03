// DataContext.jsx
import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [attemptedData, setAttemptedData] = useState({}); // { type_id: { users: [], answersByUserId: {} } }

  return (
    <DataContext.Provider value={{ attemptedData, setAttemptedData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
export { DataProvider };
