import './StackedAreaChart.scss';
import * as d3 from 'd3';
import { stackedArea } from 'britecharts';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as colors from '../../../constants/colors';
import {
  getLastDate,
  isStackedAreaDataEmpty,
  pruneIncompleteStackedAreaInterval,
} from '../../../utils/chart';
import { tooltipUpdated } from '../../../reducers/trends/trendsSlice';
import { debounce } from '../../../utils';
import { selectTrendsLens } from '../../../reducers/trends/selectors';
import {
  selectQueryDateInterval,
  selectQueryDateReceivedMax,
  selectQueryDateReceivedMin,
} from '../../../reducers/query/selectors';
import {
  selectViewIsPrintMode,
  selectViewWidth,
} from '../../../reducers/view/selectors';
import { ChartWrapper } from '../ChartWrapper/ChartWrapper';
import { useGetTrends } from '../../../api/hooks/useGetTrends';
import { ErrorBlock } from '../../Warnings/Error';

export const StackedAreaChart = () => {
  const dispatch = useDispatch();

  const { data } = useGetTrends();
  const colorMap = data?.colorMap;
  const areaData = data?.results?.dateRangeArea;
  const from = useSelector(selectQueryDateReceivedMin);
  const to = useSelector(selectQueryDateReceivedMax);
  const lens = useSelector(selectTrendsLens);
  const interval = useSelector(selectQueryDateInterval);

  const isPrintMode = useSelector(selectViewIsPrintMode);
  const width = useSelector(selectViewWidth);

  const showTooltip = lens !== 'Overview';

  const filteredData = useMemo(() => {
    const dateRange = { from, to };
    if (!areaData) {
      return [];
    }
    return pruneIncompleteStackedAreaInterval(areaData, dateRange, interval);
  }, [areaData, from, to, interval]);

  const isDataEmpty = isStackedAreaDataEmpty(filteredData);

  useEffect(() => {
    const dateRange = { from, to };
    const chartID = '#stacked-area-chart';
    const chartSelector = chartID + ' .stacked-area';
    const container = d3.select(chartID);

    if (!container.node() || isDataEmpty) {
      return;
    }

    const extTooltipUpdated = (item) => {
      item.values = item.values.map((val) => {
        if (typeof val.date !== 'string') {
          return {
            ...val,
            date: new Date(val.date).toJSON(),
          };
        }
        return val;
      });
      if (typeof item.date !== 'string') {
        // delete item.date;
        item.date = new Date(item.date).toJSON();
      }
      dispatch(tooltipUpdated(item));
    };

    const updateTooltip = (point) => {
      if (typeof point.date !== 'string') {
        point.date = new Date(point.date).toJSON();
      }
      point.values = point.values.map((val) => {
        if (typeof val.date !== 'string') {
          return {
            ...val,
            date: new Date(val.date).toJSON(),
          };
        }
        return val;
      });

      dispatch(
        tooltipUpdated({
          date: point.date,
          dateRange,
          interval,
          values: point.values,
        }),
      );
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

    extTooltipUpdated(getLastDate(filteredData, config));

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
    width,
  ]);

  if (isDataEmpty) {
    return (
      <ErrorBlock text="Cannot display chart. Adjust your date range or date interval." />
    );
  }

  return (
    <section className="chart">
      <ChartWrapper hasKey={showTooltip} domId="stacked-area-chart" />
    </section>
  );
};
