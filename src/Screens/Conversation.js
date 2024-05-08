import {StyleSheet, View} from 'react-native';
import React, {useState, useCallback} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useSelector} from 'react-redux';
import {guidGenerator} from '../Functions/messageIdGenerator';
import renderSend from '../Components/ChatComponents/RenderSend';
import renderActions from '../Components/ChatComponents/RenderActions';
import renderInputToolbar from '../Components/ChatComponents/RenderInputToolbar';
import RenderMessageVideo from '../Components/ChatComponents/RenderMessageVideo';
import useGetMessages from '../Hooks/useGetMessages';
import {onPressAction} from '../Functions/graphicsSelectFunction';

const Conversation = ({route}) => {
  const {uid, displayName} = auth().currentUser;
  const {user_id, user_name} = route.params;

  const data = useSelector(state => state.firestore);

  const [textInput, setTextInput] = useState('');
  const [typing, setTyping] = useState(false);

  useGetMessages(uid, user_id);

  const onSend = useCallback(async (msgs = []) => {
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
        text: msgs[0].text,
      })
      .then(msg => {
        console.log('Message sent!', msg);
        setTextInput('');
      });
    // if (messages.length == 1) {
    //   firestore()
    //     .collection('Conversations')
    //     .add({
    //       _id: guidGenerator(),
    //       party_ids: [uid, user_id],
    //       sender: {
    //         _id: uid,
    //         name: displayName,
    //         typing: false,
    //       },
    //       reciever: {
    //         _id: user_id,
    //         name: user_name,
    //         typing: false,
    //       },
    //     });
    // }
    // dispatch(setData(...data,))
  }, []);

  const checkTyping = () => {};

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={data?.data}
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
            setTextInput,
          )
        }
        isTyping={typing}
        renderActions={renderActions}
        renderSend={renderSend}
        renderMessageVideo={video => RenderMessageVideo(video)}
        renderInputToolbar={props =>
          renderInputToolbar(props, textInput, setTextInput, setTyping)
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
