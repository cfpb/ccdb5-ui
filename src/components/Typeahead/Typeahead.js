// Adapted from https://github.com/fmoo/react-typeahead

import './Typeahead.less';
import * as keys from '../../constants';
import { debounce } from '../../utils';
import iconMap from '../iconMap';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Selector } from './Selector/Selector';
import {
  ACCUM_PHASE,
  CHOSEN_PHASE,
  EMPTY_PHASE,
  ERROR_PHASE,
  MODE_CLOSED,
  MODE_OPEN,
  NO_RESULTS_PHASE,
  RESULTS_PHASE,
  TOO_MANY_PHASE,
  WAITING_PHASE,
} from './utils';

export const Typeahead = ({
  ariaLabel,
  className,
  debounceWait,
  isDisabled,
  isDisableTypeahead,
  htmlId,
  maxVisible,
  minLength,
  mode,
  onInputChange,
  onOptionSelected,
  placeholder,
  renderOption,
  textBoxProps,
  value,
}) => {
  const findPhaseFromValue = (givenValue) => {
    let newPhase = givenValue ? WAITING_PHASE : EMPTY_PHASE;
    if (givenValue && givenValue.length < minLength) {
      newPhase = ACCUM_PHASE;
    }
    return newPhase;
  };
  const [inputValue, setInputValue] = useState(value);
  const [focused, setFocused] = useState(false);
  const [phase, setPhase] = useState(findPhaseFromValue(value));
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const setStateFromValue = (value) => {
    setInputValue(value);
    console.log('setStateFromValue');
    console.log(findPhaseFromValue(value));
    setPhase(findPhaseFromValue(value));
    setSearchResults([]);
    setSelectedIndex(-1);
  };

  useEffect(() => {
    const setStateFromOptions = (options) => {
      let newPhase = RESULTS_PHASE;
      if (!options || options.length === 0) {
        newPhase = NO_RESULTS_PHASE;
      } else if (options.length > maxVisible) {
        newPhase = TOO_MANY_PHASE;
      }

      setPhase(newPhase);
      setSearchResults(options);
      setSelectedIndex(-1);
    };

    const _callForOptions = () => {
      console.log('in call for options');
      console.log('phase', phase);
      if (phase !== WAITING_PHASE) {
        return;
      }

      const returned = onInputChange(inputValue);
      console.log('returned.then', returned.then);

      // Did the callback produce a promise?
      if (typeof returned.then === 'function') {
        console.log('returned function');
        returned.then(
          (options) => setStateFromOptions(options),
          (error) => _onOptionsError(error)
        );
      } else {
        setStateFromOptions(returned);
      }
    };

    if (debounceWait) {
      debounce(_callForOptions, debounceWait);
    } else {
      _callForOptions();
    }
  }, [debounceWait, onInputChange, inputValue, phase, maxVisible]);

  const _openClear = () => {
    setStateFromValue('');
    onOptionSelected('');
  };

  const _closedKeyCancel = (event) => {
    event.preventDefault();
    setStateFromValue('');
  };

  const clearAction = mode === MODE_OPEN ? _openClear : _closedKeyCancel;

  const clear = (
    <button className="a-btn a-btn__link" onClick={clearAction}>
      {iconMap.getIcon('delete')}
      Clear
    </button>
  );

  const _onBlur = () => {
    setFocused(false);
  };

  const _onFocus = () => {
    setFocused(true);
  };

  const _onKeyDown = (event) => {
    const handler = keyMap[event.which];
    if (handler) {
      console.log('_onKeyDown');
      console.log(event);
      handler(event);
    }
  };

  // --------------------------------------------------------------------------
  // Search Methods

  const _calculateNewIndex = (delta) => {
    const max = Math.min(maxVisible, searchResults.length);
    if (max === 0) {
      return -1;
    }

    // Clamp the new index
    let newIndex = selectedIndex + delta;
    if (newIndex < 0) {
      newIndex = 0;
    }
    if (newIndex >= max) {
      newIndex = max - 1;
    }

    return newIndex;
  };

  const _onOptionsError = () => {
    setPhase(ERROR_PHASE);
  };

  const _selectOption = (index) => {
    onOptionSelected(searchResults[index]);
    if (mode === MODE_CLOSED) {
      setInputValue('');
    }
    setPhase(CHOSEN_PHASE);
    setSearchResults([]);
    setSelectedIndex(-1);
  };

  // --------------------------------------------------------------------------
  // Key Helpers

  const _closedChooseIndex = (event) => {
    if (searchResults.length === 0) {
      return;
    }

    let idx = selectedIndex;
    if (idx === -1) {
      idx = 0;
    }

    _selectOption(idx);
    event.preventDefault();
  };

  const _closedNav = (event, delta) => {
    event.preventDefault();
    const newIndex = _calculateNewIndex(delta);
    if (newIndex >= 0) {
      setSelectedIndex(newIndex);
    }
  };

  const _openKeyEnter = (event) => {
    event.preventDefault();
    onOptionSelected(inputValue);
    setPhase(CHOSEN_PHASE);
  };

  const _openKeyCancel = (event) => {
    event.preventDefault();
    setPhase(CHOSEN_PHASE);
  };

  const _openNav = (event, delta) => {
    event.preventDefault();
    const newIndex = _calculateNewIndex(delta);
    if (newIndex >= 0) {
      // May need an extractor callback eventually
      // For now, assume the shape of the options
      setInputValue(searchResults[newIndex].key);
      setSelectedIndex(newIndex);
    }
  };

  // --------------------------------------------------------------------------
  // Render Helpers

  const _renderError = () => {
    return (
      <span className="error">There was a problem retrieving the options</span>
    );
  };

  const _renderEmpty = () => {
    return null;
  };

  const _renderWaiting = () => {
    return isDisableTypeahead ? null : (
      <span className="waiting">waiting...</span>
    );
  };

  const _renderNoResults = () => {
    return <span className="no-results">No results found</span>;
  };

  const _renderResults = () => {
    return (
      <Selector
        options={searchResults}
        onOptionSelected={_selectOption}
        renderOption={renderOption}
        selectedIndex={selectedIndex}
      />
    );
  };

  const _renderTooManyResults = () => {
    const subset = searchResults.slice(0, maxVisible);
    return (
      <Selector
        options={subset}
        onOptionSelected={_selectOption}
        renderOption={renderOption}
        selectedIndex={selectedIndex}
        footer="Continue typing for more results"
      />
    );
  };

  // Render/Phase Map
  const renderMap = {
    ERROR: _renderError,
    EMPTY: _renderEmpty,
    ACCUM: _renderEmpty,
    WAITING: _renderWaiting,
    NO_RESULTS: _renderNoResults,
    RESULTS: _renderResults,
    TOO_MANY: _renderTooManyResults,
    CHOSEN: _renderEmpty,
  };

  // Key/function map
  const keyMap = {};

  if (mode === MODE_OPEN) {
    keyMap[keys.VK_ESCAPE] = _openKeyCancel;
    keyMap[keys.VK_UP] = (event) => _openNav(event, -1);
    keyMap[keys.VK_DOWN] = (event) => _openNav(event, 1);
    keyMap[keys.VK_ENTER] = _openKeyEnter;
    keyMap[keys.VK_RETURN] = _openKeyEnter;
    keyMap[keys.VK_TAB] = _closedChooseIndex;

    // In open mode, just hide the fact that no typeahead results match
    renderMap['NO_RESULTS'] = _renderEmpty;
  } else {
    keyMap[keys.VK_ESCAPE] = _closedKeyCancel;
    keyMap[keys.VK_UP] = (event) => _closedNav(event, -1);
    keyMap[keys.VK_DOWN] = (event) => _closedNav(event, 1);
    keyMap[keys.VK_ENTER] = _closedChooseIndex;
    keyMap[keys.VK_RETURN] = _closedChooseIndex;
    keyMap[keys.VK_TAB] = _closedChooseIndex;
  }

  return (
    <section
      className={`typeahead ${className}`}
      onBlur={_onBlur}
      onFocus={_onFocus}
    >
      <div className="m-btn-inside-input input-contains-label">
        <div
          className="input-contains-label_before
                        input-contains-label_before__search"
        >
          {iconMap.getIcon('search')}
        </div>

        <label className="u-visually-hidden" htmlFor={htmlId}>
          {ariaLabel}
        </label>
        <input
          type="text"
          autoComplete="off"
          className="a-text-input"
          disabled={isDisabled}
          id={htmlId}
          onChange={(event) => setStateFromValue(event.target.value)}
          onKeyDown={_onKeyDown}
          placeholder={placeholder}
          value={inputValue}
          {...textBoxProps}
        />
        {inputValue ? clear : null}
      </div>
      {focused ? renderMap[phase]() : null}
    </section>
  );
};

Typeahead.propTypes = {
  ariaLabel: PropTypes.string.isRequired,
  className: PropTypes.string,
  debounceWait: PropTypes.number,
  isDisabled: PropTypes.bool,
  isDisableTypeahead: PropTypes.bool,
  htmlId: PropTypes.string.isRequired,
  maxVisible: PropTypes.number,
  minLength: PropTypes.number,
  mode: PropTypes.oneOf([MODE_OPEN, MODE_CLOSED]).isRequired,
  onInputChange: PropTypes.func.isRequired,
  onOptionSelected: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  renderOption: PropTypes.func,
  textBoxProps: PropTypes.object,
  value: PropTypes.string,
};

Typeahead.defaultProps = {
  className: '',
  debounceWait: 0,
  maxVisible: 5,
  minLength: 2,
  mode: MODE_CLOSED,
  placeholder: 'Enter your search text',
  renderOption: (x) => ({
    value: x,
    component: x,
  }),
  textBoxProps: {},
  value: '',
};
