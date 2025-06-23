import { MODE_TRENDS } from '../../../constants';
import { AggregationBranch } from '../Aggregation/AggregationBranch/AggregationBranch';
import { CollapsibleFilter } from '../CollapsibleFilter/CollapsibleFilter';
import { useSelector } from 'react-redux';
import { sortSelThenCount } from '../../../utils';
import { MoreOrLess } from '../MoreOrLess/MoreOrLess';
import {
  selectTrendsFocus,
  selectTrendsLens,
} from '../../../reducers/trends/selectors';
import { selectFiltersRoot } from '../../../reducers/filters/selectors';
import { selectViewTab } from '../../../reducers/view/selectors';
import { useGetAggregations } from '../../../api/hooks/useGetAggregations';
import { FilterSearch } from '../FilterSearch/FilterSearch';
import PropTypes from 'prop-types';

/**
 * Helper function generate and sort options
 *
 * @param {Array} aggsFilters - Returned aggregations for the field, these values are used to generate the options for the filters
 * @param {Array} selectedFilters - User-selected filters from the reducer. We use these values to fill in any missing values if any option dissapears from the aggs
 * @param {string} focus - If a current focus is selected
 * @param {string} lens - Name of the Aggregate By on Trends tab
 * @param {string} tab - Current tab we are on
 * @param {string} fieldName - The fieldName, product, or issue
 * @returns {Array} Options for the product filter
 */
export const generateOptions = (
  aggsFilters,
  selectedFilters,
  focus,
  lens,
  tab,
  fieldName,
) => {
  const allFilters = selectedFilters ? selectedFilters : [];
  // Make a cloned, sorted version of the aggs
  const options = sortSelThenCount(aggsFilters, allFilters, fieldName);
  const subAggFieldName = `sub_${fieldName}.raw`;
  if (focus) {
    // we disable options that are in the Trends Detail (focus) view,
    // for instance, if we are focused on Credit reporting and all of its child items
    // we should not be able to add or remove other Product filters
    const isFocusItem = tab === MODE_TRENDS && lens.toLowerCase() === fieldName;
    options.forEach((opt) => {
      opt.isDisabled = isFocusItem ? opt.key !== focus : false;
      if (opt[subAggFieldName]) {
        opt[subAggFieldName].buckets.forEach((bucket) => {
          bucket.isDisabled = isFocusItem ? opt.isDisabled : false;
        });
      }
    });
  }

  return options;
};

/**
 * @param {object} params - Params needed to initialize the filter
 * @param {string} params.desc - Description of the filter, used in mouseover tooltips
 * @param {string} params.fieldName - Name of the filter field, used to pick out aggregations
 * @param {string} params.filterTitle - Name of the filter group, Zip Code, Product / Sub-product
 * @returns {JSX.Element} Element containing a collapsible filter with a list of options
 */
export const NestedFilter = ({ desc, fieldName, filterTitle }) => {
  const { data, error } = useGetAggregations();
  // See if there are any active product filters
  const filtersState = useSelector(selectFiltersRoot);
  const selectedFilters = filtersState[fieldName] || [];
  const focus = useSelector(selectTrendsFocus);
  const lens = useSelector(selectTrendsLens);
  const tab = useSelector(selectViewTab);
  const subFieldName = `sub_${fieldName}.raw`;
  const aggs = error ? [] : data?.[fieldName] || [];
  const options = generateOptions(
    aggs,
    selectedFilters,
    focus,
    lens,
    tab,
    fieldName,
  );

  // --------------------------------------------------------------------------
  // MoreOrLess Helpers
  const _onBucket = (bucket, props) => {
    props.subitems = bucket[subFieldName] ? bucket[subFieldName].buckets : [];
    return props;
  };

  return (
    <CollapsibleFilter
      title={filterTitle}
      desc={desc}
      className={'aggregation ' + fieldName}
    >
      {focus && lens.toLowerCase() === fieldName ? null : (
        <FilterSearch fieldName={fieldName} />
      )}
      <MoreOrLess
        fieldName={fieldName}
        listComponent={AggregationBranch}
        options={options}
        perBucketProps={_onBucket}
      />
    </CollapsibleFilter>
  );
};

NestedFilter.propTypes = {
  desc: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  filterTitle: PropTypes.string.isRequired,
};
