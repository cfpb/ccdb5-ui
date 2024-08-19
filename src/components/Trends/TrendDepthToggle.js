import './TrendDepthToggle.less';
import { changeDepth, resetDepth } from '../../actions/trends';
import { clamp, coalesce } from '../../utils';
import { SLUG_SEPARATOR } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectQueryFocus,
  selectQueryLens,
} from '../../reducers/query/selectors';
import { selectAggsState } from '../../reducers/aggs/selectors';
import { selectQueryState } from '../../reducers/query/selectors';
import { selectTrendsResults } from '../../reducers/trends/selectors';

const maxRows = 5;
const lensMap = {
  Overview: 'product',
  Product: 'product',
  Company: 'company',
};

const _showMore = (filterCount, resultCount) => {
  // scenarios where we want to show more:
  // you have less visible rows that the max (5)
  if (resultCount <= maxRows) {
    return true;
  }
  // or more filters count > max Rows and they aren't the same (visible)
  return filterCount > maxRows && filterCount !== resultCount;
};

export const TrendDepthToggle = () => {
  const dispatch = useDispatch();
  const aggs = useSelector(selectAggsState);
  const query = useSelector(selectQueryState);
  const focus = useSelector(selectQueryFocus);
  const lens = useSelector(selectQueryLens);
  const results = useSelector(selectTrendsResults);
  const lensKey = lensMap[lens];
  const resultCount = coalesce(results, lensKey, []).filter(
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

  const diff = totalResultsLength - resultCount;
  const hasToggle = showToggle(lens, focus, totalResultsLength, queryCount);

  // hide on Overview and Focus pages
  if (focus || lens === 'Overview') {
    return null;
  }

  if (hasToggle) {
    if (_showMore(queryCount, resultCount)) {
      return (
        <div className="trend-depth-toggle">
          <button
            className="a-btn a-btn--link"
            id="trend-depth-button"
            onClick={() => {
              dispatch(changeDepth(diff + 5));
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
            dispatch(resetDepth());
          }}
        >
          <span className="minus" />
          Show less
        </button>
      </div>
    );
  }
};

/**
 * helper containing logic to determine when to show the toggle
 *
 * @param {string} lens - selected value
 * @param {string} focus - which focus we are on
 * @param {number} resultCount - count coming from trends results
 * @param {number} queryCount - count from filters
 * @returns {boolean} whether to display the toggle
 */
export const showToggle = (lens, focus, resultCount, queryCount) => {
  // hide on Overview and Focus pages
  if (lens === 'Overview' || focus) {
    return false;
  }

  return resultCount > 5 || queryCount > 5;
};
