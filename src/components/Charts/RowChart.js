/* eslint complexity: ["error", 5] */

import './RowChart.less';
import * as d3 from 'd3';
import {
  cloneDeep,
  coalesce,
  getAllFilters,
  sendAnalyticsEvent,
} from '../../utils';
import { collapseRow, expandRow } from '../../actions/view';
import { changeFocus } from '../../actions/trends';
import { max } from 'd3-array';
import React, { useEffect, useMemo } from 'react';
import { scrollToFocus } from '../../utils/trends';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectTrendsColorScheme,
  selectTrendsResultsDateRangeArea,
} from '../../reducers/trends/selectors';
import {
  selectViewExpandedRows,
  selectViewIsPrintMode,
} from '../../reducers/view/selectors';
import {
  selectAggsState,
  selectAggsTotal,
} from '../../reducers/aggs/selectors';
import {
  selectQueryDateReceivedMax,
  selectQueryDateReceivedMin,
  selectQueryFocus,
  selectQueryLens,
  selectQuerySubLens,
} from '../../reducers/query/selectors';
import { LENS_HELPER_TEXT_MAP, SUB_LENS_MAP } from '../../constants';
import { FOCUS_HELPER_TEXT_MAP } from '../../constants';
import row from 'britecharts/dist/umd/row.min';
import miniTooltip from 'britecharts/dist/umd/miniTooltip.min';

export const RowChart = () => {
  const dispatch = useDispatch();
  const colorScheme = useSelector(selectTrendsColorScheme);
  const isPrintMode = useSelector(selectViewIsPrintMode);
  const aggs = useSelector(selectAggsState);
  const expandedRows = useSelector(selectViewExpandedRows);
  const lens = useSelector(selectQueryLens);
  const total = useSelector(selectAggsTotal);
  const data = useSelector(selectTrendsResultsDateRangeArea);
  const minDate = useSelector(selectQueryDateReceivedMin);
  const maxDate = useSelector(selectQueryDateReceivedMax);
  const subLens = useSelector(selectQuerySubLens);
  const subLensTitle =
    SUB_LENS_MAP[subLens] + ', by ' + lens.toLowerCase() + ' from';
  const title =
    lens === 'Overview'
      ? 'Product by highest complaint volume ' + minDate + ' to ' + maxDate
      : subLensTitle + ' ' + minDate + ' to ' + maxDate;
  const focus = useSelector(selectQueryFocus);
  const id = (lens === 'Overview' ? 'Product' : lens).toLowerCase();
  const helperText = focus
    ? FOCUS_HELPER_TEXT_MAP[focus]
    : LENS_HELPER_TEXT_MAP[lens];

  const rows = useMemo(() => {
    // deep copy
    // do this to prevent REDUX pollution
    return cloneDeep(data).filter((obj) => {
      if (obj.name && isPrintMode) {
        // remove spacer text if we are in print mode
        return obj.name.indexOf('Visualize trends for') === -1;
      }
      return true;
    });
  }, [data, isPrintMode]);

  /**
   *
   * @param value
   */
  function _formatTip(value) {
    return value.toLocaleString() + ' complaints';
  }

  /**
   *
   * @param numRows
   */
  function _getHeight(numRows) {
    return numRows === 1 ? 100 : numRows * 60;
  }

  /**
   *
   * @param text
   * @param width
   * @param viewMore
   */
  function _wrapText(text, width, viewMore) {
    // ignore test coverage since this is code borrowed from d3 mbostock
    // text wrapping functions
    /* eslint-disable complexity */
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

      // eslint-disable-next-line no-cond-assign
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
            // eslint-disable-next-line no-mixed-operators
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .text(word);
          wrapCount++;
        }
      }

      // only allow this to go through if not IE
      if (wrapCount && !window.document.documentMode) {
        const viewMoreBackground = d3
          .select(innerText.node().parentNode)
          .select('.view-more-background');
        const oldHeight = viewMoreBackground.attr('height');
        // eslint-disable-next-line no-mixed-operators
        const newHeight = parseFloat(oldHeight) + wrapCount * 12;
        viewMoreBackground.attr('height', newHeight);
      }
    });
    /* eslint-enable complexity */
  }

  // eslint-disable-next-line complexity
  useEffect(() => {
    // --------------------------------------------------------------------------
    // Event Handlers
    if (!rows || !rows.length || !total) {
      return;
    }
    const tooltip = miniTooltip();
    tooltip.valueFormatter(_formatTip);

    const ratio = total / max(rows, (obj) => obj.value);
    const chartID = '#row-chart-' + id.toLowerCase();
    d3.selectAll(chartID + ' .row-chart').remove();
    const rowContainer = d3.select(chartID);
    if (!rowContainer.node()) {
      return;
    }

    // added padding to make up for margin
    const width = isPrintMode
      ? 750
      : rowContainer.node().getBoundingClientRect().width + 30;

    const height = _getHeight(rows.length);
    const chart = row();
    const marginLeft = width / 4;

    // tweak to make the chart full width at desktop
    // add space at narrow width
    const marginRight = width < 600 ? 40 : -65;
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
      .width(width)
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
    _wrapText(d3.select(chartID).selectAll('.tick text'), marginLeft);

    _wrapText(
      d3.select(chartID).selectAll('.view-more-label'),
      width / 2,
      true,
    );

    rowContainer.selectAll('.y-axis-group .tick').on('click', _toggleRow);

    rowContainer.selectAll('.view-more-label').on('click', _selectFocus);

    /**
     *
     * @param element
     * @param lens
     * @param filters
     */
    function selectFocus(element, lens, filters) {
      scrollToFocus();
      let values = [];
      if (lens === 'Company') {
        values.push(element.parent);
      } else {
        const filterGroup = filters.find((obj) => obj.key === element.parent);
        const keyName = 'sub_' + lens.toLowerCase() + '.raw';
        values = filterGroup
          ? getAllFilters(element.parent, filterGroup[keyName].buckets)
          : [];
      }
      sendAnalyticsEvent('Trends click', element.parent);
      dispatch(changeFocus(element.parent, lens, [...values]));
    }

    /**
     *
     * @param {object} element - The element to focus on
     */
    function _selectFocus(element) {
      // make sure to assign a valid lens when a row is clicked
      const focus = lens === 'Overview' ? 'Product' : lens;
      const filters = coalesce(aggs, lens.toLowerCase(), []);
      selectFocus(element, focus, filters);
    }

    /**
     *
     * @param {string} rowName - The row's name
     */
    function _toggleRow(rowName) {
      // fire off different action depending on if the row is expanded or not
      const expandableRows = data
        .filter((obj) => obj.isParent)
        .map((obj) => obj.name);

      if (!expandableRows.includes(rowName)) {
        // early exit
        return;
      }

      if (expandedRows.includes(rowName)) {
        sendAnalyticsEvent('Bar chart collapsed', rowName);
        dispatch(collapseRow(rowName));
      } else {
        sendAnalyticsEvent('Bar chart expanded', rowName);
        dispatch(expandRow(rowName));
      }
    }
  }, [data, total, dispatch, focus, lens, isPrintMode, rows, subLens, id]);

  return (
    total > 0 && (
      <div className="row-chart-section">
        <h3>{title}</h3>
        <p>{helperText}</p>
        <div id={'row-chart-' + id} />
      </div>
    )
  );
};
