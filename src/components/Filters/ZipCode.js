import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { addMultipleFilters } from '../../actions/filter';
import CollapsibleFilter from './CollapsibleFilter';
import { stateToQS } from '../../reducers/query/query';
import { API_PLACEHOLDER } from '../../constants';
import { selectQueryState } from '../../reducers/query/selectors';
import { AsyncTypeahead } from '../Typeahead/AsyncTypeahead/AsyncTypeahead';
import { handleFetchSearch } from '../Typeahead/utils';

const FIELD_NAME = 'zip_code';

export const ZipCode = ({ delayWait }) => {
  const dispatch = useDispatch();
  const query = useSelector(selectQueryState);
  const [dropdownOptions, setDropdownOptions] = useState([]);

  const queryState = Object.assign({}, query);
  queryState.searchAfter = '';
  const queryString = stateToQS(queryState);

  const onSelection = (value) => {
    dispatch(addMultipleFilters(FIELD_NAME, [value[0].key]));
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
