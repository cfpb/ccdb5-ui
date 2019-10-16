import { COMPLAINTS_RECEIVED, TILE_MAP_STATES } from '../constants'

/* eslint-disable camelcase */

export const defaultState = {
  issues: [],
  products: [],
  states: []
}

/* eslint-enable camelcase */

export default ( state = defaultState, action ) => {
  switch ( action.type ) {
    case COMPLAINTS_RECEIVED: {
      const result = { ...state };

      // only need state
      const stateData = action.data.aggregations.state;
      // doc count = stateData.doc_count

      const states = Object.values( stateData.state.buckets )
        .filter( o => TILE_MAP_STATES.includes( o.key ) )
        .map( o => ( { name: o.key, value: o.doc_count } ) );

      const stateNames = states.map( o => o.name );

      // patch any missing data
      if ( stateNames.length > 0 ) {
        TILE_MAP_STATES.forEach( o => {
          if ( !stateNames.includes( o ) ) {
            states.push( { name: o, value: 0 } );
          }
        } );
        result.states = states;
      }

      return result;
    }

    default:
      return state
  }
}
