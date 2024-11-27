import filtersReducer from '../reducers/filters/filtersSlice';
import queryReducer from '../reducers/query/querySlice';
import routesReducer from '../reducers/routes/routesSlice';
import trendsReducer from '../reducers/trends/trendsSlice';
import viewReducer from '../reducers/view/viewSlice';
import { configureStore } from '@reduxjs/toolkit';
import { complaintsApi } from '../api/complaints';
import { setupListeners } from '@reduxjs/toolkit/query';
import synchUrl from '../middleware/synchUrl/synchUrl';

export const store = configureStore({
  devTools: true,
  reducer: {
    [complaintsApi.reducerPath]: complaintsApi.reducer,
    filters: filtersReducer,
    query: queryReducer,
    routes: routesReducer,
    trends: trendsReducer,
    view: viewReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([synchUrl, complaintsApi.middleware]),
});

setupListeners(store.dispatch);
