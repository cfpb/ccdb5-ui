import { CollapsibleFilter } from '../collapsible-filter/collapsible-filter';
import { useSelector } from 'react-redux';
import { StickyOptions } from '../sticky-options/sticky-options';
import { selectFiltersCompany } from '../../../reducers/filters/selectors';
import { useGetAggregations } from '../../../api/hooks/use-get-aggregations';
import { AsyncTypeahead } from '../../typeahead/async-typeahead/async-typeahead';

const FIELD_NAME = 'company';

export const Company = () => {
  const { data, error } = useGetAggregations();
  const filters = useSelector(selectFiltersCompany);
  const aggsCompany = error ? [] : data?.company || [];
  const options = structuredClone(aggsCompany);

  const desc = 'The company the consumer identified in the complaint.';

  return (
    <CollapsibleFilter
      title="Company name"
      desc={desc}
      className="aggregation company"
    >
      <AsyncTypeahead
        fieldName={FIELD_NAME}
        placeholder="Enter company name"
        ariaLabel="Company Search"
        htmlId="company-typeahead"
      />
      <StickyOptions
        fieldName={FIELD_NAME}
        options={options}
        selections={filters}
      />
    </CollapsibleFilter>
  );
};
