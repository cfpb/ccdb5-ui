import PropTypes from 'prop-types';
import { AggregationItem } from '../Aggregation/AggregationItem/AggregationItem';

export const StickyOptions = ({ fieldName, options, selections }) => {
  // Pull out filter options that have aggregations and values
  const trackedSelections = options.filter((opt) =>
    selections.includes(opt.key),
  );

  const filterKeys = trackedSelections.map((opt) => opt.key);
  // need to reinsert filter values that aren't in aggregations
  selections.forEach((sel) => {
    if (!filterKeys.includes(sel)) {
      trackedSelections.push({ key: sel, value: 0, doc_count: 0 });
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
