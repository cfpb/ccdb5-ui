import PropTypes from 'prop-types';
import { AggregationItem } from '../aggregation/aggregation-item/aggregation-item';

export const StickyOptions = ({ fieldName, options, selections, getLabel }) => {
  // Pull out filter options that have aggregations and values
  const trackedSelections = [];
  for (const opt of options) {
    if (!selections.includes(opt.key)) {
      continue;
    }
    const value = getLabel ? getLabel(opt.key) : opt.value;
    trackedSelections.push({ ...opt, value });
  }

  // Then, iterate through selections to add missing ones with default values
  for (const sel of selections) {
    if (trackedSelections.every((opt) => opt.key !== sel)) {
      // Use some() for efficiency
      trackedSelections.push({
        key: sel,
        value: getLabel ? getLabel(sel) : sel,
        doc_count: 0,
      });
    }
  }
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
  getLabel: PropTypes.func,
};
