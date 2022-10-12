import 'react-bootstrap-typeahead/css/Typeahead.css';
import './Typeahead.less';
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { AsyncTypeahead as Typeahead } from 'react-bootstrap-typeahead';
import iconMap from '../iconMap';
import HighlightingOption from './HighlightingOption';
// import HighlightingOption from './HighlightingOption';

export const AsyncTypeahead = ({
  className,
  htmlId,
  ariaLabel,
  handleChange,
  handleSearch,
  options,
  placeholder,
  //   ref,
}) => {
  const ref = useRef();
  return (
    <section
      className={`typeahead ${className}`}
      // onBlur={this._onBlur}
      // onFocus={this._onFocus}
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
        <Typeahead
          id="zipcode-typeahead"
          minLength={2}
          className="typeahead-selector"
          //   clearButton={true}
          isLoading={false}
          // filterBy={filterBy}
          // ref={ref}
          // newSelectionPrefix="Custom search: "
          // onChange={(selected) => handleChange(selected)}
          // onKeyDown={(event) => handlePressEnter(event)}
          onSearch={(input) => handleSearch(input)}
          onChange={(selected) => {
            handleChange(selected);
            ref.current.clear();
          }}
          options={options}
          maxResults={5}
          // paginate={false}
          placeholder={placeholder}
          //   renderMenuItemChildren={_renderOptions}
          renderMenuItemChildren={(option) => (
            <li className="typeahead-option body-copy">
              <HighlightingOption {...option} />
            </li>
          )}
          ref={ref}
          data-cy="input-search"
        />
        {/* <input
            type="text"
            autoComplete="off"
            className="a-text-input"
            disabled={this.props.isDisabled}
            id={this.props.htmlId}
            onChange={this._valueUpdated}
            onKeyDown={this._onKeyDown}
            placeholder={this.props.placeholder}
            value={this.state.inputValue}
            {...this.props.textBoxProps}
          />
          {this.state.inputValue ? clear : null} */}
      </div>
      {/* {this.state.focused ? this.renderMap[this.state.phase]() : null} */}
    </section>
  );
};

AsyncTypeahead.propTypes = {
  // debounceWait: PropTypes.number,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  //   debounceWait: PropTypes.number,
  //   isDisabled: PropTypes.bool,
  //   isDisableTypeahead: PropTypes.bool,
  htmlId: PropTypes.string,
  //   maxVisible: PropTypes.number,
  //   minLength: PropTypes.number,
  //   mode: PropTypes.oneOf([MODE_OPEN, MODE_CLOSED]).isRequired,
  handleChange: PropTypes.func,
  handleSearch: PropTypes.func,
  placeholder: PropTypes.string,
  //   renderOption: PropTypes.func,
  ref: PropTypes.element,
  //   textBoxProps: PropTypes.object,
  //   value: PropTypes.string,
  options: PropTypes.array,
};
