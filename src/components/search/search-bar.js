import './search-bar.scss';
import {
  hideAdvancedSearchTips,
  showAdvancedSearchTips,
} from '../../reducers/view/view-slice';
import {
  searchFieldChanged,
  searchTextChanged,
} from '../../reducers/query/query-slice';
import { Button, Link, SelectSingle } from '@cfpb/design-system-react';
import { AdvancedTips } from './advanced-tips/advanced-tips';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useState } from 'react';
import {
  selectQuerySearchField,
  selectQuerySearchText,
} from '../../reducers/query/selectors';
import { selectViewHasAdvancedSearchTips } from '../../reducers/view/selectors';
import { AsyncTypeahead } from '../typeahead/async-typeahead/async-typeahead';
import { Input } from '../typeahead/input/input';

const searchFieldOptions = [
  { value: 'all', label: 'All data' },
  { value: 'company', label: 'Company name' },
  { value: 'complaint_what_happened', label: 'Narratives' },
];

export const SearchBar = () => {
  const dispatch = useDispatch();
  const searchField = useSelector(selectQuerySearchField);
  const searchText = useSelector(selectQuerySearchText);
  const hasAdvancedSearchTips = useSelector(selectViewHasAdvancedSearchTips);
  const [inputValue, setInputValue] = useState(searchText);
  const [isDirty, setIsDirty] = useState(false);
  // handleClear is called whenever the user submits by pressing enter
  // shouldCallClear prevents handleClear from firing a reset after the search is set
  const [shouldCallClear, setShouldCallClear] = useState(true);

  const displayedValue = isDirty ? inputValue : searchText;
  const options = useMemo(() => searchFieldOptions, []);

  const onSearchTipToggle = (isOn) => {
    if (isOn) {
      dispatch(hideAdvancedSearchTips());
    } else {
      dispatch(showAdvancedSearchTips());
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(searchTextChanged(displayedValue));
    setIsDirty(false);
  };

  const onSelectSearchField = (selected) => {
    if (!selected?.value) {
      return;
    }
    dispatch(searchFieldChanged(selected.value));
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
      setIsDirty(false);
    }
    setShouldCallClear(true);
  };

  const onPressEnter = (event) => {
    if (event.key !== 'Enter') {
      return;
    }

    setShouldCallClear(false);
    dispatch(searchTextChanged(event.target.value));
    setInputValue(event.target.value);
    setIsDirty(false);
  };

  return (
    <div className="search-bar" role="search">
      <form action="" onSubmit={handleSubmit}>
        <div className="search-bar__controls">
          <div className="search-field-select">
            <SelectSingle
              id="searchField"
              label="Choose which field will be searched"
              options={options}
              value={searchField}
              onChange={onSelectSearchField}
            />
          </div>
          <div className="search-bar__input">
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
                placeholder=""
                fieldName="company"
              />
            ) : (
              <Input
                handleChange={(event) => {
                  setInputValue(event.target.value);
                  setIsDirty(true);
                }}
                handleClear={onClearInput}
                handlePressEnter={onPressEnter}
                htmlId="searchText"
                value={displayedValue}
                ariaLabel="Enter the term you want to search for"
                placeholder=""
              />
            )}
          </div>
          <Link
            className="u-visually-hidden"
            to="#search-summary"
            label="Skip to Results"
          />
        </div>
      </form>
      <div className="search-bar__tips">
        <Button
          label={
            hasAdvancedSearchTips ? 'Hide search tips' : 'Show search tips'
          }
          isLink
          iconLeft={hasAdvancedSearchTips ? 'minus' : 'plus'}
          onClick={onAdvancedClicked}
        />
      </div>
      {hasAdvancedSearchTips ? <AdvancedTips /> : null}
    </div>
  );
};
