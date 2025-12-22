import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  visibleColumns: {
    donorId: true,
    registrationDate: true,
    donorName: true,
    nextAppointment: true,
    aadharNumber: true,
    consentForm: true,
    affidavit: true,
    bloodReport: true,
    insurance: true,
    opuProcess: true,
  },
};

const columnSlice = createSlice({
  name: 'column',
  initialState,
  reducers: {
    toggleColumn: (state, action) => {
      const column = action.payload;
      state.visibleColumns[column] = !state.visibleColumns[column];
    },
    setVisibleColumns: (state, action) => {
      state.visibleColumns = { ...state.visibleColumns, ...action.payload };
    },
    resetColumns: (state) => {
      state.visibleColumns = initialState.visibleColumns;
    },
  },
});

export const { toggleColumn, setVisibleColumns, resetColumns } = columnSlice.actions;
export default columnSlice.reducer;