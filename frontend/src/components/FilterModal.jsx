// FilterModal.js
import React, { useEffect } from "react";
import { Modal, Button } from "semantic-ui-react";
import { useFilter } from "./FilterContext";
import "./FilterModal.css";
import { getFontForCards } from './FontUtils';

const FilterModal = ({ open, onClose, languageId }) => {
  const { filters, chosenFilters, fetchFilters, chooseFilterOption, clearFilters } = useFilter();

  useEffect(() => {
    if (open) {
      fetchFilters(languageId);
    }
  }, [open, languageId, fetchFilters]);

  const handleOptionSelect = (queryName, optionKey) => {
    chooseFilterOption(queryName, optionKey === chosenFilters[queryName] ? null : optionKey);
  };

  const isChosen = (queryName, optionKey) => chosenFilters[queryName] === optionKey;

  return (
    // changed size to "small" so it's fully visible on small screens
    <Modal open={open} onClose={onClose} size="tiny" className="filter-modal" closeIcon>
      <Modal.Header>Filter</Modal.Header>
      <Modal.Content scrolling>
        {filters.map((filter) => (
          <div key={filter.query_name} className="filter-group">
            <h3 style={{ fontFamily: getFontForCards(filter.display_name) }} >{filter.display_name}</h3>
            <div className="filter-options">
              {Object.entries(filter.options).map(([key, value]) => (
                <Button
                  key={key}
                  className={`filter-option ${isChosen(filter.query_name, key) ? "chosen" : ""}`}
                  onClick={() => handleOptionSelect(filter.query_name, key)}
                  style={{ fontFamily: getFontForCards(value) }}
                >
                  {value}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={clearFilters} basic color="red">
          Clear
        </Button>
        <Button onClick={onClose} color="black">
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default FilterModal;
