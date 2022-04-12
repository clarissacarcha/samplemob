import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar, LogBox} from 'react-native';
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

LogBox.ignoreAllLogs();

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
