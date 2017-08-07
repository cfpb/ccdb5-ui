import { COMPLAINTS_RECEIVED } from '../constants'

export const defaultAggs = {
  company: [],
  company_public_response: [],
  company_response: [],
  consumer_consent_provided: [],
  consumer_disputed: [],
  issue: [],
  product: [],
  state: [],
  submitted_via: [],
  tag: [],
  timely: [],
  zip_code: []
}

export default ( state = defaultAggs, action ) => {
  switch ( action.type ) {
    case COMPLAINTS_RECEIVED: {
      const aggs = action.data.aggregations
      const keys = Object.keys( aggs )
      const result = { ...state }

      keys.forEach( key => {
        result[key] = aggs[key][key].buckets
      } )

      return result
    }

    default:
      return state
  }
}
