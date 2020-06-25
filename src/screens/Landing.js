import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ImageBackground, Alert} from 'react-native';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {useLazyQuery} from '@apollo/react-hooks';
import OneSignal from 'react-native-onesignal';
import {APP_FLAVOR} from '../res/constants';
import {CLIENT, GET_USER_SESSION, GET_GLOBAL_SETTINGS} from '../graphql';
import {onError} from '../util/ErrorUtility';

import SplashImage from '../assets/images/Splash.png';

const mapKeyValueToObject = keyValueArray => {
  const result = {};
  keyValueArray.map(kv => {
    result[kv.key] = kv.keyValue;
  });
  console.log(JSON.stringify(result, null, 4));
  return result;
};

const Landing = ({createSession, destroySession, setConstants, navigation}) => {
  const [getUserSession] = useLazyQuery(GET_USER_SESSION, {
    onError: onError,
    onCompleted: ({getUserSession}) => {
      try {
        const {user, accessToken} = getUserSession;

        if (user.status == 3) {
          destroySession();
          navigation.navigate('UnauthenticatedStack', {
            screen: 'AccountBlocked',
          });
          return;
        }

        createSession(getUserSession);

        //TODO: Check for valid user status and access token. Also check for existing user record

        if (APP_FLAVOR == 'C') {
          if (user.person.firstName == null || user.person.lastName == null) {
            navigation.navigate('RootDrawer', {
              screen: 'AuthenticatedStack',
              params: {
                screen: 'PostRegistration',
              },
            });
          } else {
            navigation.navigate('RootDrawer', {
              screen: 'AuthenticatedStack',
              params: {
                screen: 'ConsumerMap',
              },
            });
          }
        }

        if (APP_FLAVOR == 'D') {
          navigation.navigate('RootDrawer', {
            screen: 'AuthenticatedStack',
            params: {
              screen: 'DriverMap',
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  const getConstants = async () => {
    try {
      const records = await CLIENT.query({
        query: GET_GLOBAL_SETTINGS,
        fetchPolicy: 'network-only',
      });
      setConstants(mapKeyValueToObject(records.data.getGlobalSettings));
    } catch (error) {
      console.log(error);
    }
  };

  const checkAsyncStorageSession = async () => {
    const storedUserId = await AsyncStorage.getItem('userId');

    if (storedUserId) {
      console.log('STORED SESSION');
      getUserSession({
        variables: {
          input: {
            userId: storedUserId,
          },
        },
      });
    } else {
      console.log('EMPTY SESSION');
      navigation.navigate('UnauthenticatedStack');
    }
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const onMount = async () => {
    // destroySession();
    await getConstants();
    await checkAsyncStorageSession();
  };

  useEffect(() => {
    onMount();
  }, []);

  return <ImageBackground style={styles.splash} source={SplashImage} resizeMode={'cover'} />;
};

const mapStateToProps = state => ({
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
  destroySession: () => dispatch({type: 'DESTROY_SESSION'}),
  setConstants: payload => dispatch({type: 'SET_CONSTANTS', payload}),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Landing);

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
