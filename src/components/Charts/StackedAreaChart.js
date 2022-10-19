import './StackedAreaChart.less';
import * as colors from '../../constants/colors';
import * as d3 from 'd3';
import {
  getLastDate,
  pruneIncompleteStackedAreaInterval,
} from '../../utils/chart';
import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';
import ErrorBlock from '../Warnings/Error';
import { hashObject } from '../../utils';
import { isDateEqual } from '../../utils/formatDate';
import PropTypes from 'prop-types';
import React from 'react';
import { stackedArea } from 'britecharts';
import { updateTrendsTooltip } from '../../actions/trends';

export class StackedAreaChart extends React.Component {
  constructor(props) {
    super(props);
    this._updateTooltip = this._updateTooltip.bind(this);
  }

  componentDidMount() {
    this._redrawChart();
  }

  componentDidUpdate(prevProps) {
    const props = this.props;
    if (
      hashObject(prevProps.data) !== hashObject(props.data) ||
      prevProps.width !== props.width ||
      prevProps.isPrintMode !== props.isPrintMode
    ) {
      this._redrawChart();
    }
  }

  _updateTooltip(point) {
    if (!isDateEqual(this.props.tooltip.date, point.date)) {
      this.props.tooltipUpdated({
        date: point.date,
        dateRange: this.props.dateRange,
        interval: this.props.interval,
        values: point.values,
      });
    }
  }

  _chartWidth(chartID) {
    const { isPrintMode } = this.props;
    if (isPrintMode) {
      return 500;
    }
    const container = d3.select(chartID);
    return container.node().getBoundingClientRect().width;
  }

  _redrawChart() {
    const { colorMap, dateRange, filteredData, interval, hasChart } =
      this.props;
    if (!hasChart) {
      return;
    }

    const chartID = '#stacked-area-chart';
    const container = d3.select(chartID);
    const width = this._chartWidth(chartID);
    d3.select(chartID + ' .stacked-area').remove();

    const stackedAreaChart = stackedArea();
    const colorData = filteredData.filter((item) => item.name !== 'Other');
    const colorScheme = [...new Set(colorData.map((item) => item.name))].map(
      (o) => colorMap[o]
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
      .on('customMouseMove', this._updateTooltip);

    container.datum(cloneDeep(filteredData)).call(stackedAreaChart);

    const config = {
      dateRange,
      interval,
    };

    this.props.tooltipUpdated(getLastDate(filteredData, config));
  }

  render() {
    return this.props.hasChart ? (
      <div className="chart-wrapper">
        <p className="y-axis-label">Complaints</p>
        <div id="stacked-area-chart" />
        <p className="x-axis-label">Date received by the CFPB</p>
      </div>
    ) : (
      <ErrorBlock text="Cannot display chart. Adjust your date range or date interval." />
    );
  }
}

export const mapDispatchToProps = (dispatch) => ({
  tooltipUpdated: (selectedState) => {
    // Analytics.sendEvent(
    //   Analytics.getDataLayerOptions( 'Trend Event: add',
    //     selectedState.abbr, )
    // )
    dispatch(updateTrendsTooltip(selectedState));
  },
});

export const mapStateToProps = (state) => {
  const data = state.trends.results.dateRangeArea;
  const dateRange = {
    from: state.query.date_received_min,
    to: state.query.date_received_max,
  };
  const interval = state.query.dateInterval;
  // clone the data so this doesn't mutate redux store
  const processData = cloneDeep(data);
  const filteredData = pruneIncompleteStackedAreaInterval(
    processData,
    dateRange,
    interval
  );
  const hasChart = filteredData.length > 1;

  return {
    colorMap: state.trends.colorMap,
    data,
    dateRange,
    filteredData,
    interval,
    lens: state.trends.lens,
    isPrintMode: state.view.isPrintMode,
    tooltip: state.trends.tooltip,
    hasChart,
    width: state.view.width,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StackedAreaChart);

StackedAreaChart.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number,
  isPrintMode: PropTypes.bool,
  tooltip: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  tooltipUpdated: PropTypes.func,
  dateRange: PropTypes.object,
  interval: PropTypes.string,
  colorMap: PropTypes.object.isRequired,
  filteredData: PropTypes.array,
  hasChart: PropTypes.bool,
};
