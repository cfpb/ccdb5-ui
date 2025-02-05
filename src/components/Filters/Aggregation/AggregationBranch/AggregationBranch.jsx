import './AggregationBranch.scss';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  coalesce,
  getAllFilters,
  sanitizeHtmlId,
  slugify,
} from '../../../../utils';
import { selectFiltersRoot } from '../../../../reducers/filters/selectors';
import { AggregationItem } from '../AggregationItem/AggregationItem';
import getIcon from '../../../Common/Icon/iconMap';
import { SLUG_SEPARATOR } from '../../../../constants';
import {
  filtersReplaced,
  multipleFiltersRemoved,
} from '../../../../reducers/filters/filtersSlice';

export const UNCHECKED = 'UNCHECKED';
export const INDETERMINATE = 'INDETERMINATE';
export const CHECKED = 'CHECKED';

export const AggregationBranch = ({ fieldName, item, subitems }) => {
  const filters = useSelector(selectFiltersRoot);
  const dispatch = useDispatch();
  const [isOpen, setOpen] = useState(false);

  // Find all query filters that refer to the field name
  const allFilters = coalesce(filters, fieldName, []);

  // Do any of these values start with the key?
  const keyFilters = allFilters.filter(
    (aFilter) => aFilter.indexOf(item.key) === 0,
  );

  // Does the key contain the separator?
  const activeChildren = keyFilters.filter(
    (key) => key.indexOf(SLUG_SEPARATOR) !== -1,
  );

  const activeParent = keyFilters.filter((key) => key === item.key);

  let checkedState = UNCHECKED;
  if (activeParent.length === 0 && activeChildren.length > 0) {
    checkedState = INDETERMINATE;
  } else if (activeParent.length > 0) {
    checkedState = CHECKED;
  }

  // Fix up the subitems to prepend the current item key
  const buckets = subitems.map((sub) => ({
    disabled: item.isDisabled,
    key: slugify(item.key, sub.key),
    value: sub.key,

    doc_count: sub.doc_count,
  }));

  const liStyle = 'parent m-form-field m-form-field--checkbox body-copy';
  const id = sanitizeHtmlId(`${fieldName} ${item.key}`);

  const toggleParent = () => {
    const subItemFilters = getAllFilters(item.key, subitems);

    // Add the active filters (that might be hidden)
    activeChildren.forEach((child) => subItemFilters.add(child));

    if (checkedState === CHECKED) {
      dispatch(multipleFiltersRemoved(fieldName, [...subItemFilters]));
    } else {
      // remove all of the child filters
      const replacementFilters = allFilters.filter(
        (filter) => filter.indexOf(item.key + SLUG_SEPARATOR) === -1,
      );
      // add self/ parent filter
      replacementFilters.push(item.key);
      dispatch(filtersReplaced(fieldName, [...replacementFilters]));
    }
  };

  if (buckets.length === 0) {
    return <AggregationItem item={item} key={item.key} fieldName={fieldName} />;
  }

  return (
    <>
      <li
        className={`aggregation-branch ${sanitizeHtmlId(item.key)} ${liStyle}`}
      >
        <input
          type="checkbox"
          aria-label={item.key}
          disabled={item.isDisabled}
          checked={checkedState === CHECKED}
          className="flex-fixed a-checkbox"
          id={id}
          onChange={toggleParent}
        />
        <label
          className={`toggle a-label ${checkedState === INDETERMINATE ? ' indeterminate' : ''}`}
          htmlFor={id}
        >
          <span className="u-visually-hidden">{item.key}</span>
        </label>
        <button
          className="flex-all a-btn a-btn--link"
          onClick={() => setOpen(!isOpen)}
        >
          {item.key}
          {isOpen ? getIcon('up') : getIcon('down')}
        </button>
        <span className="flex-fixed parent-count">
          {item.doc_count.toLocaleString()}
        </span>
      </li>
      {isOpen ? (
        <ul className="children">
          {buckets.map((bucket) => (
            <AggregationItem
              item={bucket}
              key={bucket.key}
              fieldName={fieldName}
            />
          ))}
        </ul>
      ) : null}
    </>
  );
};

AggregationBranch.propTypes = {
  fieldName: PropTypes.string.isRequired,
  item: PropTypes.shape({
    doc_count: PropTypes.number.isRequired,
    key: PropTypes.string.isRequired,
    value: PropTypes.string,
    isDisabled: PropTypes.bool,
  }).isRequired,
  subitems: PropTypes.array.isRequired,
};
