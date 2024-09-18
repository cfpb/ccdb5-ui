import './Pill.less';
import { dateRangeChanged } from '../../reducers/query/querySlice';
import {
  filterRemoved,
  filtersReplaced,
} from '../../reducers/filters/filtersSlice';
import { filterPatch, SLUG_SEPARATOR } from '../../constants';
import { formatPillPrefix, getUpdatedFilters } from '../../utils/filters';
import { useDispatch, useSelector } from 'react-redux';
import { coalesce } from '../../utils';
import getIcon from '../iconMap';
import PropTypes from 'prop-types';
import { selectAggsRootState } from '../../reducers/aggs/selectors';
import { selectFiltersFilterState } from '../../reducers/filters/selectors';

export const Pill = ({ fieldName, value }) => {
  const aggsState = useSelector(selectAggsRootState);
  const filtersState = useSelector(selectFiltersFilterState);
  const aggs = coalesce(aggsState, fieldName, []);
  const filters = coalesce(filtersState, fieldName, []);
  const prefix = formatPillPrefix(fieldName);
  const trimmed = value.split(SLUG_SEPARATOR).pop();
  const dispatch = useDispatch();

  const remove = () => {
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

  return (
    <li>
      <button className="pill flex-fixed" onClick={remove}>
        <span className="name">
          {prefix}
          {trimmed}
        </span>
        {getIcon('delete')}
      </button>
    </li>
  );
};

Pill.propTypes = {
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
