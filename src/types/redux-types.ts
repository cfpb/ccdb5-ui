/**
 * Redux-related shared types used by remaining JS middleware and thunks.
 */

export type PlainAction = {
  type: string;
  payload?: unknown;
  error?: unknown;
  meta?: unknown;
} & Record<string, unknown>;

export type GetState = () => unknown;

export type Thunk = (dispatch: Dispatch, getState: GetState) => unknown;

export type Dispatch = (action: PlainAction | Thunk) => unknown;

export type Next = (action: PlainAction) => unknown;

export interface Store {
  dispatch: Dispatch;
  getState: GetState;
}
