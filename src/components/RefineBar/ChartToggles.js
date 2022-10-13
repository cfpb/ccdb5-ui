import './ChartToggles.less';
import { changeChartType } from '../../actions/trends';
import iconMap from '../iconMap';
import React from 'react';
import { sendAnalyticsEvent } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { selectTrendsChartType } from '../../reducers/trends/selectors';

export const ChartToggles = () => {
  const dispatch = useDispatch();
  const chartType = useSelector(selectTrendsChartType);

  const toggleChartType = (chartType) => {
    sendAnalyticsEvent('Button', 'Trends:' + chartType);
    dispatch(changeChartType(chartType));
  };

  const btnClassName = (type) => {
    return type === chartType ? ' selected' : '';
  };

  return (
    <section className="chart-toggles m-btn-group">
      <p>Chart type</p>
      <button
        aria-label="Toggle line chart"
        className={'a-btn' + btnClassName('line')}
        disabled={chartType === 'line'}
        onClick={() => {
          toggleChartType('line');
        }}
      >
        {iconMap.getIcon('line-chart')}
      </button>
      <button
        aria-label="Toggle area chart"
        className={'a-btn' + btnClassName('area')}
        disabled={chartType === 'area'}
        onClick={() => {
          toggleChartType('area');
        }}
      >
        {iconMap.getIcon('area-chart')}
      </button>
    </section>
  );
};
