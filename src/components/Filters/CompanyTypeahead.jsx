import { addMultipleFilters } from '../../actions/filter'
import { bindAll } from '../../utils'
import { connect } from 'react-redux'
import HighlightingOption from '../Typeahead/HighlightingOption'
import PropTypes from 'prop-types'
import React from 'react'
import Typeahead from '../Typeahead'

const FIELD_NAME = 'company'

export class CompanyTypeahead extends React.Component {
  constructor( props ) {
    super( props )

    // Bindings
    bindAll( this, [
      '_onInputChange',
      '_onOptionSelected',
      '_renderOption'
    ] )
  }

  render() {
    return (
      <Typeahead ariaLabel="Start typing to begin listing companies"
                 htmlId={ 'company-typeahead-' + this.props.id }
                 debounceWait={ this.props.debounceWait }
                 onInputChange={ this._onInputChange }
                 onOptionSelected={ this._onOptionSelected }
                 placeholder="Enter company name"
                 renderOption={ this._renderOption }
                 disabled={ this.props.disabled }
      />
    )
  }


  // --------------------------------------------------------------------------
  // Typeahead interface

  _onInputChange( value ) {
    const n = value.toLowerCase()

    const qs = this.props.queryString + '&text=' + value

    const uri = '@@API_suggest_company/' + qs
    return fetch( uri )
      .then( result => result.json() )
      .then( items => items.map( x => ( {
        key: x,
        label: x,
        position: x.toLowerCase().indexOf( n ),
        value
      } ) ) )
  }

  _renderOption( obj ) {
    return {
      value: obj.key,
      component: <HighlightingOption { ...obj } />
    }
  }

  _onOptionSelected( item ) {
    this.props.typeaheadSelect( item.key )
  }
}

CompanyTypeahead.propTypes = {
  debounceWait: PropTypes.number
}

CompanyTypeahead.defaultProps = {
  debounceWait: 250
}

export const mapStateToProps = state => ( {
  disabled: state.query.focus && state.query.lens === 'Company',
  queryString: state.query.queryString
} )

export const mapDispatchToProps = dispatch => ( {
  typeaheadSelect: value => {
    dispatch( addMultipleFilters( FIELD_NAME, [ value ] ) )
  }
} )

export default connect( mapStateToProps,
  mapDispatchToProps )( CompanyTypeahead )
