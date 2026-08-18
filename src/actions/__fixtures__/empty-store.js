import { filtersState as filters } from '../../reducers/filters/filters-slice';
import { queryState as query } from '../../reducers/query/query-slice';
import { routesState as routes } from '../../reducers/routes/routes-slice';
import { viewState as view } from '../../reducers/view/view-slice';

export default Object.freeze({
  filters,
  query,
  routes,
  view,
});
