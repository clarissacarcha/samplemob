import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import React from 'react';
import {StatusBar, LogBox} from 'react-native';
import Splash from './Splash';
import { MenuProvider } from 'react-native-popup-menu';
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
              <MenuProvider>
                <Splash />
              </MenuProvider>
            </PromptProvider>
          </AlertProvider>
        </ApolloProvider>
      </ReduxProvider>
    </>
  );
};

export default App;
