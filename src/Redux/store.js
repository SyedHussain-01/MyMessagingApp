// store.js
import {configureStore} from '@reduxjs/toolkit';
import firestoreReducer from './firestoreSlice';

const store = configureStore({
  reducer: {
    firestore: firestoreReducer,
  },
});

export default store;
