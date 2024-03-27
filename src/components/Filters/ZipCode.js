import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import CollapsibleFilter from './CollapsibleFilter';
import { stateToQS } from '../../reducers/query/querySlice';
import { API_PLACEHOLDER } from '../../constants';
import { selectQueryState } from '../../reducers/query/selectors';
import { AsyncTypeahead } from '../Typeahead/AsyncTypeahead/AsyncTypeahead';
import { handleFetchSearch } from '../Typeahead/utils';
import { multipleFiltersAdded } from '../../reducers/filters/filtersSlice';
import { selectFiltersFilterState } from '../../reducers/filters/selectors';

const FIELD_NAME = 'zip_code';

export const ZipCode = ({ delayWait }) => {
  const dispatch = useDispatch();
  const query = useSelector(selectQueryState);
  const filters = useSelector(selectFiltersFilterState);
  const [dropdownOptions, setDropdownOptions] = useState([]);

  const queryState = Object.assign({}, query, filters);
  queryState.searchAfter = '';
  const queryString = stateToQS(queryState);

  const onSelection = (value) => {
    dispatch(multipleFiltersAdded(FIELD_NAME, [value[0].key]));
    setDropdownOptions([]);
  };

  const onInputChange = (value) => {
    const qs = queryString + '&text=' + value;
    const uri = `${API_PLACEHOLDER}_suggest_zip/${qs}`;
    handleFetchSearch(value, setDropdownOptions, uri);
  };

  return (
    <CollapsibleFilter
      title="ZIP code"
      desc="The mailing ZIP code provided by the consumer"
      className="aggregation"
    >
      <AsyncTypeahead
        htmlId="zipcode-typeahead"
        ariaLabel="Start typing to begin listing zip codes"
        delayWait={delayWait}
        handleSearch={onInputChange}
        handleChange={onSelection}
        hasClearButton={true}
        options={dropdownOptions}
        placeholder="Enter first three digits of ZIP code"
      />
    </CollapsibleFilter>
  );
};

ZipCode.propTypes = {
  delayWait: PropTypes.number,
};

ZipCode.defaultProps = {
  delayWait: 250,
};
