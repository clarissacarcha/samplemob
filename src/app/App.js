import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, SafeAreaView, StatusBar, View} from 'react-native';
import Splash from './Splash';

import {
  ApolloProvider,
  // ElementsProvider,
  // KeyboardProvider,
  // OneSignalProvider,
  PromptProvider,
  ReduxProvider,
  // SubscriptionProvider,
} from '../provider';
import AlertProvider from '../provider/AlertProvider';

console.disableYellowBox = true;

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <SafeAreaView style={styles.safeArea}>
        <ReduxProvider>
          <ApolloProvider>
            <AlertProvider>
              <PromptProvider>
                  <Splash />
              </PromptProvider>
            </AlertProvider>
          </ApolloProvider>
        </ReduxProvider>
      </SafeAreaView>
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
