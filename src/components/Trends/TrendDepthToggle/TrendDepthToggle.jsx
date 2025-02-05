import './TrendDepthToggle.scss';
import { depthChanged, depthReset } from '../../../reducers/trends/trendsSlice';
import { clamp, coalesce } from '../../../utils';
import { SLUG_SEPARATOR } from '../../../constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectTrendsFocus,
  selectTrendsLens,
} from '../../../reducers/trends/selectors';
import { selectFiltersRoot } from '../../../reducers/filters/selectors';
import { useGetAggregations } from '../../../api/hooks/useGetAggregations';
import { useGetTrends } from '../../../api/hooks/useGetTrends';

const maxRows = 5;
const lensMap = {
  Overview: 'product',
  Product: 'product',
  Company: 'company',
};

const showMore = (filterCount, resultCount) => {
  // scenarios where we want to show more:
  // you have less visible rows that the max (5)
  if (resultCount <= maxRows) {
    return true;
  }
  // or more filters count > max Rows and they aren't the same (visible)
  return filterCount > maxRows && filterCount !== resultCount;
};

/**
 * helper containing logic to determine when to show the toggle
 *
 * @param {number} resultCount - count coming from trends results
 * @param {number} filterCount - count from filters
 * @returns {boolean} whether to display the toggle
 */
export const showToggle = (resultCount, filterCount) => {
  // if the filters are selected, show the toggle if they selected more than 5 filters
  if (filterCount > 0 && filterCount <= 5) {
    return false;
  }

  return resultCount > 5 || filterCount > 5;
};

export const TrendDepthToggle = () => {
  const dispatch = useDispatch();
  const { data: aggs } = useGetAggregations();
  const { data } = useGetTrends();
  const filters = useSelector(selectFiltersRoot);
  const focus = useSelector(selectTrendsFocus);
  const lens = useSelector(selectTrendsLens);
  const results = data?.results;
  const lensKey = lensMap[lens];
  const resultCount = coalesce(results, lensKey, []).filter(
    (obj) => obj.isParent,
  ).length;

  // The total source depends on the lens.  There are no aggs for companies
  let totalResultsLength = 0;
  if (lensKey === 'product') {
    totalResultsLength = coalesce(aggs, lensKey, []).length;
  } else {
    totalResultsLength = clamp(coalesce(filters, lensKey, []).length, 0, 10);
  }

  // handle cases where some specified filters are selected
  const filterCount = filters[lensKey]
    ? filters[lensKey].filter((obj) => obj.indexOf(SLUG_SEPARATOR) === -1)
        .length
    : totalResultsLength;

  const diff = totalResultsLength - resultCount;
  const hasToggle = showToggle(totalResultsLength, filterCount);

  // hide on Overview and Focus pages
  if (focus || lens === 'Overview') {
    return null;
  }

  if (hasToggle) {
    if (showMore(filterCount, resultCount)) {
      return (
        <div className="trend-depth-toggle">
          <button
            className="a-btn a-btn--link"
            id="trend-depth-button"
            onClick={() => {
              dispatch(depthChanged(diff + 5));
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
            dispatch(depthReset());
          }}
        >
          <span className="minus" />
          Show less
        </button>
      </div>
    );
  }
};
