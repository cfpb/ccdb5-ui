import './ChartToggles.scss';
import { chartTypeUpdated } from '../../reducers/trends/trendsSlice';
import { Button } from '@cfpb/design-system-react';
import { selectedClass, sendAnalyticsEvent } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { selectTrendsChartType } from '../../reducers/trends/selectors';

export const ChartToggles = () => {
  const dispatch = useDispatch();
  const chartType = useSelector(selectTrendsChartType);

  const toggleChartType = (chartType) => {
    sendAnalyticsEvent('Button', 'Trends:' + chartType);
    dispatch(chartTypeUpdated(chartType));
  };

  return (
    <section className="chart-toggles">
      <p>Chart type</p>
      <div className="m-btn-group">
        <Button
          label=""
          iconLeft="line-chart"
          aria-label="Toggle line chart"
          className={'a-btn' + selectedClass('line', chartType)}
          disabled={chartType === 'line'}
          onClick={() => {
            toggleChartType('line');
          }}
        />
        <Button
          label=""
          iconLeft="area-chart"
          aria-label="Toggle area chart"
          className={'a-btn' + selectedClass('area', chartType)}
          disabled={chartType === 'area'}
          onClick={() => {
            toggleChartType('area');
          }}
        />
      </div>
    </section>
  );
};
