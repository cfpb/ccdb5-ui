import { createSlice } from '@reduxjs/toolkit';
import * as constants from '../../constants';
import { enforceValues } from '../../utils/reducers';

export const updateParams = (state, action) => {
  const { params, path } = action.payload;
  state.path = path;
  state.params = params;
};

export const routesState = {
  // path has to be empty so that synchURL fires when the page loads through
  // useLocation / routes.js
  path: '',
  params: {},
};

export const routesSlice = createSlice({
  name: 'routes',
  initialState: routesState,
  reducers: {
    appUrlChanged: {
      reducer: updateParams,
      prepare: (path, params) => {
        return {
          payload: { path, params },
        };
      },
    },
    routeChanged: {
      reducer: updateParams,
      prepare: (path, params) => {
        if (params.size) {
          // set up the size param so the query reducer can use a valid size
          params.size = enforceValues(params.size.toString(), 'size');
        }

        return {
          payload: {
            path,
            params,
          },
          meta: {
            persist: constants.PERSIST_LOAD,
            requery: constants.REQUERY_ALWAYS,
          },
        };
      },
    },
  },
});

export const { appUrlChanged, routeChanged } = routesSlice.actions;
export default routesSlice.reducer;
