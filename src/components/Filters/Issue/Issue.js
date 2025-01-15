import { useSelector } from 'react-redux';
import { sortSelThenCount } from '../../../utils';
import { CollapsibleFilter } from '../CollapsibleFilter/CollapsibleFilter';
import { selectFiltersIssue } from '../../../reducers/filters/selectors';
import { MoreOrLess } from '../MoreOrLess/MoreOrLess';
import { AggregationBranch } from '../Aggregation/AggregationBranch/AggregationBranch';
import { useGetAggregations } from '../../../api/hooks/useGetAggregations';
import { FilterSearch } from '../FilterSearch/FilterSearch';
import { SLUG_SEPARATOR } from '../../../constants';

export const Issue = () => {
  const { data } = useGetAggregations();
  const filters = useSelector(selectFiltersIssue);

  const aggsFilters = data?.issue;
  if (!aggsFilters) {
    return null;
  }

  const desc =
    'The type of issue and sub-issue the consumer identified ' +
    'in the complaint';
  const listComponentProps = {
    fieldName: 'issue',
  };

  const selections = [];
  // Reduce the issues to the parent keys (and dedup)
  filters.forEach((filter) => {
    const idx = filter.indexOf(SLUG_SEPARATOR);
    const key = idx === -1 ? filter : filter.substring(0, idx);
    if (selections.indexOf(key) === -1) {
      selections.push(key);
    }
  });
  // Make a cloned, sorted version of the aggs
  const options = sortSelThenCount(aggsFilters, selections);
  const onBucket = (bucket, props) => {
    props.subitems = bucket['sub_issue.raw'].buckets;
    return props;
  };

  return (
    <CollapsibleFilter
      title="Issue / sub-issue"
      desc={desc}
      className="aggregation issue"
    >
      <FilterSearch fieldName="issue" />
      <MoreOrLess
        listComponent={AggregationBranch}
        listComponentProps={listComponentProps}
        options={options}
        perBucketProps={onBucket}
      />
    </CollapsibleFilter>
  );
};
