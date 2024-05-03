import {StyleSheet, Text, View, TextInput, Button} from 'react-native';
import {login} from '../Functions/auth';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

const Signin = () => {
  const navigation = useNavigation();
  const [state, setState] = useState({
    email: '',
    password: '',
  });

  const handleSignin = async () => {
    const {email, password} = state;
    try {
      const user = await login(email, password);
      setState({
        email: '',
        password: '',
      });
      console.log('user=> ', user);
      if (user === true) {
        navigation.navigate('Chat');
      } else {
        console.log('User Not Found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Email</Text>
      <TextInput
        placeholder="Enter your email"
        value={state.email}
        onChangeText={text => setState({...state, email: text})}
        style={styles.inputStyle}
      />
      <Text>Password</Text>
      <TextInput
        placeholder="Enter your password"
        value={state.password}
        onChangeText={text => setState({...state, password: text})}
        style={styles.inputStyle}
      />
      <Button
        onPress={handleSignin}
        title="Signin"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </View>
  );
};

export default Signin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputStyle: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 12,
  },
});
