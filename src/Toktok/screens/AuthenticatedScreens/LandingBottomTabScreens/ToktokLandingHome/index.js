import React, {useState, useEffect, useCallback} from 'react';
import {connect, useDispatch} from 'react-redux';
import {View, StyleSheet, SafeAreaView, StatusBar, ScrollView, RefreshControl, Platform, Linking} from 'react-native';
import OneSignal from 'react-native-onesignal';
import FlagSecure from 'react-native-flag-secure-android';
import {useNavigation, useFocusEffect, useRoute} from '@react-navigation/native';
import {COLOR} from '../../../../../res/variables';

//SELF IMPORTS
import {Header, HeaderSearchField, Menu, Advertisements} from './Components';
import {AUTH_CLIENT, CONSUMER_SET_REFERRAL_CODE, GET_USER_HASH, GET_USER_SESSION} from '../../../../../graphql';
import {onError, onErrorAlert} from '../../../../../util/ErrorUtility';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {handleDynamicLinks, handleSubscriptionLinking, handleUniversalLinks} from '../../../../../util';
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

  useEffect(() => {
    OneSignal.setNotificationOpenedHandler(onNotificationOpened);
    getUserHash();
    handleOpenWallet();
    // GET DYNAMIC URL ON NEW INSTALL
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        const saveReferral = saveReferralCodeFromLink(handleDynamicLinks(link));
        if (saveReferral) {
          return;
        }
        saveReferralCodeFromLinkAsync(handleUniversalLinks);
      });
    let isDone = false;
    // GET DYNAMIC URL WHILE APP OPENED
    const subscribeDynamicLinks = dynamicLinks().onLink(link => {
      isDone = saveReferralCodeFromLink(handleSubscriptionLinking(link));
    });

    if (!isDone) {
      Linking.addEventListener('url', event => saveReferralCodeFromLink(handleSubscriptionLinking(event)));
    }
    // const backHandler = BackHandler.addEventListener('hardwareBackPress', function() {
    //   return true;
    // });
    return () => {
      subscribeDynamicLinks();
      // backHandler.remove();
    };
  }, []);

  const saveReferralCodeFromLink = getReferral => {
    const referral = getReferral;
    if (referral?.length < 10) {
      consumerSetReferralCode({
        variables: {
          input: {
            referralCode: referral,
          },
        },
      });
      return true;
    } else {
      console.log('[Referral err]: No referral code.');
      return false;
    }
  };

  const saveReferralCodeFromLinkAsync = async getReferral => {
    const referral = await getReferral();
    if (referral) {
      consumerSetReferralCode({
        variables: {
          input: {
            referralCode: referral,
          },
        },
      });
      return true;
    } else {
      console.log('[Referral err]: No referral code.', referral);
    }
  };

  const [consumerSetReferralCode, {loading}] = useMutation(CONSUMER_SET_REFERRAL_CODE, {
    onCompleted: () => {
      console.log('Referral code saved!');
      const storedUserId = session.user.id;
      getUserSession({
        variables: {
          input: {
            userId: storedUserId,
          },
        },
      });
    },
    onError: err => {
      console.log('Referral code not saved!', err);
    },
  });

  const [getUserSession] = useLazyQuery(GET_USER_SESSION, {
    client: AUTH_CLIENT,
    fetchPolicy: 'network-only',
    onError: error => {
      const {graphQLErrors, networkError} = error;
      // console.log(error);
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
    onCompleted: ({getUserSession}) => {
      try {
        createSession(getUserSession);
      } catch (error) {
        console.log(error);
      }
    },
  });

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
