// features/currentUrl/urlSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const urlSlice = createSlice({
  name: 'currentUrl',
  initialState: '',
  reducers: {
    setCurrentUrl: (state, action) => {
      return action.payload;
    },
  },
});

export const { setCurrentUrl } = urlSlice.actions;

export default urlSlice.reducer;
