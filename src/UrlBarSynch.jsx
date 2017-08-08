import announceUrlChanged from './actions/url'
import { connect } from 'react-redux'
import createHistory from 'history/createBrowserHistory'
import { dateFilters } from './constants'
import React from 'react';

const queryString = require( 'query-string' );

/**
* Converts the properties into a query string
*
* @param {string} props the props of a component
* @returns {string} a fomratted query string that can be appended to a URL
*/
export function toQS( props ) {
  const clone = { ...props.params }

  // Process the dates differently
  dateFilters.forEach( field => {
    if ( typeof clone[field] !== 'undefined' ) {
      clone[field] = clone[field].toISOString().substring( 0, 10 )
    }
  } )

  return '?' + queryString.stringify( clone )
}

export class UrlBarSynch extends React.Component {
  constructor( props ) {
    super( props )

    // URL handling
    this.history = createHistory()
    this.location = this.history.location
    this.defaultQS = toQS( props )
    this.currentQS = this.location.search

    // Listen for changes to the current location.
    this.history.listen( this._onUrlChanged.bind( this ) );
  }

  // This will initialize the application with the params in the URL
  // and then call the API
  componentDidMount() {
    this.props.onUrlChanged( this.location )
  }

  componentWillReceiveProps( nextProps ) {
    const qs = toQS( nextProps );
    if ( qs !== this.currentQS ) {
      this.currentQS = qs
      this.history.push( {
        search: qs
      } );
    }
  }

  render() {
    return null
  }

  //---------------------------------------------------------------------------
  // URL Handlers

  _onUrlChanged( location, action ) {
    if ( action === 'POP' ) {
      this.currentQS = location.search
      this.props.onUrlChanged( location );
    }
  }
}

export const mapStateToProps = state => ( {
  params: { ...state.query }
} )

export const mapDispatchToProps = dispatch => ( {
  onUrlChanged: location => {
    dispatch( announceUrlChanged( location ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( UrlBarSynch )

