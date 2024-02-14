import { createSlice } from '@reduxjs/toolkit';

export const detailState = {
  activeCall: '',
  data: {},
  error: '',
};

export const detailSlice = createSlice({
  name: 'detail',
  initialState: detailState,
  reducers: {
    complaintDetailCalled(state, action) {
      state.activeCall = action.payload;
    },
    complaintDetailReceived(state, action) {
      state.data = action.payload.hits.hits[0]._source;
      state.activeCall = '';
    },
    complaintDetailFailed(state, action) {
      state.error = action.payload.error;
      state.activeCall = '';
    },
  },
});

export const {
  complaintDetailCalled,
  complaintDetailReceived,
  complaintDetailFailed,
} = detailSlice.actions;

export default detailSlice.reducer;
