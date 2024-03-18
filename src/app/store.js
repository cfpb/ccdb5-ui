import queryManager from '../middleware/queryManager/queryManager';
import synchUrl from '../middleware/synchUrl/synchUrl';
import aggReducer from '../reducers/aggs/aggs';
import detailReducer from '../reducers/detail/detail';
import filtersReducer from '../reducers/filters/filtersSlice';
import mapReducer from '../reducers/map/map';
import queryReducer from '../reducers/query/query';
import resultsReducer from '../reducers/results/results';
import routesReducer from '../reducers/routes/routesSlice';
import trendsReducer from '../reducers/trends/trends';
import viewReducer from '../reducers/view/view';
import { configureStore } from '@reduxjs/toolkit';

export default configureStore({
  devTools: true,
  reducer: {
    aggs: aggReducer,
    detail: detailReducer,
    filters: filtersReducer,
    map: mapReducer,
    query: queryReducer,
    results: resultsReducer,
    routes: routesReducer,
    trends: trendsReducer,
    view: viewReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([queryManager, synchUrl]),
});
