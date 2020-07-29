import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableHighlight, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import BackgroundTimer from 'react-native-background-timer';
import AsyncStorage from '@react-native-community/async-storage';
import {useMutation} from '@apollo/react-hooks';
import OneSignal from 'react-native-onesignal';
import {currentLocation} from '../helper';
import {DARK, ORANGE, COLOR, MEDIUM} from '../res/constants';
import {AlertOverlay} from '../components';
import {onError} from '../util/ErrorUtility';
import {PATCH_DRIVER_GO_ONLINE, PATCH_DRIVER_GO_OFFLINE, POST_DRIVER_LOCATION_LOG} from '../graphql';

const Component = ({session, constants, createSession}) => {
  const {isOnline} = session.user.driver;
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);

  const [postDriverLocationLog] = useMutation(POST_DRIVER_LOCATION_LOG, {
    onError: error => console.log(`LOCATION LOG ERROR: ${error}`),
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
    BackgroundTimer.runBackgroundTimer(async () => {
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
    }, parseFloat(constants.driverLocationLogInterval));

    return () => BackgroundTimer.stopBackgroundTimer();
  }, []);

  const onNotificationOpened = ({notification}) => {
    try {
      type = notification.payload.additionalData.type;

      if (type) {
        const legend = {
          ANNOUNCEMENT: 'Announcements',
          NOTIFICATION: 'Notifications',
          WALLET: 'DriverWalletLog',
          N: 'Notifications',
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
      console.log(error);
      console.warn('Notification no additional data.');
    }
  };

  useEffect(() => {
    OneSignal.addEventListener('opened', onNotificationOpened);
  }, []);

  return (
    <>
      <AlertOverlay visible={loading} />
      <TouchableHighlight onPress={toggleOnlineStatus} underlayColor={COLOR} style={styles.submitBox}>
        <View style={styles.submit}>
          {loading ? (
            <ActivityIndicator size={24} color={COLOR} />
          ) : (
            <Text style={{color: COLOR, fontSize: 16, fontWeight: 'bold'}}>
              {isOnline ? 'Go Offline' : 'Go Online'}
            </Text>
          )}
        </View>
      </TouchableHighlight>
    </>
  );
};

const mapStateToProps = state => ({
  session: state.session,
  constants: state.constants,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export const DriverGoOnlineButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);

const styles = StyleSheet.create({
  submitBox: {
    marginVertical: 20,
    borderRadius: 10,
    marginRight: 20,
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
