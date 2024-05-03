import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

const Conversation = () => {
  return (
    <View style={styles.Container}>
      <View style={styles.inputSpace}>
        <TextInput
          value=""
          onChangeText={() => {}}
          placeholder="Enter Message..."
          multiline
        />
        <TouchableOpacity onPressIn={() => {}} style={styles.BtnStyle}>
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Conversation;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  BtnStyle: {
    width: '20%',
    borderRadius: 24,
  },
  inputSpace: {
    flex: 1,
    flexDirection: 'column',
  },
});
