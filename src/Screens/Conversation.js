import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Text,
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
import CustomInput from '../Components/chatInput';
import SendIcon from '../Assets/send.png';

const Conversation = ({route}) => {
  const {uid} = auth().currentUser;

  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState('');

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 3,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 4,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 5,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setTextInput("")
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  const renderSend = props => {
    return (
      <Send {...props} containerStyle={styles.iconContainerStyle} alwaysShowSend >
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
              onTextChanged={(text)=>setTextInput(text)}
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
          _id: 1,
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
    justifyContent:'center',
    alignItems:'center'
  },
  iconStyle: {
    height: hp(3),
    width: wp(6),
  },
});
