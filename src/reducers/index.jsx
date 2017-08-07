import aggs from './aggs'
import { combineReducers } from 'redux'
import detail from './detail'
import modal from './modal'
import query from './query'
import results from './results'

export default combineReducers( {
  aggs,
  detail,
  modal,
  query,
  results
} )
