import './DateRanges.scss';
import { selectQueryDateRange } from '../../../reducers/query/selectors';
import { selectViewTab } from '../../../reducers/view/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { dateRanges } from '../../../constants';
import { dateRangeChanged } from '../../../reducers/query/querySlice';
import { sendAnalyticsEvent } from '../../../utils';

export const DateRanges = () => {
  const dispatch = useDispatch();
  const dateRange = useSelector(selectQueryDateRange);
  const tab = useSelector(selectViewTab);

  const btnClassName = (selectedDateRange) => {
    const classes = ['a-btn', 'date-selector', 'range-' + selectedDateRange];
    if (selectedDateRange === dateRange) {
      classes.push('selected');
    }
    return classes.join(' ').toLowerCase();
  };

  const toggleDateRange = (selectedDateRange) => {
    if (dateRange !== selectedDateRange) {
      sendAnalyticsEvent('Button', tab + ':' + selectedDateRange);
      dispatch(dateRangeChanged(selectedDateRange));
    }
  };

  return (
    <section className="date-ranges">
      <p>Date range (Click to modify range)</p>
      <div className="m-btn-group">
        {Object.keys(dateRanges).map((range) => (
          <button
            onClick={() => {
              toggleDateRange(range);
            }}
            aria-label={dateRanges[range]}
            className={btnClassName(range)}
            key={range}
            title={dateRanges[range]}
          >
            {range}
          </button>
        ))}
      </div>
    </section>
  );
};
