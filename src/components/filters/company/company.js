import { CollapsibleFilter } from '../collapsible-filter/collapsible-filter';
import { useSelector } from 'react-redux';
import { StickyOptions } from '../sticky-options/sticky-options';
import {
  selectTrendsFocus,
  selectTrendsLens,
} from '../../../reducers/trends/selectors';
import { selectFiltersCompany } from '../../../reducers/filters/selectors';
import { useGetAggregations } from '../../../api/hooks/use-get-aggregations';
import { AsyncTypeahead } from '../../typeahead/async-typeahead/async-typeahead';

const FIELD_NAME = 'company';

export const Company = () => {
  const { data, error } = useGetAggregations();
  const filters = useSelector(selectFiltersCompany);
  const focus = useSelector(selectTrendsFocus);
  const lens = useSelector(selectTrendsLens);
  const aggsCompany = error ? [] : data?.company || [];
  const options = structuredClone(aggsCompany);
  const isFocusPage = focus && lens === 'Company';

  for (const opt of options) {
    opt.disabled = Boolean(isFocusPage && opt.key !== focus);
  }

  const desc =
    'Enter the company name that the consumer listed in their complaint.';

  return (
    <CollapsibleFilter
      title="Company name"
      desc={desc}
      className="aggregation company"
    >
      <AsyncTypeahead
        fieldName={FIELD_NAME}
        id="filter-company-typeahead"
        label={desc}
        placeholder=""
        ariaLabel="Company Search"
        htmlId={FIELD_NAME + '-typeahead'}
      />
      <StickyOptions
        fieldName={FIELD_NAME}
        options={options}
        selections={filters}
      />
    </CollapsibleFilter>
  );
};
