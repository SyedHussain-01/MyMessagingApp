import {createSlice} from '@reduxjs/toolkit';

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    data: [],
    loading: false,
    error: false,
  },
  reducers: {
    // actions:
    setData(state, action) {
      state.data = action.payload;
    },
  },
});

export const {setData} = messageSlice.actions;
export default messageSlice.reducer;
