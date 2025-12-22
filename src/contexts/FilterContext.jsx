"use client";

import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error("useFilter must be used within FilterProvider");
    }
    return context;
};

export const FilterProvider = ({ children }) => {
    const [documentFilter, setDocumentFilter] = useState("all");

    return (
        <FilterContext.Provider value={{
            documentFilter,
            setDocumentFilter
        }}>
            {children}
        </FilterContext.Provider>
    );
};