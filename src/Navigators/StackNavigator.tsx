import React, {useState} from 'react';
import {Signup, Signin, UserList, Phonecall, Calling} from '../Screens';
import {useNavigationState, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Conversation from '../Screens/Conversation';
import {Image, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SignoutIcon from '../Assets/arrow.png';
import CallIcon from '../Assets/telephone.png';
import useAuth from '../Hooks/useAuth';
import {signOut} from '../Functions/auth';

const StackNavigator = () => {
  const Stack = createStackNavigator();
  const navigation: any = useNavigation();
  const routeState = useNavigationState(state => state?.routeNames);
  const currentRouteIndex = useNavigationState(state => state?.index);
  const currentRouteName = currentRouteIndex
    ? routeState[currentRouteIndex]
    : 'Chat';
  const [user, setUser] = useState(null);

  useAuth(setUser);

  const phoneCall = () => {
    navigation.navigate('Phonecall');
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: user ? true : false,
        headerRight: () => (
          <TouchableOpacity
            onPress={currentRouteName !== 'Chat' ? phoneCall : signOut}
            style={{marginRight: wp(3)}}>
            {currentRouteName !== 'Chat' ? (
              <Image
                source={CallIcon}
                style={{height: hp(3.5), width: wp(9), resizeMode: 'contain'}}
              />
            ) : (
              <Image
                source={SignoutIcon}
                style={{height: hp(3.5), width: wp(9), resizeMode: 'contain'}}
              />
            )}
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
          {/* <Stack.Screen name="Phonecall" component={Phonecall} /> */}
          <Stack.Screen name="Phonecall" component={Calling} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
