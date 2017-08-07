import { getComplaints } from './complaints'
import { URL_CHANGED } from '../constants'

const queryString = require( 'query-string' );

//-----------------------------------------------------------------------------

export function processLocation( location ) {
  const qs = location.search;
  const params = queryString.parse( qs );

  return {
    pathname: location.pathname,
    params
  }
}

//-----------------------------------------------------------------------------

export function urlChanged( pathname, params ) {
  return {
    type: URL_CHANGED,
    pathname,
    params
  }
}

export default function announceUrlChanged( location ) {
  const { pathname, params } = processLocation( location );
  return dispatch => {
    dispatch( urlChanged( pathname, params ) )
    dispatch( getComplaints() )
  }
}
