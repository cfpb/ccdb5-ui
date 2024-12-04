import './ChartToggles.scss';
import { chartTypeUpdated } from '../../reducers/trends/trendsSlice';
import getIcon from '../Common/Icon/iconMap';
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
        <button
          aria-label="Toggle line chart"
          className={'a-btn' + selectedClass('line', chartType)}
          disabled={chartType === 'line'}
          onClick={() => {
            toggleChartType('line');
          }}
        >
          {getIcon('line-chart')}
        </button>
        <button
          aria-label="Toggle area chart"
          className={'a-btn' + selectedClass('area', chartType)}
          disabled={chartType === 'area'}
          onClick={() => {
            toggleChartType('area');
          }}
        >
          {getIcon('area-chart')}
        </button>
      </div>
    </section>
  );
};
