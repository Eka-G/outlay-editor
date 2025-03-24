import { OutlayAllRowsResponse, OutlayRowWithParentId } from '@/shared/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type OutlayState = {
  rows: OutlayAllRowsResponse;
};

const initialState: OutlayState = {
  rows: [],
};

const outlaySlice = createSlice({
  name: 'outlay',
  initialState,
  reducers: {
    setRows(state, action: PayloadAction<OutlayAllRowsResponse>) {
      state.rows = action.payload;
    },
  },
});

export const { setRows } = outlaySlice.actions;
export default outlaySlice.reducer;
