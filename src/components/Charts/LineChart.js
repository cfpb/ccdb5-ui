/* eslint complexity: ["error", 7] */
import './LineChart.less';
import * as d3 from 'd3';

import {
  getLastLineDate,
  getTooltipTitle,
  pruneIncompleteLineInterval,
} from '../../utils/chart';
import { line, tooltip } from 'britecharts';
import cloneDeep from 'lodash/cloneDeep';
import { useDispatch, useSelector } from 'react-redux';
import ErrorBlock from '../Warnings/Error';
import { isDateEqual } from '../../utils/formatDate';
import React, { useEffect } from 'react';
import { updateTrendsTooltip } from '../../actions/trends';
import {
  selectViewIsPrintMode,
  selectViewWidth,
} from '../../reducers/view/selectors';
import {
  selectTrendsColorMap,
  selectTrendsLens,
  selectTrendsResultsDateRangeLine,
} from '../../reducers/trends/selectors';
import {
  selectQueryDateInterval,
  selectQueryDateReceivedMax,
  selectQueryDateReceivedMin,
} from '../../reducers/query/selectors';

export const LineChart = () => {
  const dispatch = useDispatch();
  const isPrintMode = useSelector(selectViewIsPrintMode);
  const width = useSelector(selectViewWidth);
  const data = useSelector(selectTrendsResultsDateRangeLine);
  const dateRange = {
    from: useSelector(selectQueryDateReceivedMin),
    to: useSelector(selectQueryDateReceivedMax),
  };
  const colorMap = useSelector(selectTrendsColorMap);
  const interval = useSelector(selectQueryDateInterval);
  const lens = useSelector(selectTrendsLens);
  // clone the data so this doesn't mutate redux store
  const processData = cloneDeep(data);
  pruneIncompleteLineInterval(processData, dateRange, interval);
  const hasChart = Boolean(
    processData.dataByTopic && processData.dataByTopic[0].dates.length > 1,
  );

  /**
   *
   * @param point
   */
  function _updateTooltip(point) {
    if (!isDateEqual(tooltip.date, point.date)) {
      dispatch(
        updateTrendsTooltip({
          date: point.date,
          dateRange: dateRange,
          interval: interval,
          values: point.topics,
        }),
      );
    }
  }
  /**
   *
   * @param dataPoint
   * @param topicColorMap
   * @param dataPointXPosition
   */
  function _updateInternalTooltip(
    dataPoint,
    topicColorMap,
    dataPointXPosition,
  ) {
    const { dateRange, interval } = this.props;
    this.tip.title(getTooltipTitle(dataPoint.date, interval, dateRange, false));
    this.tip.update(dataPoint, topicColorMap, dataPointXPosition);
  }
  /**
   *
   * @param chartID
   */
  function _chartWidth(chartID) {
    if (isPrintMode) {
      return lens === 'Overview' ? 750 : 500;
    }
    const container = d3.select(chartID);
    return container.node().getBoundingClientRect().width;
  }
  /* eslint max-statements: ["error", 23] */
  /**
   *
   * @param colorMap
   * @param dateRange
   * @param interval
   * @param lens
   * @param processData
   * @param hasChart
   */
  function _redrawChart() {
    if (!hasChart) {
      return;
    }

    const chartID = '#line-chart';
    const container = d3.select(chartID);
    const width = _chartWidth(chartID);
    d3.select(chartID + ' .line-chart').remove();

    const lineChart = line();
    const tip = tooltip()
      .shouldShowDateInTitle(false)
      .topicLabel('topics')
      .title('Complaints');

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
      .width(width)
      .dateLabel('date')
      .colorSchema(colorScheme);

    if (lens === 'Overview') {
      lineChart
        .on('customMouseOver', tip.show)
        .on('customMouseMove', _updateInternalTooltip)
        .on('customMouseOut', tip.hide);
    } else {
      lineChart.on('customMouseMove', _updateTooltip);
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
      if (!isDateEqual(tooltip.date, item.date)) {
        dispatch(updateTrendsTooltip(item));
      }
    }
  }

  useEffect(() => {
    _redrawChart();
  }, [data, width, isPrintMode]);

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
