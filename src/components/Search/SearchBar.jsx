import './SearchBar.less'
import Typeahead, { MODE_OPEN } from '../Typeahead'
import AdvancedTips from '../Dialogs/AdvancedTips'
import { connect } from 'react-redux'
import HighlightingOption from '../Typeahead/HighlightingOption'
import PropTypes from 'prop-types'
import React from 'react'
import { searchChanged } from '../../actions/search'

const searchFields = {
  all: 'All data',
  company: 'Company name',
  // eslint-disable-next-line camelcase
  complaint_what_happened: 'Narratives'
}

export class SearchBar extends React.Component {
  constructor( props ) {
    super( props )
    this.state = {
      inputValue: props.searchText,
      searchField: props.searchField,
      advancedShown: false
    }

    // This binding is necessary to make `this` work in the callback
    // https://facebook.github.io/react/docs/handling-events.html
    this._handleSubmit = this._handleSubmit.bind( this )
    this._onInputChange = this._onInputChange.bind( this )
    this._onSelectSearchField = this._onSelectSearchField.bind( this )
    this._onTypeaheadSelected = this._onTypeaheadSelected.bind( this )
    this._onAdvancedClicked = this._onAdvancedClicked.bind( this )
    this._updateLocalState = this._updateLocalState.bind( this )
  }

  componentDidUpdate( prevProps ) {
    const { searchField, searchText } = this.props
    if ( prevProps.searchText !== searchText ||
      prevProps.searchField !== searchField ) {
      // sync local state from redux
      this._updateLocalState( searchField, searchText )
    }
  }

  shouldComponentUpdate( nextProps, nextState ) {
    return JSON.stringify( this.state ) !== JSON.stringify( nextState ) ||
      JSON.stringify( this.props ) !== JSON.stringify( nextProps )
  }

  render() {
    return (
      <div>
        <div className="search-bar" role="search">
          <form action="" onSubmit={this._handleSubmit}>
            <h3 className="h4">Search within</h3>
            <div className="layout-row">
              <div className="cf-select flex-fixed">
                <select aria-label="Choose which field will be searched"
                        id="searchField"
                        onChange={this._onSelectSearchField}
                        value={this.state.searchField}>
                  <optgroup label="Search Within">
                  {
                    Object.keys( searchFields ).map( x =>
                        <option key={x} value={x}>{searchFields[x]}</option>
                      )
                  }
                  </optgroup>
                </select>
              </div>
              <div className="flex-all typeahead-portal">
                <Typeahead ariaLabel="Enter the term you want to search for"
                           debounceWait={this.props.debounceWait}
                           htmlId="searchText"
                           mode={MODE_OPEN}
                           onInputChange={this._onInputChange}
                           onOptionSelected={this._onTypeaheadSelected}
                           placeholder="Enter your search term(s)"
                           renderOption={this._renderOption}
                           value={this.state.inputValue}
                />
              </div>

              <button type="submit"
                      className="a-btn flex-fixed"
                      ref={elem => { this.submitButton = elem }}>
                  Search
              </button>

              <a className="u-visually-hidden"
                 href="#search-summary">
                 Skip to Results
              </a>

              <div className="advanced-container flex-fixed">
              {
               this.state.advancedShown ?
                 <button className="a-btn a-btn__link o-expandable_cue-close"
                      onClick={ this._onAdvancedClicked }>
                      Hide advanced search tips
                  </button> :
                  <button className="a-btn a-btn__link o-expandable_cue-open"
                      onClick={ this._onAdvancedClicked }>
                      Show advanced search tips
                  </button>
              }
              </div>
            </div>
          </form>
        </div>
        {
         this.state.advancedShown ?
           <AdvancedTips /> :
           null
         }
       </div>
    )
  }

  // --------------------------------------------------------------------------
  // Event Handlers

  _handleSubmit( event ) {
    event.preventDefault()
    this.props.onSearch( this.state.inputValue, this.state.searchField )
  }

  _onSelectSearchField( event ) {
    this.setState( {
      searchField: event.target.value
    } )
  }

  _onAdvancedClicked( ) {
    this.setState( {
      advancedShown: !this.state.advancedShown
    } )
  }

  _updateLocalState( searchField, searchText ) {
    this.setState( {
      inputValue: searchText,
      searchField: searchField
    } )
  }

  // --------------------------------------------------------------------------
  // Typeahead interface

  _onInputChange( value ) {
    this.setState( {
      inputValue: value
    } )

    const n = value.toLowerCase()

    const uriCompany = '@@API_suggest_company/?text=' + value
    const uriDefault = '@@API_suggest/?text=' + value

    const uri = this.state.searchField === 'company' ? uriCompany : uriDefault

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
      component: <HighlightingOption {...obj} />
    }
  }

  _onTypeaheadSelected( obj ) {
    const inputValue = typeof obj === 'object' ? obj.key : obj
    this.props.onSearch( inputValue, this.state.searchField )
  }
}

// ----------------------------------------------------------------------------
// Meta

SearchBar.propTypes = {
  debounceWait: PropTypes.number
}

SearchBar.defaultProps = {
  debounceWait: 250
}

export const mapStateToProps = state => ( {
  searchText: state.query.searchText,
  searchField: state.query.searchField
} )

export const mapDispatchToProps = dispatch => ( {
  onSearch: ( text, searchField ) => {
    dispatch( searchChanged( text, searchField ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( SearchBar )
