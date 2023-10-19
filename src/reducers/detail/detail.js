
import {createSlice} from "@reduxjs/toolkit";

export const detailState = {
  activeCall: '',
  data: {},
  error: '',
};

export const detailSlice = createSlice({
  name: 'detail',
  initialState: detailState,
  reducers: {
    complaintDetailCalled(state, action){
      return {
        ...state,
        activeCall: action.url
      }
    },
    complaintDetailReceived(state, action){
      return {
        ...state,
        data: action.data.hits.hits[0]._source
      }
    },
    complaintDetailFailed(state, action){
      return {
        ...state,
        error: action.error
      }
    }
  }
})

export const { complaintDetailCalled, complaintDetailReceived, complaintDetailFailed } = detailSlice.actions;

export default detailSlice.reducer;

