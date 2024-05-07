// features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, setLoading, setError } = authSlice.actions;

// Thunks
export const createUserWithEmailAndPassword = (email, password) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    dispatch(setUser(userCredential.user));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

export const signInWithEmailAndPassword = (email, password) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    dispatch(setUser(userCredential.user));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

export default authSlice.reducer;
