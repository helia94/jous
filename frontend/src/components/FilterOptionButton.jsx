// src/components/FilterOptionButton.js
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "semantic-ui-react";
import { getFontForCards } from "./FontUtils";

const FilterOptionButton = React.memo(({ isChosen, onClick, children }) => {
  const [font, setFont] = useState("");

  useEffect(() => {
    const loadFont = async () => {
      const fontFamily = getFontForCards(children);
      setFont(fontFamily);
    };
    loadFont();
  }, [children]);

  return (
    <Button
      className={`filter-option ${isChosen ? "chosen" : ""}`}
      onClick={onClick}
      style={{ fontFamily: font }}
    >
      {children}
    </Button>
  );
});

export default FilterOptionButton;
