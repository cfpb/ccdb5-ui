import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { CollapsibleFilter } from '../CollapsibleFilter/CollapsibleFilter';
import { stateToQS } from '../../../reducers/query/querySlice';
import { selectQueryRoot } from '../../../reducers/query/selectors';
import { AsyncTypeahead } from '../../Typeahead/AsyncTypeahead/AsyncTypeahead';
import { multipleFiltersAdded } from '../../../reducers/filters/filtersSlice';
import { selectFiltersZipCode } from '../../../reducers/filters/selectors';
import { useGetSuggestQuery } from '../../../api/complaints';
import { StickyOptions } from '../StickyOptions/StickyOptions';
import { useGetAggregations } from '../../../api/hooks/useGetAggregations';

const FIELD_NAME = 'zip_code';

export const ZipCode = ({ delayWait = 250 }) => {
  const { data: aggsData, error } = useGetAggregations();
  const dispatch = useDispatch();
  const query = useSelector(selectQueryRoot);
  const filters = useSelector(selectFiltersZipCode);
  const [value, setValue] = useState('');
  const aggsZipCode = error ? [] : aggsData?.zip_code || [];
  // Zip code aggregations coming from API
  const stickyOptions = structuredClone(aggsZipCode);
  const queryState = Object.assign({}, query, filters);
  queryState.searchAfter = '';
  const queryString = stateToQS(queryState);
  const qs = queryString + '&text=' + encodeURIComponent(value);
  const url = `_suggest_zip/${qs}`;

  const { data, isFetching, isLoading } = useGetSuggestQuery(
    { url: url },
    { skip: !value },
  );

  const onSelection = (value) => {
    dispatch(multipleFiltersAdded(FIELD_NAME, [value[0].key]));
  };

  const onInputChange = (value) => {
    setValue(value);
  };

  const options = data
    ? data.map((item) => ({
        key: item,
        label: item,
        position: item.toLowerCase().indexOf(value.toLowerCase()),
        value,
      }))
    : [];
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
        isLoading={isLoading || isFetching}
        hasClearButton={!!value}
        options={options}
        placeholder="Enter ZIP code"
      />
      <StickyOptions
        fieldName={FIELD_NAME}
        options={stickyOptions}
        selections={filters}
      />
    </CollapsibleFilter>
  );
};

ZipCode.propTypes = {
  delayWait: PropTypes.number,
};
