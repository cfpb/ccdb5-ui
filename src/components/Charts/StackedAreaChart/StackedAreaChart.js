import './StackedAreaChart.less';
import * as d3 from 'd3';
import { stackedArea } from 'britecharts';
import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as colors from '../../../constants/colors';
import {
  getLastDate,
  pruneIncompleteStackedAreaInterval,
  isStackedAreaDataEmpty,
} from '../../../utils/chart';
import { updateTrendsTooltip } from '../../../actions/trends';
import { debounce } from '../../../utils';
import {
  selectTrendsResultsDateRangeArea,
  selectTrendsColorMap,
} from '../../../reducers/trends/selectors';
import {
  selectQueryDateReceivedMin,
  selectQueryDateReceivedMax,
  selectQueryDateInterval,
  selectQueryLens,
} from '../../../reducers/query/selectors';
import { selectViewIsPrintMode } from '../../../reducers/view/selectors';
import { ChartWrapper } from '../ChartWrapper/ChartWrapper';

export const StackedAreaChart = () => {
  const dispatch = useDispatch();

  const colorMap = useSelector(selectTrendsColorMap);
  const data = useSelector(selectTrendsResultsDateRangeArea);
  const from = useSelector(selectQueryDateReceivedMin);
  const to = useSelector(selectQueryDateReceivedMax);
  const lens = useSelector(selectQueryLens);
  const interval = useSelector(selectQueryDateInterval);
  const isPrintMode = useSelector(selectViewIsPrintMode);

  const showTooltip = lens !== 'Overview';

  const filteredData = useMemo(() => {
    const dateRange = { from, to };
    return pruneIncompleteStackedAreaInterval(data, dateRange, interval);
  }, [data, from, to, interval]);

  const isDataEmpty = isStackedAreaDataEmpty(filteredData);

  useEffect(() => {
    const dateRange = { from, to };
    const chartID = '#stacked-area-chart';
    const chartSelector = chartID + ' .stacked-area';
    const container = d3.select(chartID);

    if (!container.node() || isDataEmpty) {
      return;
    }

    const tooltipUpdated = (selectedState) => {
      dispatch(updateTrendsTooltip(selectedState));
    };

    const updateTooltip = (point) => {
      tooltipUpdated({
        date: point.date,
        dateRange,
        interval,
        values: point.values,
      });
    };

    d3.select(chartSelector).remove();

    const width = isPrintMode
      ? 550
      : container.node().getBoundingClientRect().width;

    const colorData = filteredData.filter((item) => item.name !== 'Other');
    const colorScheme = [...new Set(colorData.map((item) => item.name))].map(
      (obj) => colorMap[obj],
    );
    colorScheme.push(colors.DataLens[10]);

    const stackedAreaChart = stackedArea();

    stackedAreaChart
      .margin({ left: 70, right: 10, top: 10, bottom: 40 })
      .areaCurve('linear')
      .initializeVerticalMarker(true)
      .isAnimated(false)
      .tooltipThreshold(1)
      .grid('horizontal')
      .aspectRatio(0.5)
      .width(width)
      .dateLabel('date')
      .colorSchema(colorScheme)
      .on('customMouseMove', debounce(updateTooltip, 200));

    container.datum(filteredData).call(stackedAreaChart);

    const config = {
      dateRange,
      interval,
    };

    tooltipUpdated(getLastDate(filteredData, config));

    return () => {
      d3.select(chartSelector).remove();
      container.datum([]);
    };
  }, [
    colorMap,
    from,
    to,
    dispatch,
    filteredData,
    interval,
    isPrintMode,
    isDataEmpty,
  ]);

  return (
    <ChartWrapper
      hasKey={showTooltip}
      domId="stacked-area-chart"
      isEmpty={isDataEmpty}
    />
  );
};
