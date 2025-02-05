import './PillPanel.scss';
import { DATE_RANGE_MIN, knownFilters } from '../../constants';

import {
  selectFiltersHasNarrative,
  selectFiltersRoot,
} from '../../reducers/filters/selectors';
import {
  selectQueryDateReceivedMax,
  selectQueryDateReceivedMin,
  selectQuerySearchField,
} from '../../reducers/query/selectors';

import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import getIcon from '../Common/Icon/iconMap';
import { Pill } from './Pill';
import { filtersCleared } from '../../reducers/filters/filtersSlice';
import { startOfToday } from '../../utils';

/* eslint complexity: ["error", 5] */
export const PillPanel = () => {
  const dispatch = useDispatch();
  const filterState = useSelector(selectFiltersRoot);
  const hasNarrative = useSelector(selectFiltersHasNarrative);

  const dateReceivedMin = useSelector(selectQueryDateReceivedMin);
  const dateReceivedMax = useSelector(selectQueryDateReceivedMax);
  const searchField = useSelector(selectQuerySearchField);

  const filters = knownFilters
    // Only use the known filters that are in the query
    .filter((filter) => filter in filterState)
    // Create a flattened array of pill objects
    .reduce((accum, fieldName) => {
      const arr = filterState[fieldName].map((value) => ({ fieldName, value }));
      return accum.concat(arr);
    }, []);

  // Add Has Narrative, if it exists
  if (hasNarrative) {
    filters.push({
      fieldName: 'has_narrative',
      value: 'Has narrative',
    });
  }

  // only add the filter the date is NOT the "All"
  if (
    !dayjs(dateReceivedMin).isSame(dayjs(DATE_RANGE_MIN), 'day') ||
    !dayjs(dateReceivedMax).isSame(dayjs(startOfToday()), 'day')
  ) {
    filters.unshift({
      fieldName: 'date_received',
      value:
        'Date Received: ' +
        dayjs(dateReceivedMin).format('M/D/YYYY') +
        ' - ' +
        dayjs(dateReceivedMax).format('M/D/YYYY'),
    });
  }

  if (!filters.length) {
    return null;
  }

  return (
    <section className="pill-panel">
      <h3 className="h4 pill-label flex-fixed">Filters applied:</h3>
      <ul className="layout-row">
        {filters.map((filter) => (
          <Pill
            key={filter.fieldName + filter.value}
            fieldName={filter.fieldName}
            value={filter.value}
          />
        ))}
        <li className="clear-all">
          <button
            className="a-btn a-btn--link body-copy"
            onClick={() => dispatch(filtersCleared(searchField))}
          >
            {getIcon('delete')}
            Clear all filters
          </button>
        </li>
      </ul>
    </section>
  );
};
