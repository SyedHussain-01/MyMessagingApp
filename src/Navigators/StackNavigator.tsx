import React, {useEffect, useState} from 'react';
import {Signup, Signin, UserList} from '../Screens';
import {createStackNavigator} from '@react-navigation/stack';
import Conversation from '../Screens/Conversation';
import auth from '@react-native-firebase/auth';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SignoutIcon from '../Assets/arrow.png';
import useAuth from '../Hooks/useAuth';
import { signOut } from '../Functions/auth';

const StackNavigator = () => {
  const Stack = createStackNavigator();
  const [user, setUser] = useState(null);

  useAuth(setUser);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: user ? true : false,
        headerRight: () => (
          <TouchableOpacity onPress={signOut} style={{marginRight: wp(3)}}>
            <Image
              source={SignoutIcon}
              style={{height: hp(3.5), width: wp(9), resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        ),
      }}>
      {!user ? (
        <>
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Login" component={Signin} />
        </>
      ) : (
        <>
          <Stack.Screen name="Chat" component={UserList} />
          <Stack.Screen name="Conversation" component={Conversation} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
