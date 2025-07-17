import { useSelector } from 'react-redux';
import { CollapsibleFilter } from '../CollapsibleFilter/CollapsibleFilter';
import { selectFiltersRoot } from '../../../reducers/filters/selectors';
import { StickyOptions } from '../StickyOptions/StickyOptions';
import { useGetAggregations } from '../../../api/hooks/useGetAggregations';
import { AsyncTypeahead } from '../../Typeahead/AsyncTypeahead/AsyncTypeahead';
import PropTypes from 'prop-types';

export const RemoteTypeaheadFilter = ({
  desc,
  fieldName,
  labelText,
  placeholderText,
  title,
}) => {
  const { data: aggsData, error } = useGetAggregations();
  const filtersRoot = useSelector(selectFiltersRoot);
  const filters = filtersRoot?.[fieldName] || [];
  const aggs = error ? [] : aggsData?.[fieldName] || [];
  // Zip code, CD, MSA aggregations coming from API
  const stickyOptions = structuredClone(aggs);

  return (
    <CollapsibleFilter title={title} desc={desc} className="aggregation">
      <AsyncTypeahead
        fieldName={fieldName}
        label={labelText}
        placeholder={placeholderText}
        ariaLabel={labelText}
        htmlId={fieldName + 'typeahead'}
        hasClearButton={true}
      />
      <StickyOptions
        fieldName={fieldName}
        options={stickyOptions}
        selections={filters}
      />
    </CollapsibleFilter>
  );
};

RemoteTypeaheadFilter.propTypes = {
  desc: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  placeholderText: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
