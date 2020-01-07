// reducer for the Map Tab
import {
  COMPLAINTS_API_CALLED, COMPLAINTS_FAILED, COMPLAINTS_RECEIVED
} from '../actions/complaints'
import { TILE_MAP_STATES } from '../constants'

export const defaultState = {
  issue: [],
  product: [],
  state: []
}

export const processAggregations = agg => {
  const total = agg.doc_count
  const chartResults = []
  for ( const k in agg ) {
    if ( agg[k].buckets ) {
      agg[k].buckets.forEach( o => {
        chartResults.push( {
          name: o.key,
          value: o.doc_count,
          pctChange: 1,
          isParent: true,
          hasChildren: false,
          pctOfSet: Math.round( o.doc_count / total * 100 )
            .toFixed( 2 ),
          width: 0.5
        } )
      } )
    }
  }
  return chartResults
}


export const processStateAggregations = agg => {
  const states = Object.values( agg.state.buckets )
    .filter( o => TILE_MAP_STATES.includes( o.key ) )
    .map( o => ( {
      name: o.key,
      value: o.doc_count,
      issue: 'Being broke',
      product: 'Some Product Name'
    } ) );

  const stateNames = states.map( o => o.name );

  // patch any missing data
  if ( stateNames.length > 0 ) {
    TILE_MAP_STATES.forEach( o => {
      if ( !stateNames.includes( o ) ) {
        states.push( { name: o, value: 0, issue: '', product: '' } );
      }
    } );
  }
  return states
}

export default ( state = defaultState, action ) => {
  switch ( action.type ) {
    case COMPLAINTS_API_CALLED:
      return {
        ...state,
        activeCall: action.url,
        isLoading: true
      }

    case COMPLAINTS_RECEIVED: {
      const result = { ...state };

      const stateData = action.data.aggregations.state;
      const issueData = action.data.aggregations.issue;
      const productData = action.data.aggregations.product;

      result.state = processStateAggregations( stateData )
      result.issue = processAggregations( issueData )
      result.product = processAggregations( productData )

      return result;
    }

    case COMPLAINTS_FAILED:
      return {
        ...defaultState,
        error: action.error
      }

    default:
      return state
  }
}
