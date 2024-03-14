import { cloneDeep, coalesce } from '../../utils';
import CollapsibleFilter from './CollapsibleFilter';
import { CompanyTypeahead } from './CompanyTypeahead';
import { useSelector } from 'react-redux';
import React from 'react';
import StickyOptions from './StickyOptions';
import { selectAggsState } from '../../reducers/aggs/selectors';
import {
  selectTrendsFocus,
  selectTrendsLens,
} from '../../reducers/trends/selectors';
import { selectFiltersState } from '../../reducers/filters/selectors';

const FIELD_NAME = 'company';

export const Company = () => {
  const aggs = useSelector(selectAggsState);
  const filters = useSelector(selectFiltersState);
  const focus = useSelector(selectTrendsFocus);
  const lens = useSelector(selectTrendsLens);
  const options = cloneDeep(coalesce(aggs, FIELD_NAME, []));
  const selections = coalesce(filters, FIELD_NAME, []);
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
        selections={selections}
      />
    </CollapsibleFilter>
  );
};
