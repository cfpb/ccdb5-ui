import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { normalize } from '../../utils';
import { addMultipleFilters } from '../../actions/filter';
import CollapsibleFilter from './CollapsibleFilter';
import { THESE_UNITED_STATES } from '../../constants';
import { Typeahead } from '../Typeahead/Typeahead';

export const FederalState = ({ hasChildren }) => {
  const dispatch = useDispatch();
  const buildLabel = (x) => THESE_UNITED_STATES[x] + ' (' + x + ')';
  const starterOptions = Object.keys(THESE_UNITED_STATES).map((x) => {
    const label = buildLabel(x);
    return {
      key: x,
      label,
      position: 0,
      normalized: normalize(label),
    };
  });
  const [dropdownOptions, setDropdownOptions] = useState(starterOptions);
  const desc = 'The state in the mailing address provided by the consumer';

  const onInputChange = (value) => {
    const n = normalize(value);
    if (n === '') {
      setDropdownOptions(starterOptions);
      return;
    }
    const options = starterOptions.map((x) => ({
      key: x.key,
      label: x.label,
      normalized: x.normalized,
      position: x.normalized.indexOf(n),
      value,
    }));
    setDropdownOptions(options);
  };

  const onSelection = (item) => {
    dispatch(addMultipleFilters('state', [item[0].key]));
  };

  return (
    <CollapsibleFilter
      title="State"
      desc={desc}
      hasChildren={hasChildren}
      className="aggregation state"
    >
      <Typeahead
        ariaLabel="Start typing to begin listing US states"
        htmlId="state-typeahead"
        handleChange={onSelection}
        handleInputChange={onInputChange}
        hasClearButton={true}
        options={dropdownOptions}
        placeholder="Enter state name or abbreviation"
      />
    </CollapsibleFilter>
  );
};

FederalState.propTypes = {
  hasChildren: PropTypes.bool,
};
