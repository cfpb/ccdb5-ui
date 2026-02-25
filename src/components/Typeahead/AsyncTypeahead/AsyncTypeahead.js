import '../Typeahead.scss';
import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { AsyncTypeahead as Typeahead } from 'react-bootstrap-typeahead';
import { Icon, Button } from '@cfpb/design-system-react';
import { HighlightingOption } from '../HighlightingOption/HighlightingOption';
import { ClearButton } from '../ClearButton/ClearButton';
import { useDispatch, useSelector } from 'react-redux';
import { selectQueryRoot } from '../../../reducers/query/selectors';
import { selectFiltersRoot } from '../../../reducers/filters/selectors';
import { stateToQS } from '../../../reducers/query/querySlice';
import { useGetSuggestQuery } from '../../../api/complaints';
import { multipleFiltersAdded } from '../../../reducers/filters/filtersSlice';

export const AsyncTypeahead = ({
  ariaLabel,
  defaultValue = '',
  fieldName,
  htmlId,
  isDisabled = false,
  handleChange,
  handleClear,
  handlePressEnter,
  hasClearButton = false,
  hasSearchButton = false,
  handleSelectionOverride,
  maxResults = 5,
  placeholder = 'Enter your search text',
}) => {
  const dispatch = useDispatch();
  const ref = useRef();
  const query = useSelector(selectQueryRoot);
  const filters = useSelector(selectFiltersRoot);
  const [searchValue, setSearchValue] = useState(defaultValue);
  const [isVisible, setIsVisible] = useState(
    hasClearButton && (!!defaultValue || !!searchValue),
  );
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    ref.current.setState({ text: defaultValue });
    setSearchValue(ref.current.inputNode.value);
    if (defaultValue === '') {
      ref.current.clear();
      setIsVisible(false);
    } else setIsVisible(true);
  }, [defaultValue]);

  const handleTypeaheadClear = () => {
    if (handleClear) handleClear();
    ref.current.clear();
    setSearchValue('');
  };

  const onSelection = (value) => {
    if (handleSelectionOverride) {
      handleSelectionOverride(value);
    } else {
      dispatch(multipleFiltersAdded(fieldName, [value[0].key]));
    }
    setSearchValue('');
  };

  const onSearchHandler = useCallback(
    (newSearchTerm) => {
      if (handleChange) {
        handleChange(newSearchTerm);
      }
      setIsOpen(true);
      setIsVisible(!!newSearchTerm);
      setSearchValue(newSearchTerm);
    },
    [handleChange, setIsOpen, setSearchValue],
  );

  const filterBy = () => true;
  const suggestField = fieldName === 'company' ? 'company' : 'zip';
  const queryState = Object.assign({}, query, filters);
  queryState.searchAfter = '';
  const queryString = stateToQS(queryState);
  const qs = queryString + '&text=' + encodeURIComponent(searchValue);
  const url = `_suggest_${suggestField}/${qs}`;
  const {
    currentData: data,
    isFetching,
    isLoading,
  } = useGetSuggestQuery({ url: url }, { skip: !searchValue });

  const options = data
    ? data.map((item) => ({
        key: item,
        label: item,
        position: item.toLowerCase().indexOf(searchValue.toLowerCase()),
        value: searchValue,
      }))
    : [];

  return (
    <section className="typeahead">
      <div className="o-search-input">
        <div className="o-search-input__input">
          <label
            aria-label={ariaLabel}
            className="o-search-input__input-label"
            htmlFor={htmlId}
          >
            <Icon name="search" isPresentational />
          </label>
          <Typeahead
            id={htmlId}
            minLength={1}
            className="typeahead-selector"
            defaultInputValue={defaultValue}
            delay={250}
            disabled={isDisabled}
            filterBy={filterBy}
            inputProps={{
              id: htmlId,
              className: 'a-text-input a-text-input--full',
            }}
            isLoading={isLoading || isFetching}
            ref={ref}
            onInputChange={onSearchHandler}
            onChange={(selected) => {
              onSelection(selected);
              ref.current.clear();
              setSearchValue('');
            }}
            onKeyDown={(evt) => {
              if (handlePressEnter && evt.key === 'Enter') {
                handlePressEnter(evt);
                setIsOpen(false);
              }
            }}
            onSearch={onSearchHandler}
            options={options}
            maxResults={maxResults}
            placeholder={placeholder}
            renderMenuItemChildren={(option) => (
              <li className="typeahead-option body-copy">
                <HighlightingOption
                  key={option.key}
                  label={option.label}
                  position={option.position}
                  value={option.value}
                />
              </li>
            )}
            open={isOpen}
            promptText=""
            searchText=""
            emptyLabel={searchValue ? 'No matches found' : ''}
            // let RTKQ handle caching
            useCache={false}
          />

          {!!isVisible && (
            <ClearButton
              onClear={() => {
                handleTypeaheadClear();
                setIsVisible(false);
              }}
            />
          )}
        </div>
        {!!hasSearchButton && <Button type="submit" label="Search" />}
      </div>
    </section>
  );
};

AsyncTypeahead.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  fieldName: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  handleChange: PropTypes.func,
  handleClear: PropTypes.func,
  handlePressEnter: PropTypes.func,
  handleSelectionOverride: PropTypes.func,
  hasClearButton: PropTypes.bool,
  hasSearchButton: PropTypes.bool,
  htmlId: PropTypes.string.isRequired,
  maxResults: PropTypes.number,
  placeholder: PropTypes.string,
};
