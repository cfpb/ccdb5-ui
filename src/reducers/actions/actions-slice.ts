import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ActionsState {
  actions: unknown[];
}

export const actionsState: ActionsState = {
  actions: [],
};

export const actionsSlice = createSlice({
  name: 'actions',
  initialState: actionsState,
  reducers: {
    addAction: (state, action: PayloadAction<unknown>) => {
      state.actions.push(action.payload);
    },
    clearActions: (state) => {
      state.actions.length = 0;
    },
  },
});

export const { addAction, clearActions } = actionsSlice.actions;
export default actionsSlice.reducer;
