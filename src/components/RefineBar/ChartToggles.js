import './ChartToggles.scss';
import { chartTypeUpdated } from '../../reducers/trends/trendsSlice';
import getIcon from '../Common/Icon/iconMap';
import { selectedClass, sendAnalyticsEvent } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { selectTrendsChartType } from '../../reducers/trends/selectors';
import { Button } from '@cfpb/design-system-react';

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
          aria-label="Toggle line chart"
          className={selectedClass('line', chartType)}
          disabled={chartType === 'line'}
          onClick={() => {
            toggleChartType('line');
          }}
        >
          {getIcon('line-chart')}
        </Button>
        <Button
          aria-label="Toggle area chart"
          className={selectedClass('area', chartType)}
          disabled={chartType === 'area'}
          onClick={() => {
            toggleChartType('area');
          }}
        >
          {getIcon('area-chart')}
        </Button>
      </div>
    </section>
  );
};
