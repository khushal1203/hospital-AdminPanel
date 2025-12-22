import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/filterSlice';
import columnReducer from './slices/columnSlice';

export const store = configureStore({
  reducer: {
    filter: filterReducer,
    column: columnReducer,
  },
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;