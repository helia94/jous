import React, { createContext, useContext, useState, useEffect } from "react";

import Axios from "axios";

export const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState([]);
  const [chosenFilters, setChosenFilters] = useState({});
  const [fetched, setFetched] = useState(false);

  const fetchFilters = async (languageId) => {
    if (fetched) return;
    try {
      const res = await Axios.get(`/api/filters?language_id=${languageId}`);
      setFilters(res.data);
      setFetched(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const storedFilters = JSON.parse(sessionStorage.getItem("chosenFilters"));
    if (storedFilters) {
      setChosenFilters(storedFilters);
    }
  }, []);
  
  const chooseFilterOption = (queryName, optionKey) => {
    setChosenFilters((prev) => {
      const updatedFilters = { ...prev, [queryName]: optionKey };
      sessionStorage.setItem("chosenFilters", JSON.stringify(updatedFilters));
      return updatedFilters;
    });
  };

  const clearFilters = () => {
    setChosenFilters({});
    sessionStorage.removeItem("chosenFilters");
  };

  return (
    <FilterContext.Provider
      value={{ filters, chosenFilters, fetchFilters, chooseFilterOption, clearFilters }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
