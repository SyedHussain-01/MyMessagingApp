import React, {useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {setConversationData} from '../Redux/conversationSlice';

const useGetConversations = () => {
  const dispatch = useDispatch();
  // const data = useSelector((state: any) => state.firestore);
  useEffect(() => {
    let dataArr: any[] = [];
    const subscriber = firestore()
      .collection('Conversations')
      .onSnapshot((documentSnapshot: any) => {
        documentSnapshot.docs.forEach((item: any) => {
          console.log('item++==========> ', item);
          console.log('data arrr++==========> ', dataArr);
          dataArr.push({
            _id: item._data._id,
            reciever_id: item._data.reciever._id,
            reciever_name: item._data.reciever.name,
            reciever_typing: item._data.reciever.typing,
            sender_id: item._data.sender._id,
            sender_name: item._data.sender.name,
            sender_typing: item._data.sender.typing,
          });
        });
        dispatch(setConversationData(dataArr));
      });
    return () => {
      subscriber();
      dispatch(setConversationData([]));
    };
  }, []);
};

export default useGetConversations;
