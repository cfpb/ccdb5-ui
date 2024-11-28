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

  return isLoading || isFetching ? null : (
    <CollapsibleFilter
      title="Company name"
      desc={desc}
      className="aggregation company"
    >
      <CompanyTypeahead id={'filter-' + FIELD_NAME} />
      <StickyOptions
        fieldName={FIELD_NAME}
        options={options}
        selections={filters}
      />
    </CollapsibleFilter>
  );
};
