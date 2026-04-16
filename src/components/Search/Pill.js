import { dateRangeChanged } from '../../reducers/query/querySlice';
import {
  filterRemoved,
  filtersReplaced,
} from '../../reducers/filters/filtersSlice';
import { filterPatch, SLUG_SEPARATOR } from '../../constants';
import { formatPillPrefix, getUpdatedFilters } from '../../utils/filters';
import { useDispatch, useSelector } from 'react-redux';
import { coalesce } from '../../utils';
import { Icon } from '@cfpb/design-system-react';
import PropTypes from 'prop-types';
import { selectFiltersRoot } from '../../reducers/filters/selectors';
import { useGetAggregations } from '../../api/hooks/useGetAggregations';

export const Pill = ({ fieldName, value, displayValue, onRemove }) => {
  const { data: aggsState, error } = useGetAggregations();
  const filtersState = useSelector(selectFiltersRoot);
  const aggs = coalesce(aggsState, fieldName, []);
  const filters = coalesce(filtersState, fieldName, []);
  const prefix = formatPillPrefix(fieldName);
  const renderedValue = displayValue || value;
  const trimmed = renderedValue.split(SLUG_SEPARATOR).pop();
  const dispatch = useDispatch();

  const remove = () => {
    if (onRemove) {
      onRemove(value);
      return;
    }
    if (fieldName === 'date_received') {
      // reset date range
      dispatch(dateRangeChanged('All'));
    } else {
      const filterName = value;
      if (filterPatch.includes(fieldName)) {
        const updatedFilters = getUpdatedFilters(
          filterName,
          filters,
          aggs,
          fieldName,
        );
        dispatch(filtersReplaced(fieldName, updatedFilters));
      } else {
        dispatch(filterRemoved(fieldName, filterName));
      }
    }
  };

  return error ? null : (
    <li>
      <button
        className="a-tag-filter"
        aria-label={`${prefix}${trimmed}`}
        onClick={remove}
      >
        {prefix}
        {trimmed}
        <span className="a-btn--icon a-btn--icon--on-right">
          <Icon name="error" isPresentational />
        </span>
      </button>
    </li>
  );
};

Pill.propTypes = {
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  displayValue: PropTypes.string,
  onRemove: PropTypes.func,
};
