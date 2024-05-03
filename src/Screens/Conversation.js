import {StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {GiftedChat, InputToolbar} from 'react-native-gifted-chat';
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

  useEffect(() => {
    getMessages();
  }, []);

  const sendMessage = async msg => {
    try {
      console.log(msg);
      // const parse = await JSON.parse(msg.O);
      // console.log('msgin convo=> ', parse);
      // if (msg.length > 0 && msg[0].text) {
      //   const messageText = messages[0].text; // Extract text from the first message
      //   console.log(messageText); // Output the message text
      //   // Logic to send message
      // } else {
      //   console.error('Invalid message format'); // Log an error if the message format is invalid
      // }
      //   console.log(
      //     'data========>',
      //     msg[0],
      //     msg[0].text,
      //     msg[0].createdAt,
      //     uid,
      //     route.params.user_id,
      //   );
      //   await firestore()
      //     .collection('Messages')
      //     .add({
      //       text: msg[0].text,
      //       created_at: msg[0].createdAt,
      //       sender_id: uid,
      //       reciever_id: route.params.user_id,
      //     })
      //     .then(() => {
      //       console.log('message sent');
      //     })
      //     .catch(error => {
      //       console.log('err========> ', error);
      //     });
    } catch (error) {
      console.log(error);
    }
  };

  const getMessages = async () => {
    try {
      firestore()
        .collection('Messages')
        .get()
        .then(querySnapshot => {
          console.log('Total users: ', querySnapshot.size);

          querySnapshot.forEach(documentSnapshot => {
            const data = documentSnapshot.data();
            setMessages([
              ...messages,
              {
                _id: data.reciever_id,
                text: data.text,
                createdAt: new Date(),
                user: {
                  _id: data.sender_id,
                },
              },
            ]);
            console.log(
              'User ID: ',
              documentSnapshot.id,
              documentSnapshot.data(),
            );
          });
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={sendMessage}
      // onSend={msg => console.log({msg: msg[0]})}
      user={{
        _id: uid,
      }}
      // renderInputToolbar={props => <CustomInput {...props} />}
      renderInputToolbar={props => (
        <View>
          <InputToolbar
            {...props}
            renderSend={() => {
              return (
                <TouchableOpacity
                  style={styles.btnStyle}
                  onPress={() => sendMessage(props)}>
                  <Image source={SendIcon} style={styles.sendIcon} />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    />
  );
};

export default Conversation;

const styles = StyleSheet.create({
  btnStyle: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: wp(6),
    height: hp(3),
  },
});
