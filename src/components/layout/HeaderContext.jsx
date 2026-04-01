import React, { createContext, useState, useContext } from 'react';

const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
  const [headerData, setHeaderData] = useState({
    title: 'Dashboard',
    subtitle: 'Sets Tech CRM v2.0',
    icon: 'fa-solid fa-rocket', // Font Awesome আইকন ক্লাস
  });

  return (
    <HeaderContext.Provider value={{ headerData, setHeaderData }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => useContext(HeaderContext);