import { sanitizeHtmlId } from '../../../utils';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { stateToQS } from '../../../reducers/query/querySlice';
import { multipleFiltersAdded } from '../../../reducers/filters/filtersSlice';
import { API_PLACEHOLDER } from '../../../constants';
import { selectFiltersRoot } from '../../../reducers/filters/selectors';
import { selectQueryRoot } from '../../../reducers/query/selectors';
import {
  selectTrendsFocus,
  selectTrendsLens,
} from '../../../reducers/trends/selectors';
import { AsyncTypeahead } from '../../Typeahead/AsyncTypeahead/AsyncTypeahead';
import { handleFetchSearch } from '../../Typeahead/utils';
import { useGetAggregations } from '../../../api/hooks/useGetAggregations';

const FIELD_NAME = 'company';

export const CompanyTypeahead = ({ delayWait = 250, id }) => {
  const { isLoading, isFetching } = useGetAggregations();
  const dispatch = useDispatch();
  const filters = useSelector(selectFiltersRoot);
  const query = useSelector(selectQueryRoot);
  const focus = useSelector(selectTrendsFocus);
  const lens = useSelector(selectTrendsLens);
  const [dropdownOptions, setDropdownOptions] = useState([]);

  const queryState = Object.assign({}, query, filters);
  queryState.searchAfter = '';
  const isDisabled = focus && lens === 'Company';
  const queryString = stateToQS(queryState);

  const onSelection = (value) => {
    dispatch(multipleFiltersAdded(FIELD_NAME, [value[0].key]));
  };

  const onInputChange = (value) => {
    const qs = queryString + '&text=' + encodeURIComponent(value);
    const uri = `${API_PLACEHOLDER}_suggest_company/${qs}`;
    handleFetchSearch(value, setDropdownOptions, uri);
  };

  return isLoading || isFetching ? null : (
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
