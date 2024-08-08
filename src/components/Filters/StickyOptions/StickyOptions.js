import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AggregationItem from '../AggregationItem/AggregationItem';

const mapOfOptions = (options) => {
  const result = options.reduce((map, opt) => {
    map[opt.key] = opt;
    return map;
  }, {});
  return result;
};

const zeroCounts = (cache) => {
  const result = {};
  Object.keys(cache).forEach((key) => {
    result[key] = {
      ...cache[key],
      // eslint-disable-next-line camelcase
      doc_count: 0,
    };
  });

  return result;
};

const StickyOptions = ({
  fieldName,
  options,
  selections = [],
  onMissingItem = (item) => ({
    key: item,
    // eslint-disable-next-line camelcase
    doc_count: 0,
  }),
}) => {
  const [trackedSelections, setTrackedSelections] = useState(
    selections.slice(),
  );
  const [cache, setCache] = useState(mapOfOptions(options));

  const updateValues = () => {
    // Zero out the counts in the cache
    const zeroed = zeroCounts(cache);

    // Update the cache with the new values
    // and zero out the rest
    const updatedCache = Object.assign(zeroed, mapOfOptions(options));

    // always additive (the options are "sticky")
    const toBeTrackedSelections = [...trackedSelections].slice();

    selections.forEach((selection) => {
      // Add any new selections
      if (toBeTrackedSelections.indexOf(selection) === -1) {
        toBeTrackedSelections.push(selection);
      }

      // Add missing cache options
      if (!(selection in updatedCache)) {
        updatedCache[selection] = onMissingItem(selection);
      }
    });

    return { updatedCache, updatedTrackedSelections: toBeTrackedSelections };
  };

  useEffect(() => {
    const { updatedCache, updatedTrackedSelections } = updateValues();

    setTrackedSelections(updatedTrackedSelections);
    setCache(updatedCache);
  }, [options]);

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
  onMissingItem: PropTypes.func,
  options: PropTypes.array.isRequired,
  selections: PropTypes.array,
};

export default StickyOptions;
