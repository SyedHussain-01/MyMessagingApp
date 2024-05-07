import {
  StyleSheet,
  View,
  Image,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {
  GiftedChat,
  InputToolbar,
  Composer,
  Send,
} from 'react-native-gifted-chat';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import SendIcon from '../Assets/send.png';

const Conversation = ({route}) => {
  const {uid, displayName} = auth().currentUser;
  const {user_id, user_name} = route.params;

  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState('');

  useEffect(() => {
    const subscriber = getMessages();
    return () => subscriber;
  }, [user_id]);

  const getMessages = () => {
    let dataArr = [];
    const subscriber = firestore()
      .collection('Messages')
      .where('party_ids', "array-contains-any", [uid, user_id])
      .get()
      .then(documentSnapshot => {
        documentSnapshot.docs.forEach((item => {
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
            }
          })
        }))
        dataArr = dataArr.filter((item) => item.user._id === uid & item.reciever._id === user_id | item.user._id === user_id & item.reciever._id === uid )
        setMessages(dataArr);
      });

      return subscriber;
  }

  const onSend = useCallback(async (messages = []) => {
    firestore()
      .collection('Messages')
      .add({
        _id: messages[0]._id,
        text: messages[0].text,
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
      })
      .then(() => {
        console.log('Message sent!');
        setTextInput('');
      });
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  const renderSend = props => {
    return (
      <Send
        {...props}
        containerStyle={styles.iconContainerStyle}
        alwaysShowSend>
        <Image source={SendIcon} style={styles.iconStyle} />
      </Send>
    );
  };

  const renderInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputContainer}
        renderComposer={() => {
          return (
            <Composer
              textInputStyle={styles.inputStyle}
              onTextChanged={text => setTextInput(text)}
              text={textInput}
            />
          );
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        user={{
          _id: uid,
        }}
        text={textInput}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
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
  inputContainer: {
    color: 'black',
    width: '90%',
    marginLeft: wp(5),
    marginRight: wp(5),
    borderRadius: 24,
    borderTopColor: 'transparent',
  },
  inputStyle: {
    color: 'black',
    backgroundColor: 'transparent',
    padding: 5,
  },
  iconContainerStyle: {
    width: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStyle: {
    height: hp(3),
    width: wp(6),
  },
});
