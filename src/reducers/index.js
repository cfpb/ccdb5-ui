import aggs from './aggs/aggs';
import { combineReducers } from 'redux';
import detail from './detail/detail';
import map from './map/map';
import query from './query/query';
import results from './results/results';
import trends from './trends/trends';
import view from './view/view';

export default combineReducers({
  aggs,
  detail,
  map,
  query,
  results,
  trends,
  view,
});
