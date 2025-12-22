import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  documentFilter: 'all',
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setDocumentFilter: (state, action) => {
      state.documentFilter = action.payload;
    },
    resetFilter: (state) => {
      state.documentFilter = 'all';
    },
  },
});

export const { setDocumentFilter, resetFilter } = filterSlice.actions;
export default filterSlice.reducer;