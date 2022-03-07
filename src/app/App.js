import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, StatusBar, View} from 'react-native';
import Splash from './Splash';

import {
  ApolloProvider,
  PromptProvider,
  // ElementsProvider,
  // KeyboardProvider,
  // OneSignalProvider,
  ReduxProvider,
  // SubscriptionProvider,
} from '../provider';
import AlertProvider from '../provider/AlertProvider';

console.disableYellowBox = true;

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <ReduxProvider>
        <ApolloProvider>
          <AlertProvider>
            <PromptProvider>
              <Splash />
            </PromptProvider>
          </AlertProvider>
        </ApolloProvider>
      </ReduxProvider>
    </>
  );
};

export default App;
