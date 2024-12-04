import { TILE_MAP_STATES } from '../constants';

export const processStateAggregations = (agg) => {
  const states = Object.values(agg.state.buckets)
    .filter((val) => TILE_MAP_STATES.includes(val.key))
    .map((val) => ({
      name: val.key,
      value: val.doc_count,
      issue: val.issue.buckets[0].key,
      product: val.product.buckets[0].key,
    }));

  const stateNames = states.map((state) => state.name);

  // patch any missing data
  if (stateNames.length > 0) {
    TILE_MAP_STATES.forEach((state) => {
      if (!stateNames.includes(state)) {
        states.push({ name: state, value: 0, issue: '', product: '' });
      }
    });
  }
  return states;
};
