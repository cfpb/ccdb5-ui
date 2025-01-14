import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AggregationItem } from '../Aggregation/AggregationItem/AggregationItem';
import { isEqual } from '../../../utils/compare';
const mapOfOptions = (options) => {
  return options.reduce((map, opt) => {
    map[opt.key] = opt;
    return map;
  }, {});
};

const zeroCounts = (cache) => {
  const result = {};
  Object.keys(cache).forEach((key) => {
    result[key] = {
      ...cache[key],

      doc_count: 0,
    };
  });

  return result;
};

export const StickyOptions = ({ fieldName, options, selections }) => {
  const [trackedSelections, setTrackedSelections] = useState([]);
  const [cache, setCache] = useState({});

  useEffect(() => {
    // Zero out the counts in the cache
    const zeroed = zeroCounts(cache);

    // Update the cache with the new values
    // and zero out the rest
    const updatedCache = Object.assign(zeroed, mapOfOptions(options));

    // always additive (the options are "sticky")
    const toBeTrackedSelections = [...trackedSelections];
    selections.forEach((selection) => {
      // Add any new selections
      if (toBeTrackedSelections.indexOf(selection) === -1) {
        toBeTrackedSelections.push(selection);
      }
    });

    if (!isEqual(toBeTrackedSelections, trackedSelections)) {
      setTrackedSelections(toBeTrackedSelections);
    }
    if (!isEqual(cache, updatedCache)) {
      setCache(updatedCache);
    }
  }, [cache, options, selections, trackedSelections]);

  return (
    <ul>
      {trackedSelections.map((opt) => {
        const bucket = cache[opt];
        return bucket ? (
          <AggregationItem
            item={bucket}
            key={bucket.key}
            fieldName={fieldName}
          />
        ) : null;
      })}
    </ul>
  );
};

StickyOptions.propTypes = {
  fieldName: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selections: PropTypes.array,
};
