import { defaultAggs as aggs } from '../../reducers/aggs/aggs';
import { defaultDetail as detail } from '../../reducers/detail/detail';
import { defaultMap as map } from '../../reducers/map/map';
import { defaultQuery as query } from '../../reducers/query/query';
import { defaultTrends as trends } from '../../reducers/trends/trends';
import { defaultResults as results } from '../../reducers/results/results';
import { defaultView as view } from '../../reducers/view/view';

export default Object.freeze({
  aggs,
  detail,
  map,
  query,
  results,
  trends,
  view,
});
