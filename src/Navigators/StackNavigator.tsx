import React from 'react';
import {Signup, Signin, ChatScreen} from '../Screens';
import {createStackNavigator} from '@react-navigation/stack';
import Conversation from '../Screens/Conversation';
// import auth from '@react-native-firebase/auth';

const StackNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Login" component={Signin} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Conversation" component={Conversation} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
