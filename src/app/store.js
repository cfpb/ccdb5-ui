import queryManager from '../middleware/queryManager/queryManager';
import synchUrl from '../middleware/synchUrl/synchUrl';
import aggReducer from '../reducers/aggs/aggsSlice';
import detailReducer from '../reducers/detail/detail';
import mapReducer from '../reducers/map/map';
import queryReducer from '../reducers/query/query';
import resultsReducer from '../reducers/results/results';
import trendsReducer from '../reducers/trends/trends';
import viewReducer from '../reducers/view/view';
import { configureStore } from '@reduxjs/toolkit';

export default configureStore({
  devTools: true,
  reducer: {
    aggs: aggReducer,
    detail: detailReducer,
    map: mapReducer,
    query: queryReducer,
    results: resultsReducer,
    trends: trendsReducer,
    view: viewReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        // placeholder in case we want to add httpRequestHandlers
        ignoredActions: [],
      },
    }).concat([queryManager, synchUrl]),
});
