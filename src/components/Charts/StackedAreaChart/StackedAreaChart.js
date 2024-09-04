import './StackedAreaChart.less';
import * as d3 from 'd3';
import { stackedArea } from 'britecharts';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as colors from '../../../constants/colors';
import {
  getLastDate,
  pruneIncompleteStackedAreaInterval,
} from '../../../utils/chart';
import { updateTrendsTooltip } from '../../../actions/trends';
import { cloneDeep /*, hashObject*/ } from '../../../utils';
import { isDateEqual } from '../../../utils/formatDate';
import {
  selectTrendsResultsDateRangeArea,
  selectTrendsTooltip,
  selectTrendsColorMap,
} from '../../../reducers/trends/selectors';
import {
  selectQueryCompanyReceivedMin,
  selectQueryCompanyReceivedMax,
  selectQueryDateInterval,
} from '../../../reducers/query/selectors';
import { selectViewIsPrintMode } from '../../../reducers/view/selectors';
import ErrorBlock from '../../Warnings/Error';

export const StackedAreaChart = () => {
  const dispatch = useDispatch();
  const colorMap = useSelector(selectTrendsColorMap);
  const data = useSelector(selectTrendsResultsDateRangeArea);
  const from = useSelector(selectQueryCompanyReceivedMin);
  const to = useSelector(selectQueryCompanyReceivedMax);
  const interval = useSelector(selectQueryDateInterval);
  const isPrintMode = useSelector(selectViewIsPrintMode);
  const tooltipInfo = useSelector(selectTrendsTooltip);

  const processData = cloneDeep(data);
  const dateRange = { from, to };

  const filteredData = pruneIncompleteStackedAreaInterval(
    processData,
    dateRange,
    interval,
  );

  const hasChart = filteredData.length > 1;

  useEffect(() => {
    const tooltipUpdated = (selectedState) => {
      dispatch(updateTrendsTooltip(selectedState));
    };

    const updateTooltip = (point) => {
      if (!isDateEqual(tooltipInfo.date, point.date)) {
        tooltipUpdated({
          date: point.date,
          dateRange,
          interval,
          values: point.values,
        });
      }
    };

    const chartWidth = (chartID) => {
      if (isPrintMode) {
        return 500;
      }
      const container = d3.select(chartID);
      return container.node().getBoundingClientRect().width;
    };

    const redrawChart = () => {
      if (!hasChart) {
        return;
      }

      const chartID = '#stacked-area-chart';
      const container = d3.select(chartID);
      const width = chartWidth(chartID);
      d3.select(chartID + ' .stacked-area').remove();

      const stackedAreaChart = stackedArea();
      const colorData = filteredData.filter((item) => item.name !== 'Other');
      const colorScheme = [...new Set(colorData.map((item) => item.name))].map(
        (obj) => colorMap[obj],
      );
      colorScheme.push(colors.DataLens[10]);

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
        .on('customMouseMove', updateTooltip);

      container.datum(cloneDeep(filteredData)).call(stackedAreaChart);

      const config = {
        dateRange,
        interval,
      };

      tooltipUpdated(getLastDate(filteredData, config));
    };

    redrawChart();
  }, []);

  return hasChart ? (
    <div className="chart-wrapper">
      <p className="y-axis-label">Complaints</p>
      <div id="stacked-area-chart" />
      <p className="x-axis-label">Date received by the CFPB</p>
    </div>
  ) : (
    <ErrorBlock text="Cannot display chart. Adjust your date range or date interval." />
  );
};
