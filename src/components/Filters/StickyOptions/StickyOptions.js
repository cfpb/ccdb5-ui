import { useState, useEffect, useMemo } from 'react';
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

const StickyOptions = ({ fieldName, options, selections }) => {
  //const [trackedSelections, setTrackedSelections] = useState(selections);
  //const [cache, setCache] = useState(mapOfOptions(options));
  const [cache, setCache] = useState({});
  const [trackedSelections, setTrackedSelections] = useState([]);
  //console.log('trackedSelections: ', trackedSelections);
  //console.log('cache: ', cache);

  console.log('selections: ', selections);

  const updatedCache = useMemo(() => {
    // Zero out the counts in the cache
    // Update the cache with the new values and zero out the rest
    //return Object.assign(zeroCounts(cache), mapOfOptions(options));
    return Object.assign(zeroCounts(options), mapOfOptions(options));
  }, [options]);

  const selectionsToBeTracked = useMemo(() => {
    const toBeTracked = [...selections];
    console.log('inside useMemo ');
    console.log('toBeTracked: ', toBeTracked);

    // //   toBeTracked.forEach((selection) => {
    // //    // Add any new selections
    // //         if (selectionsToBeTracked.indexOf(selection) === -1) {
    // //           selectionsToBeTracked.push(selection);
    // //         }
    // //         // Add missing cache options
    // //         if (!(selection in updatedCache)) {
    // //           updatedCache[selection] = {
    // //             key: selection,
    // //             // eslint-disable-next-line camelcase
    // //             doc_count: 0,
    // //           };
    // //         }
    // //  });

    return toBeTracked;
  }, [selections]);

  console.log('selectionsToBeTracked: ', selectionsToBeTracked);

  useEffect(() => {
    setCache(updatedCache);
    setTrackedSelections(selectionsToBeTracked);
  }, [updatedCache, selectionsToBeTracked]);

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

export default StickyOptions;
