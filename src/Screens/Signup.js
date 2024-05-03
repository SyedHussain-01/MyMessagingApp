import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import Input from '../Components/textInput';
import {authenticate} from '../Functions/auth';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import LoginImage from '../Assets/next.png';
import Button from '../Components/button';

const Signup = () => {
  const navigation = useNavigation();
  const [state, setState] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSignup = async () => {
    const {email, password, name} = state;
    try {
      await authenticate(email, password, name);
      setState({
        name: '',
        email: '',
        password: '',
      });
      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignin = async () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginHeaderSpace}>
        <Image source={LoginImage} style={styles.iconStyle} />
        <Text style={styles.loginHeaderText}>SIGN UP</Text>
      </View>
      <View style={styles.loginInputSpace}>
        <Input
          placeholder="Name"
          value={state.name}
          onChange={text => setState({...state, name: text})}
        />
        <Input
          placeholder="Email"
          value={state.email}
          onChange={text => setState({...state, email: text})}
        />
        <Input
          placeholder="Password"
          value={state.password}
          onChange={text => setState({...state, password: text})}
        />
        <Button text="Sign Up" />
      </View>
      <View style={styles.footerStyle}>
        <Text>oqiw</Text>
      </View>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
  },
  loginHeaderSpace: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 15,
  },
  loginInputSpace: {
    flex: 3,
    alignItems: 'center',
    gap: 20,
  },
  iconStyle: {
    width: '30%',
    height: '30%',
  },
  loginHeaderText: {
    fontSize: 25,
    fontWeight: '500',
    padding: 5,
  },
  footerStyle: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
});
