import {ActivityIndicator, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {COLOR, DARK, MEDIUM, ORANGE} from '../res/constants';
import {PATCH_DRIVER_GO_OFFLINE, PATCH_DRIVER_GO_ONLINE, POST_DRIVER_LOCATION_LOG} from '../graphql';
import React, {useEffect, useState} from 'react';

import {AlertOverlay} from '../components';
import AsyncStorage from '@react-native-community/async-storage';
import BackgroundTimer from 'react-native-background-timer';
import OneSignal from 'react-native-onesignal';
import {connect} from 'react-redux';
import {currentLocation} from '../helper';
import {onError} from '../util/ErrorUtility';
import {useMutation} from '@apollo/react-hooks';
import {useNavigation} from '@react-navigation/native';

const Component = ({
  session,
  constants,
  createSession,
  application,
  startBackgroundLocation,
  endBackgroundLocation,
}) => {
  const {isOnline} = session.user.driver;
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);

  const [postDriverLocationLog] = useMutation(POST_DRIVER_LOCATION_LOG, {
    onError: (error) => console.log(`LOCATION LOG ERROR: ${error}`),
  });

  const [patchDriverGoOnline] = useMutation(PATCH_DRIVER_GO_ONLINE, {
    onError,
    onCompleted: () => {
      setLoading(false);

      const newSession = {...session};
      newSession.user.driver.isOnline = true;
      createSession(newSession);

      AsyncStorage.setItem('driverOnlineStaus', '1');
    },
  });

  const [patchDriverGoOffline] = useMutation(PATCH_DRIVER_GO_OFFLINE, {
    onError,
    onCompleted: () => {
      setLoading(false);

      const newSession = {...session};
      newSession.user.driver.isOnline = false;
      createSession(newSession);

      AsyncStorage.setItem('driverOnlineStaus', '0');
    },
  });

  const toggleOnlineStatus = () => {
    setLoading(true);
    const toggleFunction = isOnline ? patchDriverGoOffline : patchDriverGoOnline;
    toggleFunction({
      variables: {
        input: {
          driverId: session.user.driver.id,
        },
      },
    });
  };

  useEffect(() => {
    if (!application.backgroundLocation) {
      startBackgroundLocation();
      console.log('BACKGROUND LOCATION LOG');
      // BackgroundTimer.runBackgroundTimer(async () => {
      //   postLocationLog();
      // }, parseFloat(constants.driverLocationLogInterval));

      BackgroundTimer.setInterval(() => {
        postLocationLog();
      }, parseFloat(constants.driverLocationLogInterval));

      // return () => BackgroundTimer.stopBackgroundTimer();
    }
  }, []);

  const postLocationLog = async () => {
    if (isOnline) {
      const {latitude, longitude} = await currentLocation({showsReverseGeocode: false});
      console.log(`Logging ${latitude} | ${longitude}`);
      postDriverLocationLog({
        variables: {
          input: {
            tokDriverId: session.user.driver.id,
            latitude,
            longitude,
          },
        },
      });
    } else {
      console.log('OFFLINE');
    }
  };

  const onNotificationOpened = ({notification}) => {
    try {
      const type = notification.payload.additionalData.type;

      if (type) {
        const legend = {
          ANNOUNCEMENT: 'Announcements',
          NOTIFICATION: 'Notifications',
          WALLET: 'DriverWalletLog',
          N: 'Notifications', // Backwards Compatibility
        };

        const route = legend[type];

        if (route) {
          setTimeout(() => {
            navigation.push(route);
          }, 10);
        } else {
          console.warn('Notification on opened route undefined.');
        }
      }
    } catch (error) {
      console.warn('Notification no additional data.');
    }
  };

  useEffect(() => {
    OneSignal.setNotificationOpenedHandler(onNotificationOpened);
  }, []);

  return (
    <>
      <AlertOverlay visible={loading} />
      <TouchableHighlight onPress={toggleOnlineStatus} underlayColor={COLOR} style={styles.submitBox}>
        <View style={styles.submit}>
          {loading ? (
            <ActivityIndicator size={24} color={COLOR} />
          ) : (
            <Text style={{color: COLOR, fontSize: 16, fontFamily: 'Rubik-Medium'}}>
              {isOnline ? 'Go Offline' : 'Go Online'}
            </Text>
          )}
        </View>
      </TouchableHighlight>
    </>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
  constants: state.constants,
  application: state.application,
});

const mapDispatchToProps = (dispatch) => ({
  createSession: (payload) => dispatch({type: 'CREATE_SESSION', payload}),
  startBackgroundLocation: () => dispatch({type: 'START_BACKGROUND_LOCATION'}),
  endBackgroundLocation: () => dispatch({type: 'END_BACKGROUND_LOCATION'}),
});

export const DriverGoOnlineButton = connect(mapStateToProps, mapDispatchToProps)(Component);

const styles = StyleSheet.create({
  submitBox: {
    marginVertical: 20,
    borderRadius: 10,
  },
  submit: {
    backgroundColor: DARK,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    width: 95,
  },
});
