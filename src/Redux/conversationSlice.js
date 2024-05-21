import {createSlice} from '@reduxjs/toolkit';

const conversationSlice = createSlice({
  name: 'conversations',
  initialState: {
    conversation_data: [],
    loading: false,
    error: false,
  },
  reducers: {
    // actions:
    setConversationData(state, action) {
      state.conversation_data = action.payload;
    },
  },
});

export const {setConversationData} = conversationSlice.actions;
export default conversationSlice.reducer;
