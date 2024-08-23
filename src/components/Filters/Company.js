import { cloneDeep, coalesce } from '../../utils';
import { CollapsibleFilter } from './CollapsibleFilter/CollapsibleFilter';
import { CompanyTypeahead } from './CompanyTypeahead';
import { useSelector } from 'react-redux';
import React from 'react';
import { StickyOptions } from './StickyOptions/StickyOptions';
import { selectAggsState } from '../../reducers/aggs/selectors';
import { selectQueryState } from '../../reducers/query/selectors';

const FIELD_NAME = 'company';

export const Company = () => {
  const aggs = useSelector(selectAggsState);
  const query = useSelector(selectQueryState);
  const desc = 'The complaint is about this company.';
  const options = cloneDeep(coalesce(aggs, FIELD_NAME, []));
  const selections = coalesce(query, FIELD_NAME, []);

  const isFocusPage = query.focus && query.lens === 'Company';

  options.forEach((opt) => {
    opt.disabled = Boolean(isFocusPage && opt.key !== query.focus);
  });

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
