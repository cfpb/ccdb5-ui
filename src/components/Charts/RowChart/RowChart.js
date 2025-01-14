import './RowChart.scss';
import * as d3 from 'd3';
import { max } from 'd3-array';
import { miniTooltip, row } from 'britecharts';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { scrollToFocus } from '../../../utils/trends';
import { focusChanged } from '../../../reducers/trends/trendsSlice';
import { rowCollapsed, rowExpanded } from '../../../reducers/view/viewSlice';
import { selectTrendsLens } from '../../../reducers/trends/selectors';
import {
  selectViewIsPrintMode,
  selectViewExpandedRows,
  selectViewTab,
  selectViewWidth,
} from '../../../reducers/view/selectors';
import { coalesce, getAllFilters, sendAnalyticsEvent } from '../../../utils';
import { MODE_MAP } from '../../../constants';
import { useGetAggregations } from '../../../api/hooks/useGetAggregations';

export const RowChart = ({
  helperText,
  id,
  colorScheme,
  data,
  title,
  total,
}) => {
  const dispatch = useDispatch();
  const { data: aggs } = useGetAggregations();
  const tab = useSelector(selectViewTab);
  const trendsLens = useSelector(selectTrendsLens);
  const expandedRows = useSelector(selectViewExpandedRows);
  const isPrintMode = useSelector(selectViewIsPrintMode);
  const width = useSelector(selectViewWidth);
  const lens = tab === MODE_MAP ? 'Product' : trendsLens;

  useEffect(() => {
    const chartID = '#row-chart-' + id;

    const formatTip = (value) => {
      return value.toLocaleString() + ' complaints';
    };

    const wrapText = (text, width, viewMore) => {
      // ignore test coverage since this is code borrowed from d3 mbostock
      // text wrapping functions

      /* istanbul ignore next */
      text.each(function () {
        const innerText = d3.select(this);
        const spanWidth = viewMore ? innerText.attr('x') : 0;
        if (innerText.node().children && innerText.node().children.length > 0) {
          // assuming its already split up
          return;
        }
        const words = innerText.text().split(/\s+/).reverse(),
          // ems
          lineHeight = 1.1,
          // eslint-disable-next-line id-length
          y = innerText.attr('y') || 0,
          dy = parseFloat(innerText.attr('dy') || 0);

        let word,
          line = [],
          lineNumber = 0,
          wrapCount = 0,
          tspan = innerText
            .text(null)
            .append('tspan')
            .attr('x', spanWidth)
            .attr('y', y)
            .attr('dy', dy + 'em');

        while ((word = words.pop())) {
          line.push(word);
          tspan.text(line.join(' '));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            tspan = innerText
              .append('tspan')
              .attr('x', spanWidth)
              .attr('y', y)

              .attr('dy', ++lineNumber * lineHeight + dy + 'em')
              .text(word);
            wrapCount++;
          }
        }

        if (wrapCount) {
          const viewMoreBackground = d3
            .select(innerText.node().parentNode)
            .select('.view-more-background');
          const oldHeight = viewMoreBackground.attr('height');

          const newHeight = parseFloat(oldHeight) + wrapCount * 12;
          viewMoreBackground.attr('height', newHeight);
        }
      });
    };

    const collapseARow = (rowName) => {
      sendAnalyticsEvent('Bar chart collapsed', rowName);
      dispatch(rowCollapsed(rowName));
    };

    const expandARow = (rowName) => {
      sendAnalyticsEvent('Bar chart expanded', rowName);
      dispatch(rowExpanded(rowName));
    };

    const selectFocus = (element) => {
      const focusName = element.target.__data__;
      // make sure to assign a valid lens when a row is clicked
      const aLens = lens === 'Overview' ? 'Product' : lens;
      const filters = coalesce(aggs, aLens.toLowerCase(), []);
      scrollToFocus();
      let values = [];
      if (lens === 'Company') {
        values.push(focusName.parent);
      } else {
        const filterGroup = filters.find((obj) => obj.key === focusName.parent);
        const keyName = 'sub_' + lens.toLowerCase() + '.raw';
        values = filterGroup
          ? getAllFilters(focusName.parent, filterGroup[keyName].buckets)
          : [];
      }
      sendAnalyticsEvent('Trends click', focusName.parent);
      dispatch(focusChanged(focusName.parent, lens, [...values]));
    };

    const toggleRow = (element) => {
      const rowName = element.target.__data__;
      // fire off different action depending on if the row is expanded or not
      const expandableRows = data
        .filter((obj) => obj.isParent)
        .map((obj) => obj.name);

      if (!expandableRows.includes(rowName)) {
        // early exit
        return;
      }

      if (expandedRows.includes(rowName)) {
        collapseARow(rowName);
      } else {
        expandARow(rowName);
      }
    };

    if (!data) {
      return;
    }

    // do this to prevent REDUX pollution
    const rows = data.filter((obj) => {
      if (obj.name && isPrintMode) {
        // remove spacer text if we are in print mode
        return obj.name.indexOf('Visualize trends for') === -1;
      }
      return true;
    });

    if (!rows || !rows.length || !total) {
      return;
    }

    const tooltip = miniTooltip();
    tooltip.valueFormatter(formatTip);

    const ratio = total / max(rows, (obj) => obj.value);
    const rowContainer = d3.select(chartID);

    // added padding to make up for margin
    const containerWidth = isPrintMode
      ? 750
      : rowContainer.node().getBoundingClientRect().width + 30;

    const height = rows.length === 1 ? 100 : rows.length * 60;
    const chart = row();
    const marginLeft = containerWidth / 4;

    // tweak to make the chart full width at desktop
    // add space at narrow width
    const marginRight = containerWidth < 600 ? 40 : -65;

    chart
      .margin({
        left: marginLeft,
        right: marginRight,
        top: 20,
        bottom: 10,
      })
      .colorSchema(colorScheme)
      .backgroundColor('#f7f8f9')
      .paddingBetweenGroups(25)
      .enableLabels(true)
      .labelsTotalCount(total.toLocaleString())
      .labelsNumberFormat(',d')
      .outerPadding(0.1)
      .percentageAxisToMaxRatio(ratio)
      .yAxisLineWrapLimit(2)
      .yAxisPaddingBetweenChart(20)
      .width(containerWidth)
      .wrapLabels(true)
      .height(height)
      .on('customMouseOver', tooltip.show)
      .on('customMouseMove', tooltip.update)
      .on('customMouseOut', tooltip.hide);

    rowContainer.datum(rows).call(chart);
    const tooltipContainer = d3.selectAll(
      chartID + ' .row-chart .metadata-group',
    );
    tooltipContainer.datum([]).call(tooltip);

    wrapText(d3.select(chartID).selectAll('.tick text'), marginLeft);
    wrapText(d3.select(chartID).selectAll('.view-more-label'), width / 2, true);

    rowContainer.selectAll('.y-axis-group .tick').on('click', toggleRow);
    rowContainer.selectAll('.view-more-label').on('click', selectFocus);

    return () => {
      d3.selectAll(chartID + ' .row-chart').remove();
    };
  }, [
    dispatch,
    aggs,
    colorScheme,
    data,
    expandedRows,
    id,
    isPrintMode,
    lens,
    total,
    width,
  ]);

  if (!data) {
    return null;
  }

  return total ? (
    <div className="row-chart-section">
      <h3>{title}</h3>
      <p>{helperText}</p>
      <div id={'row-chart-' + id} data-testid={'row-chart-' + id} />
    </div>
  ) : null;
};

RowChart.propTypes = {
  helperText: PropTypes.string,
  id: PropTypes.string.isRequired,
  colorScheme: PropTypes.oneOfType([PropTypes.array, PropTypes.bool])
    .isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  total: PropTypes.number,
};
