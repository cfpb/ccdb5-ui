import './SearchBar.scss';
import {
  hideAdvancedSearchTips,
  showAdvancedSearchTips,
} from '../../reducers/view/viewSlice';
import {
  searchFieldChanged,
  searchTextChanged,
} from '../../reducers/query/querySlice';
import { Button } from '@cfpb/design-system-react';
import { AdvancedTips } from './AdvancedTips/AdvancedTips';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  selectQuerySearchField,
  selectQuerySearchText,
} from '../../reducers/query/selectors';
import { selectViewHasAdvancedSearchTips } from '../../reducers/view/selectors';
import { AsyncTypeahead } from '../Typeahead/AsyncTypeahead/AsyncTypeahead';
import { Input } from '../Typeahead/Input/Input';

const searchFields = {
  all: 'All data',
  company: 'Company name',
  complaint_what_happened: 'Narratives',
};

export const SearchBar = () => {
  const dispatch = useDispatch();
  const searchField = useSelector(selectQuerySearchField);
  const searchText = useSelector(selectQuerySearchText);
  const hasAdvancedSearchTips = useSelector(selectViewHasAdvancedSearchTips);
  const [inputValue, setInputValue] = useState(searchText);
  // handleClear is called whenever the user submits by pressing enter
  // shouldCallClear prevents handleClear from firing a reset after the search is set
  const [shouldCallClear, setShouldCallClear] = useState(true);

  useEffect(() => {
    setInputValue(searchText);
  }, [searchText]);

  const onSearchTipToggle = (isOn) => {
    if (isOn) {
      dispatch(hideAdvancedSearchTips());
    } else {
      dispatch(showAdvancedSearchTips());
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

  const onSelection = (value) => {
    const targetVal = value && value[0] ? value[0].key : '';
    dispatch(searchTextChanged(targetVal));
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
      <div className="search-bar u-mb25" role="search">
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
                  {Object.keys(searchFields).map((key) => (
                    <option key={key} value={key}>
                      {searchFields[key]}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div className="flex-all typeahead-portal">
              {searchField === 'company' ? (
                <AsyncTypeahead
                  ariaLabel="Enter your search term(s)"
                  htmlId="searchText"
                  defaultValue={searchText}
                  handleChange={onSelection}
                  handleClear={onTypeaheadClear}
                  handlePressEnter={onPressEnter}
                  handleSelectionOverride={onSelection}
                  hasClearButton={true}
                  hasSearchButton={true}
                  placeholder="Enter your search term(s)"
                  fieldName="company"
                />
              ) : (
                <Input
                  handleChange={(event) => setInputValue(event.target.value)}
                  handleClear={onClearInput}
                  handlePressEnter={onPressEnter}
                  htmlId="searchText"
                  value={inputValue}
                  ariaLabel="Enter the term you want to search for"
                  placeholder="Enter your search term(s)"
                />
              )}
            </div>
            <a className="u-visually-hidden" href="#search-summary">
              Skip to Results
            </a>

            <div className="advanced-container flex-fixed">
              <Button
                label={
                  hasAdvancedSearchTips
                    ? 'Hide advanced search tips'
                    : 'Show advanced search tips'
                }
                asLink
                onClick={onAdvancedClicked}
              />
            </div>
          </div>
        </form>
      </div>
      {hasAdvancedSearchTips ? <AdvancedTips /> : null}
    </div>
  );
};
