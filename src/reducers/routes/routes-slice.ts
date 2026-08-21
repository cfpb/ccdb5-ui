import {
  createSlice,
  type PayloadAction,
  type SliceCaseReducers,
} from '@reduxjs/toolkit';
import { enforceValues } from '../../utils/reducers';
import queryString from 'query-string';
import type { RoutesState } from '../../types/root-state';

interface RouteParamsPayload {
  path: string;
  params: Record<string, unknown>;
}

export const updateParams = (
  state: RoutesState,
  action: PayloadAction<RouteParamsPayload>,
) => {
  const { params, path } = action.payload;
  state.path = path;
  state.params = params;
  state.queryString = queryString.stringify(params);
};

export const routesState: RoutesState = {
  // path has to be empty so that synchURL fires when the page loads through
  // useLocation / routes.js
  path: '',
  params: {},
  queryString: '',
};

export const routesSlice = createSlice({
  name: 'routes',
  initialState: routesState,
  reducers: {
    appUrlChanged: {
      reducer: updateParams,
      prepare: (path: string, params: Record<string, unknown>) => {
        return {
          payload: { path, params },
        };
      },
    },
    routeChanged: {
      reducer: updateParams,
      prepare: (path: string, params: Record<string, unknown>) => {
        if (params.size > 0 && Number(params.size) > 0) {
          // set up the size param so the query reducer can use a valid size
          params.size = enforceValues(String(params.size), 'size');
        }

        return {
          payload: {
            path,
            params,
          },
        };
      },
    },
  } satisfies SliceCaseReducers<RoutesState>,
});

export const { appUrlChanged, routeChanged } = routesSlice.actions;
export default routesSlice.reducer;
