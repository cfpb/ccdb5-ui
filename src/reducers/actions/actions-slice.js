import { createSlice } from '@reduxjs/toolkit';

export const actionsState = {
  actions: [],
};

export const actionsSlice = createSlice({
  name: 'actions',
  initialState: actionsState,
  reducers: {
    addAction: (state, action) => {
      state.actions.push(action.payload);
    },
    clearActions: (state) => {
      state.actions.length = 0;
    },
  },
});

export const { addAction, clearActions } = actionsSlice.actions;
export default actionsSlice.reducer;
