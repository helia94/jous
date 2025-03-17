// src/components/FilterModal.js
import React, { useEffect, useState, useCallback, Suspense, lazy } from "react";
import { Modal, Button } from "semantic-ui-react";
import { useFilter } from "./FilterContext";
import "./FilterModalCritical.css";


// Lazy load FilterGroup component
const FilterGroup = lazy(() => import("./FilterGroup"));

const FilterModal = React.memo(({ open, onClose, languageId }) => {
  const { filters, fetchFilters, clearFilters } = useFilter();
  const [isLoading, setIsLoading] = useState(false);

  const fetchAndSetFilters = useCallback(async () => {
    setIsLoading(true);
    await fetchFilters(languageId);
    setIsLoading(false);
  }, [fetchFilters, languageId]);

  useEffect(() => {
    if (open) {
      fetchAndSetFilters();
    }
  }, [open, fetchAndSetFilters]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="tiny"
      className="filter-modal"
      closeIcon
    >
      <Modal.Header>Filter</Modal.Header>
      <Modal.Content scrolling>
        {isLoading ? (
          <div>Loading filters...</div>
        ) : filters && filters.length > 0 ? (
          <Suspense fallback={<div>Loading filter groups...</div>}>
            {filters.map((filter) => (
              <FilterGroup key={filter.query_name} filter={filter} />
            ))}
          </Suspense>
        ) : (
          <div>No filters available</div>
        )}
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
});

export default FilterModal;
