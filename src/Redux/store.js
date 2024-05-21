// store.js
import {configureStore} from '@reduxjs/toolkit';
import firestoreReducer from './firestoreSlice';
import conversationReducer from './conversationSlice';

const store = configureStore({
  reducer: {
    firestore: firestoreReducer,
    conversations: conversationReducer,
  },
});

export default store;
