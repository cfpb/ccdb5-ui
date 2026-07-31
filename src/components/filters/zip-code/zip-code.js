import { useSelector } from 'react-redux';
import { CollapsibleFilter } from '../collapsible-filter/collapsible-filter';
import { selectFiltersZipCode } from '../../../reducers/filters/selectors';
import { StickyOptions } from '../sticky-options/sticky-options';
import { useGetAggregations } from '../../../api/hooks/use-get-aggregations';
import { AsyncTypeahead } from '../../typeahead/async-typeahead/async-typeahead';

const FIELD_NAME = 'zip_code';

export const ZipCode = () => {
  const { data: aggsData, error } = useGetAggregations();
  const filters = useSelector(selectFiltersZipCode);
  const aggsZipCode = error ? [] : aggsData?.zip_code || [];
  // Zip code aggregations coming from API
  const stickyOptions = structuredClone(aggsZipCode);
  const desc = "Enter the mailing ZIP code provided by the consumer."
  return (
    <CollapsibleFilter title="ZIP code" desc={desc} className="aggregation">
      <AsyncTypeahead
        fieldName={FIELD_NAME}
        label={desc}
        placeholder=""
        ariaLabel={desc}
        htmlId={FIELD_NAME + 'typeahead'}
        hasClearButton={true}
      />
      <StickyOptions
        fieldName={FIELD_NAME}
        options={stickyOptions}
        selections={filters}
      />
    </CollapsibleFilter>
  );
};
