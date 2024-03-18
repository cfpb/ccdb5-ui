import { createSlice } from '@reduxjs/toolkit';
import * as constants from '../../constants';

export const updateParams = (state, action) => {
  const { params, path } = action.payload;
  if (params.company) {
    params.sent_to = params.company;
    delete params.company;
  }

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
