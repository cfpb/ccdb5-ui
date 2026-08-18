import filtersReducer from '../reducers/filters/filters-slice';
import queryReducer from '../reducers/query/query-slice';
import routesReducer from '../reducers/routes/routes-slice';
import viewReducer from '../reducers/view/view-slice';
import { configureStore, type Middleware } from '@reduxjs/toolkit';
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
  middleware: (getDefaultMiddleware) =>
    // concat keeps RTK's middleware Tuple; spreading becomes a plain array.
    // eslint-disable-next-line unicorn/prefer-spread -- RTK middleware typing
    getDefaultMiddleware().concat(
      synchUrl as Middleware,
      complaintsApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type { RootState } from '../types/root-state';
export type AppDispatch = typeof store.dispatch;
