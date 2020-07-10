import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {useLazyQuery} from '@apollo/react-hooks';
import OneSignal from 'react-native-onesignal';
import {APP_FLAVOR} from '../res/constants';
import {AUTH_CLIENT, GET_USER_SESSION, GET_GLOBAL_SETTINGS} from '../graphql';
import {onError} from '../util/ErrorUtility';

import SplashImage from '../assets/images/Splash.png';

const Landing = ({createSession, destroySession, navigation}) => {
  const [getUserSession] = useLazyQuery(GET_USER_SESSION, {
    client: AUTH_CLIENT,
    onError: onError,
    onCompleted: ({getUserSession}) => {
      try {
        const {user, accessToken} = getUserSession;

        if (user.status == 3) {
          destroySession();
          navigation.replace('UnauthenticatedStack', {
            screen: 'AccountBlocked',
          });
          return;
        }

        createSession(getUserSession);

        OneSignal.sendTags(
          {
            userId: user.id,
          },
          () => console.log('LALA'),
          () => console.log('MOVE'),
        );

        //TODO: Check for valid user status and access token. Also check for existing user record

        if (APP_FLAVOR == 'C') {
          if (user.person.firstName == null || user.person.lastName == null) {
            navigation.replace('RootDrawer', {
              screen: 'AuthenticatedStack',
              params: {
                screen: 'PostRegistration',
              },
            });
          } else {
            navigation.replace('RootDrawer', {
              screen: 'AuthenticatedStack',
              params: {
                screen: 'ConsumerMap',
              },
            });
          }
        }

        if (APP_FLAVOR == 'D') {
          navigation.replace('RootDrawer', {
            screen: 'AuthenticatedStack',
            params: {
              screen: 'DriverHomeBottomTab',
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

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
      navigation.replace('UnauthenticatedStack');
    }
    try {
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkAsyncStorageSession();
  }, []);

  return <ImageBackground style={styles.splash} source={SplashImage} resizeMode={'cover'} />;
};

const mapStateToProps = state => ({
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
  destroySession: () => dispatch({type: 'DESTROY_SESSION'}),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Landing);

const styles = StyleSheet.create({
  splash: {
    flex: 1,
  },
});
