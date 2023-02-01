import React, {useState, useEffect, useCallback} from 'react';
import {connect, useDispatch} from 'react-redux';
import {View, StyleSheet, SafeAreaView, StatusBar, ScrollView, RefreshControl, Platform, Linking} from 'react-native';
import OneSignal from 'react-native-onesignal';
import FlagSecure from 'react-native-flag-secure-android';
import {useNavigation, useFocusEffect, useRoute} from '@react-navigation/native';
import {COLOR} from '../../../../../res/variables';

//SELF IMPORTS
import {Header, HeaderSearchField, Menu, Advertisements} from './Components';
import {GET_USER_HASH} from '../../../../../graphql';
import {onError} from '../../../../../util/ErrorUtility';
import {useLazyQuery} from '@apollo/react-hooks';
import dynamicLinks from '@react-native-firebase/dynamic-links';
const Screen = ({navigation, constants, session, createSession}) => {
  // const userLocation = {
  //   latitude,
  //   longitude,
  //   formattedAddress,
  //   formattedAddressHash
  // }
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS == 'android') FlagSecure.deactivate();
    }, []),
  );

  const [userLocation, setUserLocation] = useState(null);

  const dispatch = useDispatch();

  const onNotificationOpened = ({notification}) => {
    try {
      console.log('Notification', JSON.stringify(notification));

      if (notification.additionalData.classification === 'toktokwallet') {
        setTimeout(() => {
          // navigation.navigate('ToktokWalletHomePage');
          // navigation.replace('ToktokWalletHomePage');
          // navigation.navigate('ToktokLandingNotifications');
        }, 10);
        return;
      } else if (notification.additionalData.classification === 'toktokmall') {
        setTimeout(() => {
          navigation.navigate('ToktokMallSplashScreen');
        }, 10);
        return;
      }

      if (notification.additionalData.classification === 'toktokbills') {
        setTimeout(() => {
          navigation.navigate('ToktokLandingNotifications', {screen: 'ToktokBillsNotifications'});
        }, 10);
        return;
      }

      if (notification.additionalData.classification === 'toktokload') {
        setTimeout(() => {
          navigation.navigate('ToktokLandingNotifications', {screen: 'ToktokLoadNotifications'});
        }, 10);
        return;
      }
      if (notification.additionalData.service === 'GO') {
        const notifData = JSON.parse(notification.additionalData.data);
        setTimeout(() => {
          navigation.navigate('ToktokGoLanding', {
            action: notification.additionalData.action,
            bookingId: notifData.tripId,
          });
        }, 10);
        return;
      }
      if (notification.additionalData.service === 'DELIVERY') {
        if (notification.additionalData.deliveryId) {
          dispatch({
            type: 'SET_TOKTOK_DELIVERY_NOTIFICATION_DELIVERY',
            payload: {notificationDeliveryId: notification.additionalData.deliveryId},
          });
        }
        navigation.navigate('ToktokLandingDeliveries', {
          screen: 'ToktokDeliveryActivities',
        });
      }
      const type = notification.additionalData.type;

      if (type) {
        if (type == 'ANNOUNCEMENT') {
          setTimeout(() => {
            navigation.push('Announcements');
          }, 10);
          return;
        }

        setTimeout(() => {
          navigation.push('Notifications');
        }, 10);
      }
    } catch (error) {
      console.warn(error);
      console.warn('Notification no additional data.');
    }
  };

  const handleDynamicLinks = link => {
    // DYNAMIC LINK SHOULD BE
    // https://toktok.page.link/?apn=sample.ph&ibi=sample.ph&afl=https://site.com&link=https://site.com/refer/ABC123

    const decomposeLink = link?.url.split('/');
    console.log(decomposeLink[decomposeLink.length - 1]); // RETURNS ABC123
  };

  const handleOpenReferral = async () => {
    if (Platform.OS === 'android') {
      dynamicLinks().getInitialLink().then(handleDynamicLinks);
    } else if (Platform.OS === 'ios') {
      const openedFromLink = await Linking.getInitialURL();
      if (openedFromLink) {
        const decomposeLink = openedFromLink.split('/');
        console.log(decomposeLink[decomposeLink.length - 1]); // RETURNS ABC123
      }
    } else {
      console.log('Opened on new device OS!');
    }
  };

  useEffect(() => {
    OneSignal.setNotificationOpenedHandler(onNotificationOpened);
    getUserHash();
    handleOpenWallet();
    handleOpenReferral();
    // const backHandler = BackHandler.addEventListener('hardwareBackPress', function() {
    //   return true;
    // });
    return () => {
      // backHandler.remove();
    };
  }, []);

  const [getUserHash] = useLazyQuery(GET_USER_HASH, {
    fetchPolicy: 'network-only',
    onError,
    onCompleted: response => {
      const newSession = {...session};
      newSession.userHash = response.getUserHash;
      createSession(newSession);
    },
  });

  const handleOpenWallet = async () => {
    const openedFromLink = await Linking.getInitialURL();
    if (openedFromLink) {
      if (openedFromLink.slice(9) === 'wallet') {
        navigation.navigate('ToktokWalletLoginPage');
      }
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={'transparent'} translucent />
      <View style={styles.screen}>
        {/* <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              colors={[COLOR.YELLOW]}
              refreshing={false}
              onRefresh={() => {
                console.log('REFRESHED');
              }}
            />
          }
        > */}
        {/* <Header /> */}
        {/* <Menu setUserLocation={setUserLocation} constants={constants} /> */}
        <Advertisements
          Header={Header}
          HeaderSearchField={HeaderSearchField}
          Menu={Menu}
          setUserLocation={setUserLocation}
          constants={constants}
        />
        {/* </ScrollView> */}
      </View>
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

export const ToktokLandingHome = connect(mapStateToProps, mapDispatchToProps)(Screen);

const styles = StyleSheet.create({
  screen: {
    backgroundColor: COLOR.WHITE,
    flex: 1,
  },
});
