import filtersReducer from '../reducers/filters/filters-slice';
import queryReducer from '../reducers/query/query-slice';
import routesReducer from '../reducers/routes/routes-slice';
import viewReducer from '../reducers/view/view-slice';
import { configureStore } from '@reduxjs/toolkit';
import { complaintsApi } from '../api/complaints';
import { setupListeners } from '@reduxjs/toolkit/query';
import synchUrl from '../middleware/synch-url/synch-url';

export const store = configureStore({
  devTools: true,
  reducer: {
    [complaintsApi.reducerPath]: complaintsApi.reducer,
    filters: filtersReducer,
    query: queryReducer,
    routes: routesReducer,
    view: viewReducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    synchUrl,
    complaintsApi.middleware,
  ],
});

setupListeners(store.dispatch);
