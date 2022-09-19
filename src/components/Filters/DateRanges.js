import './DateRanges.less';
import {
  selectQueryDateRange,
  selectQueryTab
} from '../../reducers/query/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { dateRanges } from '../../constants';
import { dateRangeToggled } from '../../actions/filter';
import React from 'react';
import { sendAnalyticsEvent } from '../../utils';

export const DateRanges = () => {
  const dispatch = useDispatch();
  const dateRange = useSelector( selectQueryDateRange );
  const tab = useSelector( selectQueryTab );

  const btnClassName = selectedDateRange => {
    const classes = [ 'a-btn', 'date-selector', 'range-' + selectedDateRange ];
    if ( selectedDateRange === dateRange ) {
      classes.push( 'selected' );
    }
    return classes.join( ' ' ).toLowerCase();
  };

  const toggleDateRange = selectedDateRange => {
    if ( dateRange !== selectedDateRange ) {
      sendAnalyticsEvent( 'Button', tab + ':' + selectedDateRange );
      dispatch( dateRangeToggled( selectedDateRange ) );
    }
  };

  return (
    <section className="date-ranges m-btn-group">
      <p>Date range (Click to modify range)</p>
      {dateRanges.map( range =>
        <button
          onClick={() => {
            toggleDateRange( range );
          }}
          className={btnClassName( range )}
          key={range}
        >
          {range}
        </button>
      )}
    </section>
  );
};
