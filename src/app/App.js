import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, SafeAreaView, StatusBar, View} from 'react-native';
import Splash from './Splash';

import {
  ApolloProvider,
  // ElementsProvider,
  // KeyboardProvider,
  // OneSignalProvider,
  ReduxProvider,
  // SubscriptionProvider,
} from '../provider';
import AlertProvider from '../provider/AlertProvider';

console.disableYellowBox = true;
// heheheheheheh
import {createStackNavigator} from '@react-navigation/stack';
const Authenticated = createStackNavigator();
import ToktokMallScreens from './Nav/toktokmall';
import {NavigationContainer} from '@react-navigation/native';


const AuthenticatedStack = () => (
  <Authenticated.Navigator>
    
    {ToktokMallScreens({Navigator: Authenticated})}

  
  </Authenticated.Navigator>
);

const Nav = ({initialRoute}) => {
  return (
    <NavigationContainer>
      <AuthenticatedStack initialRoute={initialRoute} />
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <SafeAreaView style={styles.safeArea}>
        {/* <ReduxProvider> */}
          {/* <ApolloProvider> */}
            {/* <AlertProvider> */}
              <Nav />
            {/* </AlertProvider> */}
          {/* </ApolloProvider> */}
        {/* </ReduxProvider> */}
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
