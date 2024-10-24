// import queryManager from '../middleware/queryManager/queryManager';
// import synchUrl from '../middleware/synchUrl/synchUrl';
import aggReducer from '../reducers/aggs/aggsSlice';
import filtersReducer from '../reducers/filters/filtersSlice';
import mapReducer from '../reducers/map/mapSlice';
import queryReducer from '../reducers/query/querySlice';
import resultsReducer from '../reducers/results/resultsSlice';
import routesReducer from '../reducers/routes/routesSlice';
import trendsReducer from '../reducers/trends/trendsSlice';
import viewReducer from '../reducers/view/viewSlice';
import { configureStore } from '@reduxjs/toolkit';
// import { HTTP_GET_REQUEST } from '../actions/httpRequests/httpRequests';
// import httpRequestHandler from '../middleware/httpRequestHandler/httpRequestHandler';
import { complaintsApi } from '../api/complaints/complaints';
import { setupListeners } from '@reduxjs/toolkit/query';

export const store = configureStore({
  devTools: true,
  reducer: {
    [complaintsApi.reducerPath]: complaintsApi.reducer,
    aggs: aggReducer,
    filters: filtersReducer,
    map: mapReducer,
    query: queryReducer,
    results: resultsReducer,
    routes: routesReducer,
    trends: trendsReducer,
    view: viewReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      complaintsApi.middleware,
      // queryManager,
      // synchUrl,
      // httpRequestHandler,
    ),
});

setupListeners(store.dispatch);
