import { selectQueryDateRange } from '../../../reducers/query/selectors';
import { selectViewTab } from '../../../reducers/view/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup } from '@cfpb/design-system-react';
import { dateRanges } from '../../../constants';
import { dateRangeChanged } from '../../../reducers/query/query-slice';
import { sendAnalyticsEvent } from '../../../utils';

export const DateRanges = () => {
  const dispatch = useDispatch();
  const dateRange = useSelector(selectQueryDateRange);
  const tab = useSelector(selectViewTab);

  const btnClassName = (selectedDateRange) => {
    return selectedDateRange === dateRange ? 'active' : '';
  };

  const toggleDateRange = (selectedDateRange) => {
    if (dateRange === selectedDateRange) {
      return;
    }

    sendAnalyticsEvent('Button', tab + ':' + selectedDateRange);
    dispatch(dateRangeChanged(selectedDateRange));
  };

  return (
    <section className="date-ranges">
      <p>Date range (Click to modify range)</p>
      <ButtonGroup>
        {Object.entries(dateRanges).map(([range, label]) => (
          <Button
            key={range}
            label={range}
            aria-label={label}
            aria-pressed={range === dateRange}
            appearance="secondary"
            className={btnClassName(range)}
            title={label}
            onClick={() => {
              toggleDateRange(range);
            }}
          />
        ))}
      </ButtonGroup>
    </section>
  );
};
