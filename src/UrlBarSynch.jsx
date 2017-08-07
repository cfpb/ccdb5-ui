import announceUrlChanged from './actions/url'
import { connect } from 'react-redux'
import createHistory from 'history/createBrowserHistory';
import React from 'react';

const queryString = require( 'query-string' );

export function toQS( props ) {
  return '?' + queryString.stringify( props.params )
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

