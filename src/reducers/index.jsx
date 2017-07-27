import { combineReducers } from 'redux'
import aggs from './aggs'
import modal from './modal'
import query from './query'
import results from './results'

export default combineReducers({
    aggs,
    modal,
    query,
    results
})
