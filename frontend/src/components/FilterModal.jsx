import React, { useEffect } from "react";
import { Modal, Button } from "semantic-ui-react";
import { useFilter } from "./FilterContext";
import "./FilterModal.css";

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

  const isChosen = (queryName, optionKey) => {
    return chosenFilters[queryName] === optionKey;
  };

  return (
    <Modal open={open} onClose={onClose} size="large" className="filter-modal">
      <Modal.Header>Filter</Modal.Header>
      <Modal.Content scrolling>
        {filters.map((filter) => (
          <div key={filter.query_name} className="filter-group">
            <h3>{filter.display_name}</h3>
            <div className="filter-options">
              {Object.entries(filter.options).map(([key, value]) => (
                <Button
                  key={key}
                  className={`filter-option ${isChosen(filter.query_name, key) ? "chosen" : ""}`}
                  onClick={() => handleOptionSelect(filter.query_name, key)}
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
