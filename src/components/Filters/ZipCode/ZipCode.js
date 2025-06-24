import { useSelector } from 'react-redux';
import { CollapsibleFilter } from '../CollapsibleFilter/CollapsibleFilter';
import { selectFiltersZipCode } from '../../../reducers/filters/selectors';
import { StickyOptions } from '../StickyOptions/StickyOptions';
import { useGetAggregations } from '../../../api/hooks/useGetAggregations';
import { AsyncTypeahead } from '../../Typeahead/AsyncTypeahead/AsyncTypeahead';

const FIELD_NAME = 'zip_code';

export const ZipCode = () => {
  const { data: aggsData, error } = useGetAggregations();
  const filters = useSelector(selectFiltersZipCode);
  const aggsZipCode = error ? [] : aggsData?.zip_code || [];
  // Zip code aggregations coming from API
  const stickyOptions = structuredClone(aggsZipCode);

  return (
    <CollapsibleFilter
      title="ZIP code"
      desc="The mailing ZIP code provided by the consumer"
      className="aggregation"
    >
      <AsyncTypeahead
        fieldName={FIELD_NAME}
        label="Start typing to begin listing zip codes"
        placeholder="Enter ZIP code"
        ariaLabel="Start typing to begin listing zip codes"
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
