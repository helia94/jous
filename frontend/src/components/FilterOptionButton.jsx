// src/components/FilterOptionButton.js
import React from "react";
import { Button } from "./ui";
import { getFontClassForCards } from "./FontUtils";

const FilterOptionButton = React.memo(({ isChosen, onClick, children }) => {
  return (
    <Button
      className={`filter-option ${isChosen ? "chosen" : ""} ${getFontClassForCards(children)}`}
      onClick={onClick}
    >
      {children}
    </Button>
  );
});

export default FilterOptionButton;
