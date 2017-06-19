import { combineReducers } from 'redux'
import query from './query'
import results from './results'

export default combineReducers({
    query,
    results
})