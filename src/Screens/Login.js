import {Text, View, Image} from 'react-native';
import Input from '../Components/textInput';
import {login} from '../Functions/auth';
import React, {useState} from 'react';
import {useNavigation, Link} from '@react-navigation/native';
import LoginImage from '../Assets/next.png';
import Button from '../Components/button';
import styles from '../Styles/authStyles';

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
      <View style={styles.loginHeaderSpace}>
        <Image source={LoginImage} style={styles.iconStyle} />
        <Text style={styles.loginHeaderText}>SIGN UP</Text>
      </View>
      <View style={styles.loginInputSpace}>
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
        <Button text="Login" action={handleSignin} />
      </View>
      <View style={styles.footerStyle}>
        <Text style={styles.footerLeft}>Not Registered?</Text>
        <Link to={'/Signup'} style={styles.footerRight}>
          Create Account
        </Link>
      </View>
    </View>
  );
};

export default Signin;
