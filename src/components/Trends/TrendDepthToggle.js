/* eslint complexity: ["error", 5] */
import './TrendDepthToggle.less';
import { changeDepth, resetDepth } from '../../actions/trends';
import { clamp, coalesce } from '../../utils';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import { SLUG_SEPARATOR } from '../../constants';

const maxRows = 5;
const lensMap = {
  Overview: 'product',
  Product: 'product',
  Company: 'company',
};

export class TrendDepthToggle extends React.Component {
  _showMore() {
    const { queryCount, resultCount } = this.props;
    // scenarios where we want to show more:
    // you have less visible rows that the max (5)
    if (resultCount <= maxRows) {
      return true;
    }
    // or more filters count > max Rows and they aren't the same (visible)
    return queryCount > maxRows && queryCount !== resultCount;
  }

  render() {
    const { diff, increaseDepth, depthReset, hasToggle } = this.props;
    if (hasToggle) {
      if (this._showMore()) {
        return (
          <div className="trend-depth-toggle">
            <button
              className="a-btn a-btn--link"
              id="trend-depth-button"
              onClick={() => {
                increaseDepth(diff);
              }}
            >
              <span className="plus" />
              Show more
            </button>
          </div>
        );
      }
      return (
        <div className="trend-depth-toggle">
          <button
            className="a-btn a-btn--link"
            id="trend-depth-button"
            onClick={() => {
              depthReset();
            }}
          >
            <span className="minus" />
            Show less
          </button>
        </div>
      );
    }
    return null;
  }
}

/**
 * helper containing logic to determine when to show the toggle
 *
 * @param {string} lens - selected value
 * @param {string} focus - which focus we are on
 * @param {number} resultCount - count coming from trends results
 * @param {number} queryCount - count froming from aggs
 * @returns {boolean} whether to display the toggle
 */
export const showToggle = (lens, focus, resultCount, queryCount) => {
  // hide on Overview and Focus pages
  if (lens === 'Overview' || focus) {
    return false;
  }

  return resultCount > 5 || queryCount > 5;
};

export const mapDispatchToProps = (dispatch) => ({
  increaseDepth: (diff) => {
    dispatch(changeDepth(diff + 5));
  },
  depthReset: () => {
    dispatch(resetDepth());
  },
});

export const mapStateToProps = (state) => {
  const { aggs, query, trends } = state;
  const { focus, lens } = query;
  const lensKey = lensMap[lens];
  const resultCount = coalesce(trends.results, lensKey, []).filter(
    (obj) => obj.isParent,
  ).length;

  // The total source depends on the lens.  There are no aggs for companies
  let totalResultsLength = 0;
  if (lensKey === 'product') {
    totalResultsLength = coalesce(aggs, lensKey, []).length;
  } else {
    totalResultsLength = clamp(coalesce(query, lensKey, []).length, 0, 10);
  }

  // handle cases where some specified filters are selected
  const queryCount = query[lensKey]
    ? query[lensKey].filter((obj) => obj.indexOf(SLUG_SEPARATOR) === -1).length
    : totalResultsLength;

  return {
    diff: totalResultsLength - resultCount,
    resultCount,
    queryCount,
    hasToggle: showToggle(lens, focus, resultCount, queryCount),
  };
};

// eslint-disable-next-line react-redux/prefer-separate-component-file
export default connect(mapStateToProps, mapDispatchToProps)(TrendDepthToggle);

TrendDepthToggle.propTypes = {
  queryCount: PropTypes.number,
  resultCount: PropTypes.number.isRequired,
  diff: PropTypes.number.isRequired,
  increaseDepth: PropTypes.func.isRequired,
  depthReset: PropTypes.func.isRequired,
  hasToggle: PropTypes.bool.isRequired,
};
