import React, { createContext, useContext, useState, useEffect } from "react";

import Axios from "axios";

export const FilterContext = createContext();

const getInitialFilters = () => {
  const storedFilters = JSON.parse(sessionStorage.getItem("chosenFilters"));
  const queryFilters = {};

  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    ["occasion", "level"].forEach((name) => {
      const value = params.get(name);
      if (value !== null) {
        queryFilters[name] = value;
      }
    });
  }

  return Object.keys(queryFilters).length > 0 ? queryFilters : storedFilters || {};
};

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState([]);
  const [chosenFilters, setChosenFilters] = useState(getInitialFilters);
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
    if (Object.keys(chosenFilters).length === 0) {
      sessionStorage.removeItem("chosenFilters");
      return;
    }

    sessionStorage.setItem("chosenFilters", JSON.stringify(chosenFilters));
  }, [chosenFilters]);
  
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
