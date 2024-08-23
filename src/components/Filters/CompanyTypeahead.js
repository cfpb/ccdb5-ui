import { sanitizeHtmlId } from '../../utils';
import { addMultipleFilters } from '../../actions/filter';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { stateToQS } from '../../reducers/query/query';
import { API_PLACEHOLDER } from '../../constants';
import {
  selectQueryFocus,
  selectQueryLens,
  selectQueryState,
} from '../../reducers/query/selectors';
import { AsyncTypeahead } from '../Typeahead/AsyncTypeahead/AsyncTypeahead';
import { handleFetchSearch } from '../Typeahead/utils';

const FIELD_NAME = 'company';

export const CompanyTypeahead = ({ delayWait = 250, id }) => {
  const dispatch = useDispatch();
  const query = useSelector(selectQueryState);
  const focus = useSelector(selectQueryFocus);
  const lens = useSelector(selectQueryLens);
  const [dropdownOptions, setDropdownOptions] = useState([]);

  const queryState = Object.assign({}, query);
  queryState.searchAfter = '';
  const isDisabled = focus && lens === 'Company';
  const queryString = stateToQS(queryState);

  const onSelection = (value) => {
    dispatch(addMultipleFilters(FIELD_NAME, [value[0].key]));
  };

  const onInputChange = (value) => {
    const qs = queryString + '&text=' + value;
    const uri = `${API_PLACEHOLDER}_suggest_company/${qs}`;
    handleFetchSearch(value, setDropdownOptions, uri);
  };

  return (
    <AsyncTypeahead
      ariaLabel="Start typing to begin listing companies"
      htmlId={sanitizeHtmlId('company-typeahead-' + id)}
      delayWait={delayWait}
      handleChange={onSelection}
      handleSearch={onInputChange}
      hasClearButton={true}
      options={dropdownOptions}
      placeholder="Enter company name"
      disabled={isDisabled}
    />
  );
};

CompanyTypeahead.propTypes = {
  delayWait: PropTypes.number,
  id: PropTypes.string.isRequired,
};
