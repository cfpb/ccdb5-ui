import { createSlice } from '@reduxjs/toolkit';
import { enforceValues } from '../../utils/reducers';
import queryString from 'query-string';

export const updateParams = (state, action) => {
  const { params, path } = action.payload;
  state.path = path;
  state.params = params;
  state.queryString = queryString.stringify(params);
};

export const routesState = {
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
        };
      },
    },
  },
});

export const { appUrlChanged, routeChanged } = routesSlice.actions;
export default routesSlice.reducer;
