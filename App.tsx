/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './src/Navigators/StackNavigator';
import {Provider} from 'react-redux';
import store from './src/Redux/store';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
