import './pill-panel.scss';
import { DATE_RANGE_MIN, knownFilters } from '../../constants';
import { Button, Paragraph } from '@cfpb/design-system-react';
import { selectFiltersRoot } from '../../reducers/filters/selectors';import {
  selectQueryDateLastIndexed,
  selectQueryDateReceivedMax,
  selectQueryDateReceivedMin,
  selectQuerySearchField,
} from '../../reducers/query/selectors';

import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { Pill } from './pill';
import { filtersCleared } from '../../reducers/filters/filters-slice';
import { formatStateLabel } from '../../utils/filters';

const buildKnownFilterPills = (filterState) => {
  const filters = [];
  for (const fieldName of knownFilters) {
    if (!Object.hasOwn(filterState, fieldName)) {
      continue;
    }
    const values = filterState[fieldName];
    for (const value of values) {
      filters.push({ fieldName, value });
    }
  }
  return filters;
};

const buildDatePill = (dateReceivedMin, dateReceivedMax, dateLastIndexed) => {
  if (
    dayjs(dateReceivedMin).isSame(dayjs(DATE_RANGE_MIN), 'day') &&
    dayjs(dateReceivedMax).isSame(dayjs(dateLastIndexed), 'day')
  ) {
    return null;
  }

  return {
    fieldName: 'date_received',
    value:
      'Date received: ' +
      dayjs(dateReceivedMin).format('M/D/YYYY') +
      ' - ' +
      dayjs(dateReceivedMax).format('M/D/YYYY'),
  };
};

export const PillPanel = () => {
  const dispatch = useDispatch();
  const filterState = useSelector(selectFiltersRoot);
  const dateLastIndexed = useSelector(selectQueryDateLastIndexed);
  const dateReceivedMin = useSelector(selectQueryDateReceivedMin);
  const dateReceivedMax = useSelector(selectQueryDateReceivedMax);
  const searchField = useSelector(selectQuerySearchField);

  const filters = buildKnownFilterPills(filterState);

  const datePill = buildDatePill(
    dateReceivedMin,
    dateReceivedMax,
    dateLastIndexed,
  );
  if (datePill) {
    filters.unshift(datePill);
  }

  if (filters.length === 0) {
    return null;
  }

  return (
    <section className="pill-panel">
      <ul className="m-tag-group pill-panel__list">
        <li className="override pill-label">
          <Paragraph>Filters applied:</Paragraph>
        </li>
        {filters.map((filter) => (
          <Pill
            key={filter.fieldName + filter.value}
            fieldName={filter.fieldName}
            value={filter.value}
            displayValue={
              filter.fieldName === 'state'
                ? formatStateLabel(filter.value)
                : undefined
            }
          />
        ))}
        <li className="override pill-panel__clear">
          <Button
            appearance="warning"
            label="Clear filters"
            isLink
            onClick={() => dispatch(filtersCleared(searchField))}
          />
        </li>
      </ul>
    </section>
  );
};
