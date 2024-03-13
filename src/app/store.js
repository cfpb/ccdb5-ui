import queryManager from '../middleware/queryManager/queryManager';
import synchUrl from '../middleware/synchUrl/synchUrl';
import aggReducer from '../reducers/aggs/aggsSlice';
import detailReducer from '../reducers/detail/detailSlice';
import filtersReducer from '../reducers/filters/filtersSlice';
import mapReducer from '../reducers/map/mapSlice';
import queryReducer from '../reducers/query/querySlice';
import resultsReducer from '../reducers/results/resultsSlice';
import routesReducer from '../reducers/routes/routesSlice';
import trendsReducer from '../reducers/trends/trendsSlice';
import viewReducer from '../reducers/view/viewSlice';
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
