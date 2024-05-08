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

const StackNavigator = () => {
  const Stack = createStackNavigator();
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  // Handle user state changes
  function onAuthStateChanged(myuser: any) {
    setUser(myuser);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
    //eslinst-disable-next-line
  }, []);

  const signOut = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('successfully signed out');
      });
  };

  if (initializing) return null;

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
