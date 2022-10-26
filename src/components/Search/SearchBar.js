import './SearchBar.less';
import { hideAdvancedTips, showAdvancedTips } from '../../actions/view';
import { searchFieldChanged, searchTextChanged } from '../../actions/search';
import AdvancedTips from '../Dialogs/AdvancedTips';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { API_PLACEHOLDER } from '../../constants';
import {
  selectQuerySearchField,
  selectQuerySearchText,
} from '../../reducers/query/selectors';
import { selectViewHasAdvancedSearchTips } from '../../reducers/view/selectors';
import { AsyncTypeahead } from '../Typeahead/AsyncTypeahead/AsyncTypeahead';
import { Input } from '../Typeahead/Input/Input';
import { handleFetchSearch } from '../Typeahead/utils';

const searchFields = {
  all: 'All data',
  company: 'Company name',
  complaint_what_happened: 'Narratives',
};

export const SearchBar = ({ debounceWait }) => {
  const dispatch = useDispatch();
  const searchField = useSelector(selectQuerySearchField);
  const searchText = useSelector(selectQuerySearchText);
  const hasAdvancedSearchTips = useSelector(selectViewHasAdvancedSearchTips);
  const [inputValue, setInputValue] = useState(searchText);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  // handleClear is called whenever the user submits by pressing enter
  // shouldCallClear prevents handleClear from firing a reset after the search is set
  const [shouldCallClear, setShouldCallClear] = useState(true);
  const isVisible = Boolean(searchText || inputValue);

  useEffect(() => {
    setInputValue(searchText);
  }, [searchText]);

  const onSearchTipToggle = (isOn) => {
    if (isOn) {
      dispatch(hideAdvancedTips());
    } else {
      dispatch(showAdvancedTips());
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(searchTextChanged(inputValue));
  };

  const onSelectSearchField = (event) => {
    dispatch(searchFieldChanged(event.target.value));
  };

  const onAdvancedClicked = (event) => {
    event.preventDefault();
    onSearchTipToggle(hasAdvancedSearchTips);
  };

  const onSearchChange = (value) => {
    console.log('HERE HERE HERE ');
    console.log(value);
    setInputValue(value);
    const uriCompany = `${API_PLACEHOLDER}_suggest_company/?text=${value}`;
    handleFetchSearch(value, setDropdownOptions, uriCompany);
  };

  const onSelection = (value) => {
    dispatch(searchTextChanged(value[0].key));
  };

  const onTypeaheadClear = () => {
    dispatch(searchTextChanged(''));
  };

  const onClearInput = () => {
    if (shouldCallClear) {
      dispatch(searchTextChanged(''));
      setInputValue('');
    }
    setShouldCallClear(true);
  };

  const onPressEnter = (event) => {
    if (event.key === 'Enter') {
      setShouldCallClear(false);
      dispatch(searchTextChanged(event.target.value));
    }
  };

  return (
    <div>
      <div className="search-bar" role="search">
        <form action="" onSubmit={handleSubmit}>
          <h3 className="h4">Search within</h3>
          <div className="layout-row">
            <div className="cf-select flex-fixed">
              <select
                aria-label="Choose which field will be searched"
                id="searchField"
                onChange={onSelectSearchField}
                value={searchField}
              >
                <optgroup label="Search Within">
                  {Object.keys(searchFields).map((x) => (
                    <option key={x} value={x}>
                      {searchFields[x]}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div className="flex-all typeahead-portal">
              {searchField === 'company' ? (
                <AsyncTypeahead
                  ariaLabel="Enter the term you want to search for"
                  htmlId="searchText"
                  defaultValue={searchText}
                  delayWait={debounceWait}
                  handleChange={onSelection}
                  handleClear={onTypeaheadClear}
                  handleSearch={onSearchChange}
                  hasClearButton={true}
                  options={dropdownOptions}
                  placeholder="Enter your search term(s)"
                />
              ) : (
                <Input
                  ariaLabel="Enter the term you want to search for"
                  htmlId="searchText"
                  handleChange={(event) => setInputValue(event.target.value)}
                  placeholder="Enter your search term(s)"
                  value={inputValue}
                  handleClear={onClearInput}
                  handlePressEnter={onPressEnter}
                  isClearVisible={isVisible}
                />
              )}
            </div>
            <button type="submit" className="a-btn flex-fixed">
              Search
            </button>

            <a className="u-visually-hidden" href="#search-summary">
              Skip to Results
            </a>

            <div className="advanced-container flex-fixed">
              <button className="a-btn a-btn__link" onClick={onAdvancedClicked}>
                {hasAdvancedSearchTips ? 'Hide ' : 'Show '}
                advanced search tips
              </button>
            </div>
          </div>
        </form>
      </div>
      {hasAdvancedSearchTips ? <AdvancedTips /> : null}
    </div>
  );
};

SearchBar.propTypes = {
  debounceWait: PropTypes.number,
};

SearchBar.defaultProps = {
  debounceWait: 250,
};
