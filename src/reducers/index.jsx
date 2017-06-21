import { combineReducers } from 'redux'
import aggs from './aggs'
import query from './query'
import results from './results'

export default combineReducers({
    aggs,
    query,
    results
})