import './pill-panel.scss';
import { DATE_RANGE_MIN, knownFilters } from '../../constants';
import { Button, Paragraph } from '@cfpb/design-system-react';
import { selectFiltersRoot } from '../../reducers/filters/selectors';
import {
  selectQueryCompanyReceivedMax,
  selectQueryCompanyReceivedMin,
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

const buildDatePill = (
  fieldName,
  fieldFormatted,
  dateMin,
  dateMax,
  dateLastIndexed,
) => {
  const min = dayjs(dateMin);
  const max = dayjs(dateMax);
  if (min.isValid() && max.isValid()) {
    if (
      min.isSame(dayjs(DATE_RANGE_MIN), 'day') &&
      max.isSame(dayjs(dateLastIndexed), 'day')
    ) {
      return null;
    }

    return {
      fieldName,
      value:
        fieldFormatted +
        min.format('M/D/YYYY') +
        ' - ' +
        max.format('M/D/YYYY'),
    };
  }
  return null;
};

export const PillPanel = () => {
  const dispatch = useDispatch();
  const filterState = useSelector(selectFiltersRoot);
  const dateLastIndexed = useSelector(selectQueryDateLastIndexed);
  const dateReceivedMin = useSelector(selectQueryDateReceivedMin);
  const dateReceivedMax = useSelector(selectQueryDateReceivedMax);
  const companyReceivedMin = useSelector(selectQueryCompanyReceivedMin);
  const companyReceivedMax = useSelector(selectQueryCompanyReceivedMax);
  const searchField = useSelector(selectQuerySearchField);

  const filters = buildKnownFilterPills(filterState);

  const receivedPill = buildDatePill(
    'date_received',
    'Date received: ',
    dateReceivedMin,
    dateReceivedMax,
    dateLastIndexed,
  );

  if (receivedPill) {
    filters.unshift(receivedPill);
  }

  const sentPill = buildDatePill(
    'date_sent',
    'Sent to company: ',
    companyReceivedMin,
    companyReceivedMax,
    dateLastIndexed,
  );

  if (sentPill) {
    console.log(sentPill);
    filters.push(sentPill);
  }

  if (filters.length === 0) {
    return null;
  }

  return (
    <section className="pill-panel">
      <ul className="m-tag-group pill-panel__list">
        <li className="pill-panel__label">
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
        <li className="pill-panel__clear">
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
