import './chart-toggles.scss';
import { chartTypeUpdated } from '../../reducers/trends/trends-slice';
import { sendAnalyticsEvent } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { selectTrendsChartType } from '../../reducers/trends/selectors';
import { Button, ButtonGroup } from '@cfpb/design-system-react';

export const ChartToggles = () => {
  const dispatch = useDispatch();
  const chartType = useSelector(selectTrendsChartType);

  const btnClassName = (selectedChartType) => {
    return selectedChartType === chartType ? 'active' : '';
  };

  const toggleChartType = (nextChartType) => {
    if (chartType === nextChartType) {
      return;
    }

    sendAnalyticsEvent('Button', 'Trends:' + nextChartType);
    dispatch(chartTypeUpdated(nextChartType));
  };

  return (
    <section className="chart-toggles">
      <div className="a-label a-label--heading" id="chart-type-label">
        Select chart type
      </div>
      <ButtonGroup aria-labelledby="chart-type-label">
        <Button
          label="Line chart"
          appearance="secondary"
          className={btnClassName('line')}
          aria-pressed={chartType === 'line'}
          onClick={() => {
            toggleChartType('line');
          }}
        />
        <Button
          label="Area chart"
          appearance="secondary"
          className={btnClassName('area')}
          aria-pressed={chartType === 'area'}
          onClick={() => {
            toggleChartType('area');
          }}
        />
      </ButtonGroup>
    </section>
  );
};
