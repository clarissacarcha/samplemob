import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {useLazyQuery} from '@apollo/react-hooks';
// import {BarIndicator} from 'react-native-indicators';
// import OneSignal from 'react-native-onesignal';
import {APP_FLAVOR} from '../res/constants';
import {GET_USER_SESSION} from '../graphql';

import SplashImage from '../assets/images/Splash.png';

import Nav from './Nav';

const mapKeyValueToObject = keyValueArray => {
  const result = {};
  keyValueArray.map(kv => {
    result[kv.key] = kv.value;
  });
  return result;
};

const Splash = ({createSession, destroySession, setConstants, navigation}) => {
  // destroySession();
  // AsyncStorage.removeItem('userId');

  const [getLanded, setLanded] = useState(false); // state to trigger if should switch
  const [initialRoute, setInitialRoute] = useState('UnauthenticatedStack');

  const [getUserSession] = useLazyQuery(GET_USER_SESSION, {
    fetchPolicy: 'network-only',
    onError: e => {
      alert(e);
    },
    onCompleted: ({getUserSession}) => {
      createSession(getUserSession);
      setInitialRoute('RootDrawer');
      setTimeout(() => {
        setLanded(true);
      }, 200);

      //   const {user, accessToken} = getUserSession;

      //   if (APP_FLAVOR == 'C') {
      //     if (user.person.firstName == null || user.person.lastName == null) {
      //       navigation.navigate('RootDrawer', {
      //         screen: 'AuthenticatedStack',
      //         params: {
      //           screen: 'PostRegistration',
      //         },
      //       });
      //       return;
      //     }

      //     navigation.navigate('RootDrawer', {
      //       screen: 'AuthenticatedStack',
      //       params: {
      //         screen: 'Map',
      //       },
      //     });
      //   }

      //   if (APP_FLAVOR == 'D') {
      //     navigation.navigate('RootDrawer', {
      //       screen: 'AuthenticatedStack',
      //       params: {
      //         screen: 'DriverMap',
      //       },
      //     });
      //   }
    },
  });

  useEffect(() => {
    // destroySession();
    awaitAll();
    // OneSignal.addEventListener('ids', onId);
    // return () => {
    //   OneSignal.removeEventListener('ids', onId);
    // };
  }, []);

  // const onId = device => {
  //   // alert(JSON.stringify(device, null, 2))
  // };

  const checkAsyncStorageSession = async () => {
    const storedUserId = await AsyncStorage.getItem('userId');
    if (storedUserId) {
      getUserSession({
        variables: {
          input: {
            userId: storedUserId,
          },
        },
      });
    } else {
      setLanded(true);
    }
    try {
    } catch (error) {
      console.log(error);
    }
  };

  // const checkAsyncStorageSession = async () => {
  //   try {
  //     const userId = await AsyncStorage.getItem('userId'); // Without this, there's no stored session.
  //     // const pin = await AsyncStorage.getItem('pin');
  //     // const accessToken = await AsyncStorage.getItem('accessToken');
  //     // const refreshToken = await AsyncStorage.getItem('refreshToken');
  //     // TODO: Middleware for invalid access token to delete stored session.

  //     /**s
  //      * Fetch user data to create session
  //      */

  //     if(userId) {
  //       const record = await CLIENT.query({
  //         query: GET_USER,
  //         variables: {
  //           id: userId,
  //         },
  //       });
  //       createSession({user: record.data.getUser});
  //       setInitialRoute('EnterPin');
  //     }

  //   } catch (error) {
  //     destroySession();
  //   }
  // };

  // const getConstants = async () => {
  //   try {
  //     const records = await CLIENT.query({
  //       query: GET_CONSTANTS,
  //       fetchPolicy: 'network-only',
  //     });
  //     setConstants(mapKeyValueToObject(records.data.getConstants));
  //   } catch (error) {
  //     console.log('Landing.js', error);
  //   }
  // };

  // const oneSignalInit = async () => {
  //   OneSignal.init('4152b91e-f370-4764-8c43-e2cb7f48e0a2');
  //   OneSignal.inFocusDisplaying(2);
  // };

  const awaitAll = async () => {
    // oneSignalInit();
    // await Promise.all([checkAsyncStorageSession(), getConstants()]);
    await checkAsyncStorageSession();
  };

  return getLanded ? (
    <Nav initialRoute={initialRoute} />
  ) : (
    <ImageBackground style={styles.splash} source={SplashImage} resizeMode={'cover'} />
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
  destroySession: () => dispatch({type: 'DESTROY_SESSION'}),
  //setConstants: payload => dispatch({type: 'SET_CONSTANTS', payload}),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Splash);

// export default Landing;

const styles = StyleSheet.create({
  splash: {
    flex: 1,
  },
  barView: {
    height: 50,
    justifyContent: 'center',
  },
});
