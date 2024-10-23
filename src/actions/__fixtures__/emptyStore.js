import { aggsState as aggs } from '../../reducers/aggs/aggsSlice';
import { detailState as detail } from '../../reducers/detail/detailSlice';
import { filtersState as filters } from '../../reducers/filters/filtersSlice';
import { mapState as map } from '../../reducers/map/mapSlice';
import { queryState as query } from '../../reducers/query/querySlice';
import { resultsState as results } from '../../reducers/results/resultsSlice';
import { routesState as routes } from '../../reducers/routes/routesSlice';
import { trendsState as trends } from '../../reducers/trends/trendsSlice';
import { viewState as view } from '../../reducers/view/viewSlice';

export default Object.freeze({
  aggs,
  detail,
  filters,
  map,
  query,
  results,
  routes,
  trends,
  view,
});
