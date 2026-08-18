import type { RootState, RoutesState } from '../../types/root-state';

export const selectRoutesParams = (state: RootState): RoutesState['params'] =>
  state.routes.params;
export const selectRoutesQueryString = (state: RootState): string =>
  state.routes.queryString;
