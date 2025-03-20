import React, { createContext, useState } from 'react';

const StoreContext = createContext(null);

const StoreProvider = ({ children }) => {
  const [searchStateData, setSearchStateData] = useState('');

  const setStateData = (data) => {
    setSearchStateData(data);
  };

  return (
    <StoreContext.Provider value={{ searchStateData, setStateData }}>
      {children}
    </StoreContext.Provider>
  );
};
export { StoreProvider, StoreContext };
