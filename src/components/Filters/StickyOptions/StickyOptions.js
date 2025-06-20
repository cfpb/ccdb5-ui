import PropTypes from 'prop-types';
import { AggregationItem } from '../Aggregation/AggregationItem/AggregationItem';

export const StickyOptions = ({ fieldName, options, selections }) => {
  // Pull out filter options that have aggregations and values
  const trackedSelections = options.reduce((acc, opt) => {
    if (selections.includes(opt.key)) {
      acc.push(opt); // Add the option if its key is in selections
    }
    return acc; // Return the accumulator for the next iteration
  }, []); // Initialize the accumulator as an empty array

  // Then, iterate through selections to add missing ones with default values
  selections.forEach((sel) => {
    if (!trackedSelections.some((opt) => opt.key === sel)) {
      // Use some() for efficiency
      trackedSelections.push({ key: sel, value: sel, doc_count: 0 });
    }
  });
  return (
    <ul>
      {trackedSelections.map((opt) => (
        <AggregationItem item={opt} key={opt.key} fieldName={fieldName} />
      ))}
    </ul>
  );
};

StickyOptions.propTypes = {
  fieldName: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selections: PropTypes.array,
};
