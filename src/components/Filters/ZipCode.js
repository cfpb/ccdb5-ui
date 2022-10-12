import React, { useState } from 'react';
// import { AsyncTypeahead } from 'react-bootstrap-typeahead';
// import { coalesce } from '../../utils';
import { addMultipleFilters } from '../../actions/filter';
import CollapsibleFilter from './CollapsibleFilter';
import { useDispatch, useSelector } from 'react-redux';
// import HighlightingOption from '../Typeahead/HighlightingOption';
// import PropTypes from 'prop-types';
import { stateToQS } from '../../reducers/query/query';
// import StickyOptions from './StickyOptions';
// import Typeahead from '../Typeahead';
import { API_PLACEHOLDER } from '../../constants';
// import { selectAggsState } from '../../reducers/aggs/selectors';
import { selectQueryState } from '../../reducers/query/selectors';
import { AsyncTypeahead } from '../Typeahead/AsyncTypeahead';

const FIELD_NAME = 'zip_code';

export const ZipCode = () => {
  const dispatch = useDispatch();
  // const typeaheadRef = useRef();
  // const aggs = useSelector(selectAggsState);
  const query = useSelector(selectQueryState);
  const [dropdownOptions, setDropdownOptions] = useState([]);

  // const options = coalesce(aggs, FIELD_NAME, []);
  const queryState = Object.assign({}, query);
  // make sure searchAfter doesn't appear, it'll mess up your search endpoint
  queryState.searchAfter = '';
  const queryString = stateToQS(queryState);
  // const selections = coalesce(state.query, FIELD_NAME, []);

  const typeaheadSelect = (value) => {
    dispatch(addMultipleFilters(FIELD_NAME, [value]));
    setDropdownOptions([]);
    // typeaheadRef.current.clear();
  };

  const _onInputChange = (value) => {
    const n = value.toLowerCase();
    // typeaheadRef.current.setState(value);

    if (n === '') {
      setDropdownOptions([]);
      return;
    }

    const qs = queryString + '&text=' + value;

    const uri = `${API_PLACEHOLDER}_suggest_zip/${qs}`;
    fetch(uri)
      .then((response) => response.json())
      // .then((data) => setDropdownOptions(data));
      .then((items) => {
        const options = items.map((x) => ({
          key: x,
          label: x,
          position: x.toLowerCase().indexOf(n),
          value,
        }));
        console.log(options);
        setDropdownOptions(options);
      });
    // setDropdownOptions(results);
  };

  // const _renderOptions = (obj) => {
  //   return <HighlightingOption {...obj} />;
  // };

  const _onOptionSelected = (item) => {
    console.log(item);
    typeaheadSelect(item[0].key);
  };
  return (
    <CollapsibleFilter
      title="ZIP code"
      desc="The mailing ZIP code provided by the consumer"
      className="aggregation"
    >
      <AsyncTypeahead
        // className="typeahead"
        htmlId="zipcode-typeahead"
        ariaLabel="Start typing to begin listing zip codes"
        // filterBy={filterBy}
        // ref={ref}
        // newSelectionPrefix="Custom search: "
        // onChange={(selected) => handleChange(selected)}
        // onKeyDown={(event) => handlePressEnter(event)}
        handleSearch={_onInputChange}
        handleChange={_onOptionSelected}
        options={dropdownOptions}
        placeholder="Enter first three digits of ZIP code"
        // paginate={false}
        // placeholder="Enter first three digits of ZIP code"
        // renderMenuItemChildren={_renderOptions}
        // ref={typeaheadRef}
      />
      {/* <AsyncTypeahead
        id="zipcode-typeahead"
        minLength={2}
        className="typeahead"
        isLoading={false}
        // filterBy={filterBy}
        // ref={ref}
        // newSelectionPrefix="Custom search: "
        // onChange={(selected) => handleChange(selected)}
        // onKeyDown={(event) => handlePressEnter(event)}
        onSearch={_onInputChange}
        onChange={_onOptionSelected}
        options={dropdownOptions}
        maxResults={5}
        // paginate={false}
        placeholder="Enter first three digits of ZIP code"
        renderMenuItemChildren={_renderOptions}
        data-cy="input-search"
      /> */}
    </CollapsibleFilter>
  );
};

// ZipCode.propTypes = {
//   // debounceWait: PropTypes.number,
//   options: PropTypes.array.isRequired,
//   selections: PropTypes.array,
//   queryString: PropTypes.string.isRequired,
//   typeaheadSelect: PropTypes.func.isRequired,
// };

// ZipCode.defaultProps = {
//   debounceWait: 250,
// };
