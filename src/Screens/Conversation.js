import {StyleSheet, View, Image} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {
  GiftedChat,
  InputToolbar,
  Composer,
  Send,
  Actions,
} from 'react-native-gifted-chat';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import SendIcon from '../Assets/send.png';
import {useSelector, useDispatch} from 'react-redux';
import {launchImageLibrary} from 'react-native-image-picker';
import uploadFile from '../Functions/fileUploader';
import {setData} from '../Redux/firestoreSlice';
import {guidGenerator} from '../Functions/messageIdGenerator';

const Conversation = ({route}) => {
  const {uid, displayName} = auth().currentUser;
  const {user_id, user_name} = route.params;
  const [image, setImage] = useState('');
  const dispatch = useDispatch();
  const data = useSelector(state => state.firestore);

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
      .where('party_ids', 'array-contains-any', [uid, user_id])
      .get()
      .then(documentSnapshot => {
        documentSnapshot.docs.forEach(item => {
          const dateObj = item._data.createdAt;
          const milliseconds = dateObj.nanoseconds / 1e6;
          const date = new Date(dateObj.seconds * 1000 + milliseconds);
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
            // text: item._data.text,
            // image: item._data.image,
            ...(item._data.text == undefined
              ? {image: item._data.image}
              : {text: item._data.text}),
          });
        });
        dataArr = dataArr.filter(
          item =>
            ((item.user._id === uid) & (item.reciever._id === user_id)) |
            ((item.user._id === user_id) & (item.reciever._id === uid)),
        );
        setMessages(dataArr);
        // dispatch(setData(dataArr));
      });

    return subscriber;
  };

  const onSend = useCallback(async (messages = [], imageStatus) => {
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
        // text: !imageStatus ? messages[0].text : '',
        // ...(!imageStatus ? {image: image} : {text: messages[0].text}),
      })
      .then(msg => {
        console.log('Message sent!', msg);
        setTextInput('');
      });
    // dispatch(setData(...data,))
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

  const renderActions = props => {
    return (
      <Actions {...props} containerStyle={styles.iconContainerStyle}>
        <Image source={SendIcon} style={styles.iconStyle} />
      </Actions>
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

  const onPressAction = async () => {
    try {
      const result = await launchImageLibrary();
      const fileUpload = await uploadFile(result.assets[0].uri);
      const msgId = guidGenerator();
      const msgObj = {
        _id: msgId,
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
        image: fileUpload,
      };
      firestore()
        .collection('Messages')
        .add(msgObj)
        .then(msg => {
          setMessages([
            ...messages,
            {
              _id: msgId,
              createdAt: new Date(),
              user: {
                _id: uid,
                name: displayName,
              },
              reciever: {
                _id: user_id,
                name: user_name,
              },
              image: fileUpload,
            },
          ]);
          setTextInput('');
        });
      setImage(fileUpload);
    } catch (error) {
      console.log('outtttttt', error);
    }
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        // messages={data?.data}
        user={{
          _id: uid,
        }}
        text={textInput}
        onPressActionButton={onPressAction}
        renderActions={renderActions}
        renderSend={renderSend}
        renderInputToolbar={renderInputToolbar}
        onSend={messages =>
          image != '' ? onSend(messages, false) : onSend(messages, true)
        }
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
    flexDirection: 'row',
  },
  iconStyle: {
    height: hp(3),
    width: wp(6),
  },
});
