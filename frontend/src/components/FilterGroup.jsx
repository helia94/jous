// src/components/FilterGroup.js
import React, { useEffect, useState, useCallback } from "react";
import ReactGA from 'react-ga4';
import { useFilter } from "./FilterContext";
import FilterOptionButton from "./FilterOptionButton";
import { getFontClassForCards } from "./FontUtils";

const isPersian = (text) => /[\u0600-\u06FF]/.test(text);

const FilterGroup = React.memo(({ filter }) => {
  const { chosenFilters, chooseFilterOption } = useFilter();
  const [font, setFont] = useState("");

  const loadFont = useCallback(() => {
    const fontFamily = getFontClassForCards(filter.display_name);
    setFont(fontFamily);
  }, [filter.display_name]);

  useEffect(() => {
    loadFont();
  }, [loadFont]);

  const handleOptionSelect = useCallback(
    (optionKey) => {
      chooseFilterOption(
        filter.query_name,
        optionKey === chosenFilters[filter.query_name] ? null : optionKey
      );

      ReactGA.event({
        category: 'settings',
        action: 'filter',
        label: optionKey, 
      });

    },
    [chooseFilterOption, filter.query_name, chosenFilters]
  );

  const isChosen = useCallback(
    (optionKey) => chosenFilters[filter.query_name] === optionKey,
    [chosenFilters, filter.query_name]
  );

  const rightAligned = isPersian(filter.display_name);

  return (
    <div
      className="filter-group"
      style={{
        direction: rightAligned ? "rtl" : "ltr",
        textAlign: rightAligned ? "right" : "left",
      }}
    >
      <h3 className={font }>{filter.display_name}</h3>
      <div className={"filter-options " + font}>
        {Object.entries(filter.options).map(([key, value]) => (
          <FilterOptionButton
            key={key}
            isChosen={isChosen(key)}
            onClick={() => handleOptionSelect(key)}
          >
            {value}
          </FilterOptionButton>
        ))}
      </div>
    </div>
  );
});

export default FilterGroup;
