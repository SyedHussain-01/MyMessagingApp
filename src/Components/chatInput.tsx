import React, {useState} from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SendIcon from '../Assets/send.png';

const CustomInput: React.FC<any> = ({onSend}) => {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    console.log('msg=> ', message);
    onSend(message);
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainerStyle}>
        <TextInput
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
          multiline
        />
      </View>
      <TouchableOpacity onPress={sendMessage} style={styles.btnStyle}>
        <Image source={SendIcon} style={styles.sendIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: wp(8),
    bottom: wp(3),
    alignItems: 'center',
  },
  inputContainerStyle: {
    flex: 2,
    paddingHorizontal: wp(4),
    marginTop: hp(1),
    borderRadius: wp(12),
  },
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

export default CustomInput;
