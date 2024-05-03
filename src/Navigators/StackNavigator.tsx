import React, {useEffect, useState} from 'react';
import {Signup, Signin, UserList} from '../Screens';
import {createStackNavigator} from '@react-navigation/stack';
import Conversation from '../Screens/Conversation';
import auth from '@react-native-firebase/auth';

const StackNavigator = () => {
  const Stack = createStackNavigator();
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

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

  if (initializing) return null;

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
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
