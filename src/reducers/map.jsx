// reducer for the Map Tab
import {
  STATES_API_CALLED, STATES_FAILED, STATES_RECEIVED
} from '../actions/complaints'
import { TILE_MAP_STATES } from '../constants'

export const defaultState = {
  isLoading: false,
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
      issue: o.issue.buckets[0].key,
      product: o.product.buckets[0].key
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
    case STATES_API_CALLED:
      return {
        ...state,
        activeCall: action.url,
        isLoading: true
      }

    case STATES_RECEIVED: {
      const result = { ...state };

      const stateData = action.data.aggregations.state;
      const issueData = action.data.aggregations.issue;
      const productData = action.data.aggregations.product;

      result.isLoading = false
      result.state = processStateAggregations( stateData )
      result.issue = processAggregations( issueData )
      result.product = processAggregations( productData )

      return result;
    }

    case STATES_FAILED:
      return {
        ...defaultState,
        error: action.error,
        isLoading: false
      }

    default:
      return state
  }
}
