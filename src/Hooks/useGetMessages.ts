import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';

interface RecieverProps {
  _id: string;
  name: string;
}

interface SenderProps {
  _id: string;
  name: string;
}

interface DataProps {
  createdAt: any;
  _id: string;
  sender: SenderProps;
  reciever: RecieverProps;
  text: string;
  image: string;
  video: string;
}

interface ItemProps {
  _data: DataProps;
}

const useGetMessages = (
  uid: string,
  user_id: string,
  setMessages: Function,
) => {
  useEffect(() => {
    const subscriber = firestore()
      .collection('Messages')
      .where('party_ids', 'array-contains-any', [uid, user_id])
      .orderBy('createdAt', 'desc')
      .onSnapshot((documentSnapshot: any) => {
        let dataArr: any[] = [];
        documentSnapshot.docs.forEach((item: ItemProps) => {
          if (item._data.createdAt != null) {
            const dateObj = item._data.createdAt;
            const milliseconds = dateObj?.nanoseconds / 1e6;
            const date = new Date(dateObj?.seconds * 1000 + milliseconds);
            dataArr.push({
              _id: item._data._id,
              createdAt: date.toISOString(),
              user: {
                _id: item._data.sender._id,
                name: item._data.sender.name,
              },
              reciever: {
                _id: item._data.reciever._id,
                name: item._data.reciever.name,
              },
              ...(item._data.text == undefined
                ? {image: item._data.image, video: item._data.video}
                : {text: item._data.text}),
            });
          }
        });
        const filteredDataArr = dataArr.filter(
          item =>
            (item.user._id === uid && item.reciever._id === user_id) ||
            (item.user._id === user_id && item.reciever._id === uid),
        );
        setMessages(filteredDataArr);
      });
    return () => subscriber();
  }, []);
};

export default useGetMessages;
