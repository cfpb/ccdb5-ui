import { filtersState as filters } from '../../reducers/filters/filtersSlice';
import { queryState as query } from '../../reducers/query/querySlice';
import { routesState as routes } from '../../reducers/routes/routesSlice';
import { trendsState as trends } from '../../reducers/trends/trendsSlice';
import { viewState as view } from '../../reducers/view/viewSlice';

export default Object.freeze({
  filters,
  query,
  routes,
  trends,
  view,
});
