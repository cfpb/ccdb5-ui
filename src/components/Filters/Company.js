import { cloneDeep } from '../../utils';
import CollapsibleFilter from './CollapsibleFilter';
import { CompanyTypeahead } from './CompanyTypeahead';
import { useSelector } from 'react-redux';
import StickyOptions from './StickyOptions';
import { selectAggsCompany } from '../../reducers/aggs/selectors';
import {
  selectTrendsFocus,
  selectTrendsLens,
} from '../../reducers/trends/selectors';
import { selectFiltersCompany } from '../../reducers/filters/selectors';

const FIELD_NAME = 'company';

export const Company = () => {
  const aggsCompany = useSelector(selectAggsCompany);
  const filters = useSelector(selectFiltersCompany);
  const focus = useSelector(selectTrendsFocus);
  const lens = useSelector(selectTrendsLens);
  const options = cloneDeep(aggsCompany);
  const isFocusPage = focus && lens === 'Company';

  options.forEach((opt) => {
    opt.disabled = Boolean(isFocusPage && opt.key !== focus);
  });

  const desc = 'The complaint is about this company.';

  return (
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
