import './Pill.scss';
import {
  dateRangeToggled,
  removeFilter,
  replaceFilters,
} from '../../actions/filter';
import { filterPatch, SLUG_SEPARATOR } from '../../constants';
import { formatPillPrefix, getUpdatedFilters } from '../../utils/filters';
import { useDispatch, useSelector } from 'react-redux';
import { coalesce } from '../../utils';
import getIcon from '../iconMap';
import PropTypes from 'prop-types';
import { selectAggsState } from '../../reducers/aggs/selectors';
import { selectQueryState } from '../../reducers/query/selectors';

export const Pill = ({ fieldName, value }) => {
  const aggsState = useSelector(selectAggsState);
  const queryState = useSelector(selectQueryState);
  const aggs = coalesce(aggsState, fieldName, []);
  const filters = coalesce(queryState, fieldName, []);
  const prefix = formatPillPrefix(fieldName);
  const trimmed = value.split(SLUG_SEPARATOR).pop();
  const dispatch = useDispatch();

  const remove = () => {
    if (fieldName === 'date_received') {
      // reset date range
      dispatch(dateRangeToggled('All'));
    } else {
      const filterName = value;
      if (filterPatch.includes(fieldName)) {
        const updatedFilters = getUpdatedFilters(
          filterName,
          filters,
          aggs,
          fieldName,
        );
        dispatch(replaceFilters(fieldName, updatedFilters));
      } else {
        dispatch(removeFilter(fieldName, filterName));
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
