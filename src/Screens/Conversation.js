import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useSelector, useDispatch} from 'react-redux';
import {launchImageLibrary} from 'react-native-image-picker';
import uploadFile from '../Functions/fileUploader';
import {setData} from '../Redux/firestoreSlice';
import {guidGenerator} from '../Functions/messageIdGenerator';
import {getMessages} from '../Functions/getMessages';
import renderSend from '../Components/ChatComponents/RenderSend';
import renderActions from '../Components/ChatComponents/RenderActions';
import renderInputToolbar from '../Components/ChatComponents/RenderInputToolbar';
import RenderMessageVideo from '../Components/ChatComponents/RenderMessageVideo';
import useGetMessages from '../Hooks/useGetMessages';
import {onPressAction} from '../Functions/graphicsSelectFunction';

const Conversation = ({route}) => {
  const {uid, displayName} = auth().currentUser;
  const {user_id, user_name} = route.params;

  const dispatch = useDispatch();
  const data = useSelector(state => state.firestore);

  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState('');

  useGetMessages(uid, user_id, setMessages);

  const onSend = useCallback(async (messages = []) => {
    firestore()
      .collection('Messages')
      .add({
        _id: guidGenerator(),
        createdAt: firestore.FieldValue.serverTimestamp(),
        party_ids: [uid, user_id],
        sender: {
          _id: uid,
          name: displayName,
        },
        reciever: {
          _id: user_id,
          name: user_name,
        },
        text: messages[0].text,
      })
      .then(msg => {
        console.log('Message sent!', msg);
        setTextInput('');
      });
    // dispatch(setData(...data,))
  }, []);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        // messages={data?.data}
        user={{
          _id: uid,
        }}
        text={textInput}
        onPressActionButton={() =>
          onPressAction(
            uid,
            displayName,
            user_id,
            user_name,
            setMessages,
            messages,
            setTextInput,
          )
        }
        renderActions={renderActions}
        renderSend={renderSend}
        renderMessageVideo={video => RenderMessageVideo(video)}
        renderInputToolbar={props =>
          renderInputToolbar(props, textInput, setTextInput)
        }
        onSend={messages => onSend(messages)}
      />
    </View>
  );
};

export default Conversation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
});
