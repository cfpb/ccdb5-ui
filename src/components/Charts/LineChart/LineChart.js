import './LineChart.less';
import * as d3 from 'd3';
import { line, tooltip } from 'britecharts';
import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cloneDeep, debounce /*, hashObject*/ } from '../../../utils';
import {
  getLastLineDate,
  getTooltipTitle,
  isLineDataEmpty,
  pruneIncompleteLineInterval,
} from '../../../utils/chart';
import {
  selectTrendsColorMap,
  selectTrendsResultsDateRangeLine,
} from '../../../reducers/trends/selectors';
import { selectViewIsPrintMode } from '../../../reducers/view/selectors';
import {
  selectQueryDateReceivedMax,
  selectQueryDateReceivedMin,
  selectQueryDateInterval,
  selectQueryLens,
} from '../../../reducers/query/selectors';
import { updateTrendsTooltip } from '../../../actions/trends';
import { ChartWrapper } from '../ChartWrapper/ChartWrapper';

export const LineChart = () => {
  const dispatch = useDispatch();
  const colorMap = useSelector(selectTrendsColorMap);
  const lens = useSelector(selectQueryLens);
  const interval = useSelector(selectQueryDateInterval);
  const isPrintMode = useSelector(selectViewIsPrintMode);
  const areaData = useSelector(selectTrendsResultsDateRangeLine);
  const dateFrom = useSelector(selectQueryDateReceivedMin);
  const dateTo = useSelector(selectQueryDateReceivedMax);
  const hasTooltip = lens !== 'Overview';
  const processData = useMemo(() => {
    const dateRange = { from: dateFrom, to: dateTo };
    return pruneIncompleteLineInterval(areaData, dateRange, interval);
  }, [areaData, dateFrom, dateTo, interval]);

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

    const tooltipUpdated = (tipEvent) => {
      dispatch(updateTrendsTooltip(tipEvent));
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
      tooltipUpdated({
        date: point.date,
        dateRange,
        interval,
        values: point.topics,
      });
    };

    // const redrawChart = () => {
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

    container.datum(cloneDeep(processData)).call(lineChart);

    const tooltipContainer = d3.select(
      chartID + ' .metadata-group .vertical-marker-container',
    );
    tooltipContainer.datum([]).call(tip);

    const config = { dateRange, interval };
    if (lens !== 'Overview') {
      // get the last date and fire it off to redux
      const item = getLastLineDate(processData, config);
      tooltipUpdated(item);
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
  ]);

  return (
    <ChartWrapper
      hasKey={hasTooltip}
      domId="line-chart"
      isEmpty={isLineDataEmpty(processData)}
    />
  );
};
