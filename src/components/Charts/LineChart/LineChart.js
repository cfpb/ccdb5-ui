import './LineChart.scss';
import * as d3 from 'd3';
import line from 'britecharts/dist/umd/line.min';
import tooltip from 'britecharts/dist/umd/tooltip.min';
import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { debounce } from '../../../utils';
import {
  getLastLineDate,
  getTooltipTitle,
  isLineDataEmpty,
  pruneIncompleteLineInterval,
} from '../../../utils/chart';
import { selectTrendsLens } from '../../../reducers/trends/selectors';
import { tooltipUpdated } from '../../../reducers/trends/trendsSlice';
import {
  selectViewIsPrintMode,
  selectViewWidth,
} from '../../../reducers/view/selectors';
import {
  selectQueryDateReceivedMax,
  selectQueryDateReceivedMin,
  selectQueryDateInterval,
} from '../../../reducers/query/selectors';
import { ChartWrapper } from '../ChartWrapper/ChartWrapper';
import { useGetTrends } from '../../../api/hooks/useGetTrends';
import { ErrorBlock } from '../../Warnings/Error';

export const LineChart = () => {
  const dispatch = useDispatch();
  const { data } = useGetTrends();
  const colorMap = data?.colorMap;
  const areaData = data?.results?.dateRangeLine;
  const lens = useSelector(selectTrendsLens);
  const interval = useSelector(selectQueryDateInterval);
  const dateFrom = useSelector(selectQueryDateReceivedMin);
  const dateTo = useSelector(selectQueryDateReceivedMax);
  const isPrintMode = useSelector(selectViewIsPrintMode);
  const width = useSelector(selectViewWidth);

  const hasTooltip = lens !== 'Overview';

  const processData = useMemo(() => {
    const dateRange = { from: dateFrom, to: dateTo };
    if (!areaData) {
      return [];
    }
    return pruneIncompleteLineInterval(areaData, dateRange, interval);
  }, [areaData, dateFrom, dateTo, interval]);

  const isDataEmpty = isLineDataEmpty(processData);

  useEffect(() => {
    const dateRange = { from: dateFrom, to: dateTo };
    const chartID = '#line-chart';
    const chartSelector = `${chartID} .line-chart`;
    const container = d3.select(chartID);
    if (!container.node() || isLineDataEmpty(processData)) {
      return;
    }
    const tip = tooltip()
      .shouldShowDateInTitle(false)
      .topicLabel('topics')
      .title('Complaints');

    const chartWidth = () => {
      if (isPrintMode) {
        return lens === 'Overview' ? 750 : 500;
      }
      return container.node().getBoundingClientRect().width;
    };

    const extTooltipUpdated = (item) => {
      dispatch(tooltipUpdated(item));
    };

    const updateInternalTooltip = (
      dataPoint,
      topicColorMap,
      dataPointXPosition,
    ) => {
      tip.title(getTooltipTitle(dataPoint.date, interval, dateRange, false));
      tip.update(dataPoint, topicColorMap, dataPointXPosition);
    };

    const updateTooltip = (point) => {
      dispatch(
        tooltipUpdated({
          date: new Date(point.date).toJSON(),
          dateRange,
          interval,
          values: point.topics,
        }),
      );
    };

    d3.select(chartSelector).remove();
    const lineChart = line();
    const containerWidth = chartWidth(chartID);
    const colorScheme = processData.dataByTopic.map(
      (obj) => colorMap[obj.topic],
    );

    lineChart
      .margin({ left: 60, right: 10, top: 10, bottom: 40 })
      .initializeVerticalMarker(true)
      .isAnimated(true)
      .tooltipThreshold(1)
      .grid('horizontal')
      .aspectRatio(0.5)
      .width(containerWidth)
      .dateLabel('date')
      .colorSchema(colorScheme);

    if (lens === 'Overview') {
      lineChart
        .on('customMouseOver', tip.show)
        .on('customMouseMove', updateInternalTooltip)
        .on('customMouseOut', tip.hide);
    } else {
      lineChart.on('customMouseMove', debounce(updateTooltip, 200));
    }

    container.datum(processData).call(lineChart);

    const tooltipContainer = d3.select(
      chartID + ' .metadata-group .vertical-marker-container',
    );
    tooltipContainer.datum([]).call(tip);

    const config = { dateRange, interval };
    if (lens !== 'Overview') {
      // get the last date and fire it off to redux
      const item = getLastLineDate(processData, config);

      extTooltipUpdated(item);
    }

    return () => {
      d3.select(chartSelector).remove();
      container.datum([]);
    };
  }, [
    colorMap,
    dateFrom,
    dateTo,
    dispatch,
    interval,
    isPrintMode,
    lens,
    processData,
    width,
  ]);

  if (isDataEmpty) {
    return (
      <ErrorBlock text="Cannot display chart. Adjust your date range or date interval." />
    );
  }

  return (
    <section className="chart">
      <ChartWrapper hasKey={hasTooltip} domId="line-chart" />
    </section>
  );
};
