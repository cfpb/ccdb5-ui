import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { filterPatch, SLUG_SEPARATOR } from '../../../../constants';
import { coalesce, sanitizeHtmlId } from '../../../../utils';
import { arrayEquals } from '../../../../utils/compare';
import { replaceFilters, toggleFilter } from '../../../../actions/filter';
import { getUpdatedFilters } from '../../../../utils/filters';
import { selectAggsState } from '../../../../reducers/aggs/selectors';
import { selectQueryState } from '../../../../reducers/query/selectors';

const appliedFilters = ({ fieldName, item, aggs, filters }) => {
  // We should find the parent
  // determine if the other siblings are already checked
  // check the parent only, and uncheck the rest so that the fake check
  // will take affect
  const [parentFilter, childFilter] = item.key.split(SLUG_SEPARATOR);
  /* eslint-disable no-unexpected-multiline */
  // TODO: reformat to not need the unexpected multiline.
  const subItems = aggs
    .find((agg) => agg.key === parentFilter)
    ['sub_' + fieldName + '.raw'].buckets.map((agg) => agg.key)
    .sort();
  /* eslint-enable no-unexpected-multiline */

  const parentKey = parentFilter + SLUG_SEPARATOR;
  const selectedFilters = filters
    .filter((filter) => filter.indexOf(parentKey) > -1)
    .map((filter) => filter.replace(parentKey, ''));
  selectedFilters.push(childFilter);

  selectedFilters.sort();

  if (arrayEquals(selectedFilters, subItems)) {
    // remove subitems, add parent filter
    return filters
      .filter((filter) => filter.indexOf(parentKey) === -1)
      .concat(parentFilter);
  } else {
    // just add the single filter and apply filters
    return filters.concat(item.key);
  }
};

export const AggregationItem = ({ fieldName, item }) => {
  const aggsState = useSelector(selectAggsState);
  const queryState = useSelector(selectQueryState);
  const dispatch = useDispatch();

  const aggs = coalesce(aggsState, fieldName, []);
  const filters = coalesce(queryState, fieldName, []);
  const isActive =
    filters.includes(item.key) ||
    filters.includes(item.key.split(SLUG_SEPARATOR)[0]);

  const value = item.value || item.key;
  const liStyle = 'layout-row m-form-field m-form-field--checkbox';
  const id = sanitizeHtmlId(fieldName + '-' + item.key);

  const addFilter = () => {
    const isChildItem = item.key.indexOf(SLUG_SEPARATOR) > -1;
    // cases where its issue / product
    if (isChildItem && filterPatch.includes(fieldName)) {
      const filtersToApply = appliedFilters({ fieldName, item, aggs, filters });
      dispatch(replaceFilters(fieldName, filtersToApply));
    } else {
      dispatch(toggleFilter(fieldName, item));
    }
  };

  const removeFilter = () => {
    if (filterPatch.includes(fieldName)) {
      const filterName = item.key;
      const updatedFilters = getUpdatedFilters(
        filterName,
        filters,
        aggs,
        fieldName,
      );
      dispatch(replaceFilters(fieldName, updatedFilters));
    } else {
      dispatch(toggleFilter(fieldName, item));
    }
  };

  const onChange = () => {
    if (isActive) {
      removeFilter();
    } else {
      addFilter();
    }
  };

  return (
    <li className={liStyle}>
      <input
        type="checkbox"
        className="flex-fixed a-checkbox"
        aria-label={item.key}
        disabled={item.isDisabled}
        checked={isActive}
        id={id}
        onChange={onChange}
      />
      <label className="a-label flex-all bucket-key body-copy" htmlFor={id}>
        {value}
      </label>
      <span className="flex-fixed bucket-count">
        {item.doc_count.toLocaleString()}
      </span>
    </li>
  );
};

AggregationItem.propTypes = {
  fieldName: PropTypes.string.isRequired,
  item: PropTypes.shape({
    // eslint-disable-next-line camelcase
    doc_count: PropTypes.number.isRequired,
    key: PropTypes.string.isRequired,
    value: PropTypes.string,
    isDisabled: PropTypes.bool,
  }).isRequired,
};
