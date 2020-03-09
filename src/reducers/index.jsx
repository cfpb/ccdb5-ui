import aggs from './aggs'
import { combineReducers } from 'redux'
import detail from './detail'
import map from './map'
import modal from './modal'
import query from './query'
import results from './results'
import view from './view'

export default combineReducers( {
  aggs,
  detail,
  map,
  modal,
  query,
  results,
  view
} )
