import { CollapsibleFilter } from '../CollapsibleFilter/CollapsibleFilter';
import { CompanyTypeahead } from './CompanyTypeahead';
import { useSelector } from 'react-redux';
import { StickyOptions } from '../StickyOptions/StickyOptions';
import {
  selectTrendsFocus,
  selectTrendsLens,
} from '../../../reducers/trends/selectors';
import { selectFiltersCompany } from '../../../reducers/filters/selectors';
import { useGetAggregations } from '../../../api/hooks/useGetAggregations';
import { MoreOrLess } from '../MoreOrLess/MoreOrLess';
import { AggregationBranch } from '../Aggregation/AggregationBranch/AggregationBranch';
import { coalesce, sortSelThenCount } from '../../../utils';
import { AggregationItem } from '../Aggregation/AggregationItem/AggregationItem';

const FIELD_NAME = 'company';

export const Company = () => {
  const { data, isLoading, isFetching } = useGetAggregations();
  const filters = useSelector(selectFiltersCompany);
  const focus = useSelector(selectTrendsFocus);
  const lens = useSelector(selectTrendsLens);
  const aggsCompany = data?.company || [];
  const options = structuredClone(aggsCompany);
  const isFocusPage = focus && lens === 'Company';

  options.forEach((opt) => {
    opt.disabled = Boolean(isFocusPage && opt.key !== focus);
  });

  const desc = 'The complaint is about this company.';

  const listComponentProps = {
    fieldName: 'company',
  };

  console.log('company');
  console.log(options);

  // const onBucket = (bucket, props) => {
  //   props.subitems = bucket['sub_issue.raw'].buckets;
  //   return props;
  // };
  return isLoading || isFetching ? null : (
    <CollapsibleFilter
      title="Company name"
      desc={desc}
      className="aggregation company"
    >
      <CompanyTypeahead id={'filter-' + FIELD_NAME} />
      {/*<StickyOptions*/}
      {/*  fieldName={FIELD_NAME}*/}
      {/*  options={options}*/}
      {/*  selections={filters}*/}
      {/*/>*/}
      <MoreOrLess
        listComponent={AggregationItem}
        listComponentProps={listComponentProps}
        options={options}
        // perBucketProps={() => {}}
      />
    </CollapsibleFilter>
  );
};
