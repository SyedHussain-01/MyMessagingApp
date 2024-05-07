// features/firestore/firestoreSlice.js
import {createSlice} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

const firestoreSlice = createSlice({
  name: 'firestore',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {setData, setLoading, setError} = firestoreSlice.actions;

// Thunks
export const addDocument = (collectionName, data) => async dispatch => {
  try {
    dispatch(setLoading(true));
    await firestore().collection(collectionName).add(data);
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

export const getDocuments = collectionName => async dispatch => {
  try {
    dispatch(setLoading(true));
    const subscriber = firestore()
      .collection(collectionName)
      .where('party_ids', 'array-contains-any', [uid, user_id])
      .get()
      .then(documentSnapshot => {
        documentSnapshot.docs.forEach(item => {
          const dateObj = item._data.createdAt;
          const milliseconds = dateObj.nanoseconds / 1e6;
          const date = new Date(dateObj.seconds * 1000 + milliseconds);
          dataArr.push({
            _id: item._data._id,
            text: item._data.text,
            createdAt: date,
            user: {
              _id: item._data.sender._id,
              name: item._data.sender.name,
            },
            reciever: {
              _id: item._data.reciever._id,
              name: item._data.reciever.name,
            },
          });
        });
        dataArr = dataArr.filter(
          item =>
            ((item.user._id === uid) & (item.reciever._id === user_id)) |
            ((item.user._id === user_id) & (item.reciever._id === uid)),
        );
        setMessages(dataArr);
      });
    dispatch(setData(subscriber));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};

export default firestoreSlice.reducer;
