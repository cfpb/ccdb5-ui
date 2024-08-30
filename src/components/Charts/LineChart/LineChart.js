/* eslint complexity: ["error", 7] */
import './LineChart.less';
import * as d3 from 'd3';
import { line, tooltip } from 'britecharts';
import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cloneDeep /*, hashObject*/ } from '../../../utils';
import { isDateEqual } from '../../../utils/formatDate';
import {
  getLastLineDate,
  getTooltipTitle,
  pruneIncompleteLineInterval,
} from '../../../utils/chart';
import {
  selectTrendsColorMap,
  selectTrendsResultsDateRangeLine,
  selectTrendsTooltip,
} from '../../../reducers/trends/selectors';
import { selectViewIsPrintMode } from '../../../reducers/view/selectors';
import {
  selectQueryDateReceivedMax,
  selectQueryDateReceivedMin,
  selectQueryDateInterval,
  selectQueryLens,
} from '../../../reducers/query/selectors';
import { updateTrendsTooltip } from '../../../actions/trends';
import ErrorBlock from '../../Warnings/Error';

export const LineChart = () => {
  const dispatch = useDispatch();
  const colorMap = useSelector(selectTrendsColorMap);
  const tooltipInfo = useSelector(selectTrendsTooltip);
  const lens = useSelector(selectQueryLens);
  const interval = useSelector(selectQueryDateInterval);
  const isPrintMode = useSelector(selectViewIsPrintMode);
  const areaData = useSelector(selectTrendsResultsDateRangeLine);
  const dateFrom = useSelector(selectQueryDateReceivedMin);
  const dateTo = useSelector(selectQueryDateReceivedMax);

  const processData = useMemo(() => {
    const dateRange = { from: dateFrom, to: dateTo };
    return pruneIncompleteLineInterval(areaData, dateRange, interval);
  }, [areaData, dateFrom, dateTo, interval]);

  const hasChart = Boolean(
    processData.dataByTopic && processData.dataByTopic[0].dates.length > 1,
  );

  useEffect(
    () => {
      if (!hasChart) {
        return;
      }
      const dateRange = { from: dateFrom, to: dateTo };
      const chartID = '#line-chart';
      const chartSelector = `${chartID} .line-chart`;
      const container = d3.select(chartID);

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
        if (!isDateEqual(tooltipInfo.date, point.date)) {
          tooltipUpdated({
            date: point.date,
            dateRange,
            interval,
            values: point.topics,
          });
        }
      };

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
        lineChart.on('customMouseMove', updateTooltip);
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
        if (!isDateEqual(tooltipInfo.date, item.date)) {
          tooltipUpdated(item);
        }
      }

      return () => {
        d3.select(chartSelector).remove();
        container.datum([]);
      };
    },
    [
      /*areaData,
    tooltipInfo,
    colorMap,
    isPrintMode,
    dateFrom,
    dateTo,
    interval,
    lens,
    hasChart,
    hashObject(areaData),*/
    ],
  );

  return hasChart ? (
    <div className="chart-wrapper">
      <p className="y-axis-label">Complaints</p>
      <div id="line-chart" />
      <p className="x-axis-label">Date received by the CFPB</p>
    </div>
  ) : (
    <ErrorBlock text="Cannot display chart. Adjust your date range or date interval." />
  );
};
