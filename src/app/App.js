import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React from 'react';
import {MenuProvider as PopUpMenuProvider} from 'react-native-popup-menu';
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
      <PopUpMenuProvider>
        <ReduxProvider>
          <ApolloProvider>
            <AlertProvider>
              <PromptProvider>
                <Splash />
              </PromptProvider>
            </AlertProvider>
          </ApolloProvider>
        </ReduxProvider>
      </PopUpMenuProvider>
    </>
  );
};

export default App;
