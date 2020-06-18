import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import Landing from './Landing';

import {
  ApolloProvider,
  // ElementsProvider,
  // KeyboardProvider,
  // OneSignalProvider,
  ReduxProvider,
  // SubscriptionProvider,
} from '../provider';

console.disableYellowBox = true;

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <ReduxProvider>
          <ApolloProvider>
            <Landing />
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
