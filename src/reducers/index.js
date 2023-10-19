import aggReducer  from './aggs/aggs';
import detailReducer from './detail/detail';
import mapReducer from './map/map';
import queryReducer from './query/query';
import resultsReducer from './results/results';
import trendsReducer from './trends/trends';
import viewReducer from './view/view';

import { configureStore } from "@reduxjs/toolkit";


export default configureStore({
  reducer: {
    aggregations: aggReducer,
    detail: detailReducer,
    map: mapReducer,
    query: queryReducer,
    results: resultsReducer,
    trends: trendsReducer,
    view: viewReducer
  }

})
