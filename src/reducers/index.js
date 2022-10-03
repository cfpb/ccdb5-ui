import aggs from './aggs/aggs';
import { combineReducers } from 'redux';
import detail from './detail';
import map from './map';
import modal from './modal';
import query from './query/query';
import results from './results/results';
import trends from './trends';
import view from './view/view';

export default combineReducers({
  aggs,
  detail,
  map,
  modal,
  query,
  results,
  trends,
  view,
});
