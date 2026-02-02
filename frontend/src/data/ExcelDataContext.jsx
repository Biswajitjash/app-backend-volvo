import React, { createContext, useState } from 'react';

export const ExcelDataContext = createContext();

export const ExcelDataProvider = ({ children }) => {
  const [excelData, setExcelData] = useState([]);
  const [currentDataIndex, setCurrentDataIndex] = useState(0);

  return (
    <ExcelDataContext.Provider value={{ excelData, setExcelData, currentDataIndex, setCurrentDataIndex }}>
      {children}
    </ExcelDataContext.Provider>
  )
}
