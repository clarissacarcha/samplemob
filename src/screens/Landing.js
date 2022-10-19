import React, {useEffect, useState} from 'react';
import {Dimensions, Image, Alert} from 'react-native';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {useLazyQuery} from '@apollo/react-hooks';
import OneSignal from 'react-native-onesignal';
import {AUTH_CLIENT, GET_USER_SESSION} from '../graphql';
import ToktokSuperAppSplash from '../assets/images/SplashScreen.png';
import SafeArea from 'react-native-safe-area';

const Landing = ({createSession, destroySession, setAppServices, navigation}) => {
  const [safeAreaInset, setSafeAreaInset] = useState(0);
  const [getUserSession] = useLazyQuery(GET_USER_SESSION, {
    client: AUTH_CLIENT,
    onError: error => {
      const {graphQLErrors, networkError} = error;
      console.log(error);
      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      } else if (graphQLErrors.length > 0) {
        graphQLErrors.map(({message, locations, path, code}) => {
          if (message === 'Session expired. Please log in again.') {
            Alert.alert('', message);
            AsyncStorage.removeItem('accessToken');
            destroySession();
            navigation.replace('UnauthenticatedStack');
          } else if (code === 'INTERNAL_SERVER_ERROR') {
            Alert.alert('', 'Something went wrong.');
          } else if (code === 'USER_INPUT_ERROR') {
            Alert.alert('', message);
          } else if (code === 'BAD_USER_INPUT') {
            Alert.alert('', message);
          } else if (code === 'AUTHENTICATION_ERROR') {
            navigation.push('UnauthenticatedStack', {
              screen: 'AccountBlocked',
            });
          } else {
            console.log('ELSE ERROR:', error);
            Alert.alert('', 'Something went wrong...');
          }
        });
      }
    },
    onCompleted: async ({getUserSession}) => {
      try {
        const {user, accessToken, serviceAccess} = getUserSession;
        AsyncStorage.setItem('accessToken', accessToken);

        if (user.status == 3) {
          destroySession();
          navigation.push('UnauthenticatedStack', {
            screen: 'AccountBlocked',
          });
          return;
        }

        createSession(getUserSession);
        setAppServices(serviceAccess);

        OneSignal.sendTags({
          userId: user.id,
        });

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
              screen: 'ConsumerLanding',
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
    SafeArea.getSafeAreaInsetsForRootView().then(result => {
      setSafeAreaInset(result.safeAreaInsets.top);
    });
    checkAsyncStorageSession();
  }, []);

  return (
    <Image
      source={ToktokSuperAppSplash}
      style={{
        marginTop: -safeAreaInset,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      }}
      resizeMode="cover"
    />
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
  setAppServices: payload => dispatch({type: 'SET_APP_SERVICES', payload}),
  destroySession: () => dispatch({type: 'DESTROY_SESSION'}),
});

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
