import { bindAll, sanitizeHtmlId } from '../../utils';
import { addMultipleFilters } from '../../actions/filter';
import { connect } from 'react-redux';
import { HighlightingOption } from '../Typeahead/HighlightingOption/HighlightingOption';
import PropTypes from 'prop-types';
import React from 'react';
import { stateToQS } from '../../reducers/query/query';
import { Typeahead } from '../Typeahead/Typeahead';
import { API_PLACEHOLDER } from '../../constants';

const FIELD_NAME = 'company';

export class CompanyTypeahead extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
    bindAll(this, ['_onInputChange', '_onOptionSelected', '_renderOption']);
  }

  render() {
    return (
      <Typeahead
        ariaLabel="Start typing to begin listing companies"
        htmlId={sanitizeHtmlId('company-typeahead-' + this.props.id)}
        debounceWait={this.props.debounceWait}
        onInputChange={this._onInputChange}
        onOptionSelected={this._onOptionSelected}
        placeholder="Enter company name"
        renderOption={this._renderOption}
        disabled={this.props.isDisabled}
      />
    );
  }

  // --------------------------------------------------------------------------
  // Typeahead interface

  _onInputChange(value) {
    const n = value.toLowerCase();

    const qs = this.props.queryString + '&text=' + value;

    const uri = `${API_PLACEHOLDER}_suggest_company/${qs}`;
    return fetch(uri)
      .then((result) => result.json())
      .then((items) =>
        items.map((x) => ({
          key: x,
          label: x,
          position: x.toLowerCase().indexOf(n),
          value,
        }))
      );
  }

  _renderOption(obj) {
    return {
      value: obj.key,
      component: <HighlightingOption {...obj} />,
    };
  }

  _onOptionSelected(item) {
    this.props.typeaheadSelect(item.key);
  }
}

export const mapStateToProps = (state) => {
  const queryState = Object.assign({}, state.query);
  // make sure searchAfter doesn't appear, it'll mess up your search endpoint
  queryState.searchAfter = '';
  return {
    isDisabled: state.query.focus && state.query.lens === 'Company',
    queryString: stateToQS(queryState),
  };
};

export const mapDispatchToProps = (dispatch) => ({
  typeaheadSelect: (value) => {
    dispatch(addMultipleFilters(FIELD_NAME, [value]));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CompanyTypeahead);

CompanyTypeahead.propTypes = {
  debounceWait: PropTypes.number,
  id: PropTypes.string,
  isDisabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  queryString: PropTypes.string.isRequired,
  typeaheadSelect: PropTypes.func.isRequired,
};

CompanyTypeahead.defaultProps = {
  debounceWait: 250,
};
