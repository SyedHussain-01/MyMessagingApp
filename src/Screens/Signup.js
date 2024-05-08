import {Text, View, Image} from 'react-native';
import Input from '../Components/textInput';
import {authenticate} from '../Functions/auth';
import React, {useState} from 'react';
import {useNavigation, Link} from '@react-navigation/native';
import LoginImage from '../Assets/next.png';
import Button from '../Components/button';
import styles from '../Styles/authStyles';

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
          onChangeInputText={text => setState({...state, name: text})}
          autoCapitalize="none"
        />
        <Input
          placeholder="Email"
          value={state.email}
          onChangeInputText={text => setState({...state, email: text})}
          autoCapitalize="none"
        />
        <Input
          placeholder="Password"
          value={state.password}
          onChangeInputText={text => setState({...state, password: text})}
          autoCapitalize="none"
        />
        <Button text="Sign Up" action={() => handleSignup()} />
      </View>
      <View style={styles.footerStyle}>
        <Text style={styles.footerLeft}>Already Registered?</Text>
        <Link to={'/Login'} style={styles.footerRight}>
          Sign In To Your Account
        </Link>
      </View>
    </View>
  );
};

export default Signup;
