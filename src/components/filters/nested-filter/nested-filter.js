import { AggregationBranch } from '../aggregation/aggregation-branch/aggregation-branch';
import { CollapsibleFilter } from '../collapsible-filter/collapsible-filter';
import { useSelector } from 'react-redux';
import { capitalize, sortSelThenCount } from '../../../utils';
import { MoreOrLess } from '../more-or-less/more-or-less';
import { selectFiltersRoot } from '../../../reducers/filters/selectors';
import { useGetAggregations } from '../../../api/hooks/use-get-aggregations';
import { FilterSearch } from '../filter-search/filter-search';
import PropTypes from 'prop-types';

/**
 * Helper function generate and sort options
 *
 * @param {Array} aggsFilters - Returned aggregations for the field, these values are used to generate the options for the filters
 * @param {Array} selectedFilters - User-selected filters from the reducer. We use these values to fill in any missing values if any option dissapears from the aggs
 * @param {string} fieldName - The fieldName, product, or issue
 * @returns {Array} Options for the product filter
 */
export const generateOptions = (aggsFilters, selectedFilters, fieldName) => {
  const allFilters = selectedFilters ?? [];
  return sortSelThenCount(aggsFilters, allFilters, fieldName);
};

/**
 * @param {object} params - Params needed to initialize the filter
 * @param {string} params.desc - Description of the filter, used in mouseover tooltips
 * @param {string} params.fieldName - Name of the filter field, used to pick out aggregations
 * @returns {JSX.Element} Element containing a collapsible filter with a list of options
 */
export const NestedFilter = ({ desc, fieldName }) => {
  const { data, error } = useGetAggregations();
  const filtersState = useSelector(selectFiltersRoot);
  const selectedFilters = filtersState[fieldName] || [];
  const subFieldName = `sub_${fieldName}.raw`;
  const aggs = error ? [] : data?.[fieldName] || [];
  const options = generateOptions(aggs, selectedFilters, fieldName);

  // --------------------------------------------------------------------------
  // MoreOrLess Helpers
  const _onBucket = (bucket, props) => {
    if (Object.hasOwn(bucket, subFieldName)) {
      const subAgg = bucket[subFieldName];
      props.subitems = subAgg ? subAgg.buckets : [];
    } else {
      props.subitems = [];
    }
    return props;
  };

  return (
    <CollapsibleFilter
      title={capitalize(fieldName) + ' and sub-' + fieldName}
      desc={desc}
      className={'aggregation ' + fieldName}
    >
      <FilterSearch fieldName={fieldName} />
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
};
