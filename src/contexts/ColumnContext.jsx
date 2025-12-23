"use client";

import { createContext, useContext, useState } from "react";

const ColumnContext = createContext();

export function ColumnProvider({ children }) {
  const [visibleColumns, setVisibleColumns] = useState({
    donorId: true,
    registrationDate: true,
    donorName: true,
    nextAppointment: true,
    aadharNumber: true,
    consentForm: true,
    affidavit: true,
    bloodReport: true,
    insurance: true,
    opuProcess: true,
  });

  return (
    <ColumnContext.Provider value={{ visibleColumns, setVisibleColumns }}>
      {children}
    </ColumnContext.Provider>
  );
}

export function useColumns() {
  const context = useContext(ColumnContext);
  if (!context) {
    throw new Error("useColumns must be used within ColumnProvider");
  }
  return context;
}
