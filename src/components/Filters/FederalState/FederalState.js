import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { normalize } from '../../../utils';
import { multipleFiltersAdded } from '../../../reducers/filters/filtersSlice';
import { CollapsibleFilter } from '../CollapsibleFilter/CollapsibleFilter';
import { THESE_UNITED_STATES } from '../../../constants';
import { Typeahead } from '../../Typeahead/Typeahead/Typeahead';
import { StickyOptions } from '../StickyOptions/StickyOptions';
import { selectFiltersState } from '../../../reducers/filters/selectors';
import { useGetAggregations } from '../../../api/hooks/useGetAggregations';

const FIELD_NAME = 'state';

export const FederalState = () => {
  const { data: aggsData, error } = useGetAggregations();
  const aggsState = error ? [] : aggsData?.state || [];
  const stickyOptions = structuredClone(aggsState);
  const dispatch = useDispatch();
  const filters = useSelector(selectFiltersState);
  const buildLabel = (state) => THESE_UNITED_STATES[state] + ' (' + state + ')';
  const starterOptions = Object.keys(THESE_UNITED_STATES).map((key) => {
    const label = buildLabel(key);
    return {
      key: key,
      label,
      position: 0,
      normalized: normalize(label),
      value: key,
    };
  });
  const [dropdownOptions, setDropdownOptions] = useState(starterOptions);
  const desc = 'The state in the mailing address provided by the consumer';

  const onInputChange = (value) => {
    const num = normalize(value);
    if (num === '') {
      setDropdownOptions(starterOptions);
      return;
    }
    const options = starterOptions.map((opt) => ({
      key: opt.key,
      label: opt.label,
      normalized: opt.normalized,
      position: opt.normalized.indexOf(num),
      value,
    }));
    setDropdownOptions(options);
  };

  const onSelection = (item) => {
    dispatch(multipleFiltersAdded(FIELD_NAME, [item[0].key]));
  };

  return (
    <CollapsibleFilter title="State" desc={desc} className="aggregation state">
      <Typeahead
        ariaLabel="Start typing to begin listing US states"
        htmlId="state-typeahead"
        handleChange={onSelection}
        handleInputChange={onInputChange}
        hasClearButton={true}
        options={dropdownOptions}
        placeholder="Enter state name or abbreviation"
      />
      <StickyOptions
        fieldName={FIELD_NAME}
        options={stickyOptions}
        selections={filters}
      />
    </CollapsibleFilter>
  );
};
