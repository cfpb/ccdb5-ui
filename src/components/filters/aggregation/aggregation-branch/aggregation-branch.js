import './aggregation-branch.scss';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Checkbox, Heading, Icon } from '@cfpb/design-system-react';
import {
  coalesce,
  getAllFilters,
  sanitizeHtmlId,
  slugify,
  sortOptions,
} from '../../../../utils';
import { selectFiltersRoot } from '../../../../reducers/filters/selectors';
import { AggregationItem } from '../aggregation-item/aggregation-item';
import { SLUG_SEPARATOR } from '../../../../constants';
import {
  filtersReplaced,
  multipleFiltersRemoved,
} from '../../../../reducers/filters/filters-slice';

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
  const activeChildren = keyFilters.filter((key) =>
    key.includes(SLUG_SEPARATOR),
  );

  const activeParent = keyFilters.filter((key) => key === item.key);

  let checkedState = UNCHECKED;
  if (activeParent.length === 0 && activeChildren.length > 0) {
    checkedState = INDETERMINATE;
  } else if (activeParent.length > 0) {
    checkedState = CHECKED;
  }

  // Fix up the subitems to prepend the current item key
  const unsorted = subitems.map((sub) => ({
    isDisabled: sub.isDisabled,
    key: slugify(item.key, sub.key),
    value: sub.key,
    doc_count: sub.doc_count,
  }));

  const buckets = sortOptions(unsorted, allFilters, fieldName);

  if (buckets.length === 0) {
    return <AggregationItem item={item} key={item.key} fieldName={fieldName} />;
  }

  const id = sanitizeHtmlId(`${fieldName} ${item.key}`);

  const toggleOpen = () => {
    setOpen(!isOpen);
  };

  const toggleParent = () => {
    const subItemFilters = getAllFilters(item.key, subitems);

    // Add the active filters (that might be hidden)
    for (const child of activeChildren) subItemFilters.add(child);

    if (checkedState === CHECKED) {
      dispatch(multipleFiltersRemoved(fieldName, [...subItemFilters]));
    } else {
      // remove all of the child filters
      const replacementFilters = allFilters.filter(
        (filter) => !filter.includes(item.key + SLUG_SEPARATOR),
      );
      // add self/ parent filter
      replacementFilters.push(item.key);
      dispatch(filtersReplaced(fieldName, [...replacementFilters]));
    }
  };

  return (
    <>
      <li
        className={`aggregation-branch ${sanitizeHtmlId(item.key)} parent`}
      >
        <Checkbox
          id={id}
          label={<span className="u-visually-hidden">{item.key}</span>}
          className="aggregation-branch__checkbox"
          disabled={item.isDisabled}
          checked={checkedState === CHECKED}
          isIndeterminate={checkedState === INDETERMINATE}
          onChange={toggleParent}
        />
        <button
          type="button"
          className="aggregation-branch__toggle"
          aria-label={item.key}
          aria-expanded={isOpen}
          onClick={toggleOpen}
        >
          <span className="aggregation-branch__label">{item.key}</span>
          <Heading type="5" className="aggregation-branch__count">
            {item.doc_count.toLocaleString()}
          </Heading>
          <Icon
            name={isOpen ? 'up' : 'down'}
            isPresentational
            className="aggregation-branch__caret"
          />
        </button>
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
