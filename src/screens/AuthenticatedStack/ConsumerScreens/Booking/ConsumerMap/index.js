import {Alert, Image, Platform, StyleSheet, Text, ScrollView, TouchableHighlight, View} from 'react-native';
import {BookingOverlay, LocationPermission, WelcomeBanner, WelcomeMessage} from '../../../../../components';
import {COLOR, DARK, LIGHT, MAPS_API_KEY, MEDIUM} from '../../../../../res/constants';
import {GET_ORDER_PRICE, GET_WELCOME_MESSAGE, POST_DELIVERY} from '../../../../../graphql';
import {PERMISSIONS, RESULTS, check} from 'react-native-permissions';
import React, {useEffect, useRef, useState} from 'react';
import {useMutation, useQuery} from '@apollo/react-hooks';

import FIcon from 'react-native-vector-icons/Feather';
import OneSignal from 'react-native-onesignal';
import ToktokLogo from '../../../../../assets/icons/ToktokLogo.png';
import {connect} from 'react-redux';
import {currentLocation} from '../../../../../helper';
import {onError} from '../../../../../util/ErrorUtility';
import {BlackButton} from '../../../../../components/forms';

//SELF IMPORTS
import BookingMap from './BookingMap';
import BookingSummaryCard from './BookingSummaryCard';

const INITIAL_SENDER = (session) => {
  const consumerName = session.user ? `${session.user.person.firstName} ${session.user.person.lastName}` : '';
  const consumerMobile = session.user ? session.user.username : '';
  const minus63 = consumerMobile.replace('+63', '');

  return {
    latitude: 0,
    longitude: 0,
    formattedAddress: '',
    name: consumerName,
    mobile: minus63,
    landmark: '',
    orderType: 1,
    scheduledFrom: null,
    scheduledTo: null,
    address: {
      city: '',
      province: '',
      country: '',
    },
  };
};

const INITIAL_RECIPIENT = [
  {
    latitude: 0,
    longitude: 0,
    formattedAddress: '',
    name: '',
    mobile: '',
    landmark: '',
    cargo: '',
    orderType: 1,
    scheduledFrom: null,
    scheduledTo: null,
    cashOnDelivery: null,
    collectPaymentFrom: 'S',
    expressFee: 0,
    address: {
      city: '',
      province: '',
      country: '',
    },
  },
];

const INITIAL_DIRECTIONS = {
  distance: 0,
  duration: 0,
};

// Region for Philippine Map
const INITIAL_REGION = {
  latitude: 11.22309004847093,
  latitudeDelta: 19.887065883877668,
  longitude: 121.97818368673325,
  longitudeDelta: 10.145791545510278,
};

const getLocationPermissionAfterBooking = async () => {
  try {
    const checkAndroid = async () => {
      const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

      // Location Unavailable In Device. Proceed and use INITIAL_REGION as region
      if (result === RESULTS.UNAVAILABLE) {
        return false;
      }

      // Location Request Denied. Proceed and use INITIAL_REGION as region
      if (result === RESULTS.BLOCKED) {
        return false;
      }

      // IF GPS Request Granted
      if (result === RESULTS.GRANTED) {
        return true;
      }

      // IF GPS Request Denied
      if (result === RESULTS.DENIED) {
        return false;
      }
    };

    const checkIOS = async () => {
      const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      // Location Unavailable In Device. Proceed and use INITIAL_REGION as region
      if (result === RESULTS.UNAVAILABLE) {
        return false;
      }

      // Location Request Denied. Proceed and use INITIAL_REGION as region
      if (result === RESULTS.BLOCKED) {
        return false;
      }

      // IF GPS Request Granted
      if (result === RESULTS.GRANTED) {
        return true;
      }

      // IF GPS Request Denied
      if (result === RESULTS.DENIED) {
        return false;
      }
    };

    const checkFunction = Platform.select({
      ios: checkIOS,
      android: checkAndroid,
    });

    const permissionResult = await checkFunction();

    return permissionResult;
  } catch (error) {
    console.log(error);
  }
};

const ConsumerMap = ({navigation, session, route, constants}) => {
  const {detectedLocation} = route.params;

  const INITIAL_BOOKING_DATA = {
    hash: '',
    consumerId: session.user.consumer.id,
    price: 0,
    distance: 0,
    duration: 0,
    collectPaymentFrom: 'SENDER',
    isCashOnDelivery: false,
    cashOnDelivery: 0,
    expressFee: 0,
    cargo: '',
    notes: '',
    promoCode: '',
    senderStop: {
      name: `${session.user.person.firstName} ${session.user.person.lastName}`,
      mobile: session.user.username.replace('+63', ''),
      latitude: detectedLocation.latitude,
      longitude: detectedLocation.longitude,
      formattedAddress: detectedLocation.formattedAddress,
      orderType: 'ASAP',
      landmark: 'Sa gilid gilid.',
    },
    recipientStop: [
      {
        name: '',
        mobile: '',
        latitude: null,
        longitude: null,
        formattedAddress: null,
        orderType: 'ASAP',
        landmark: 'Sa tabi tabi.',
      },
    ],
  };

  const mapViewRef = useRef(null);
  const [bookingData, setBookingData] = useState(INITIAL_BOOKING_DATA);
  const [bookingRoute, setBookingRoute] = useState(null);

  const onBookingDataConfirmed = () => {};

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [recipientIndex, setRecipientIndex] = useState(0); // Used for multiple recipients
  const [allowBooking, setAllowBooking] = useState(false);

  const [region, setRegion] = useState(INITIAL_REGION);
  const [senderStop, setSender] = useState(INITIAL_SENDER(session));
  const [recipient, setRecipient] = useState(INITIAL_RECIPIENT);
  const [directions, setDirections] = useState(INITIAL_DIRECTIONS);
  const [price, setPrice] = useState(0);

  const onResetAfterBooking = async () => {
    try {
      setDirections(INITIAL_DIRECTIONS);

      const permissionResult = await getLocationPermissionAfterBooking();

      if (permissionResult) {
        const location = await currentLocation({
          showsReverseGeocode: true,
        });

        mapViewRef.current.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        });

        setSender({
          ...INITIAL_SENDER(session),
          ...location,
        });
      } else {
        // setRegion(INITIAL_REGION);
        mapViewRef.current.animateToRegion(INITIAL_REGION);

        setSender({
          ...INITIAL_SENDER(session),
        });
      }

      setRecipient(INITIAL_RECIPIENT);
    } catch (error) {
      console.log('GPS Location Turned Off Or Location Cannot Be Detected');
      console.log(error);
      setAllowBooking(true);
    }
  };

  const [postDelivery, {loading: postDeliveryLoading}] = useMutation(POST_DELIVERY, {
    onError: onError,
    onCompleted: () => {
      try {
        setBookingSuccess(true);
        // onResetAfterBooking();
      } catch (error) {
        // console.log(error);
      }
    },
  });

  const onNotificationOpened = ({notification}) => {
    try {
      const type = notification.payload.additionalData.type;
      if (type) {
        const legend = {
          ANNOUNCEMENT: 'Announcements',
          NOTIFICATION: 'Notifications',
          N: 'Notifications',
        };

        const routeTo = legend[type];

        if (routeTo) {
          setTimeout(() => {
            navigation.push(routeTo);
          }, 10);
        } else {
          console.warn('Notification on opened route undefined.');
        }
      }
    } catch (error) {
      console.warn('Notification no additional data.');
    }
  };

  const oneSignalInit = async () => {
    // OneSignal.init(constants.consumerOneSignalAppId);
    // OneSignal.inFocusDisplaying(2);
  };

  useEffect(() => {
    oneSignalInit();

    // setTimeout(() => {
    //   mapViewRef.current.fitToCoordinates(
    //     [
    //       {
    //         latitude: 14.8088456,
    //         longitude: 121.0872078,
    //       },
    //       {
    //         latitude: 14.5564054,
    //         longitude: 120.9935436,
    //       },
    //     ],
    //     {
    //       edgePadding: {
    //         right: 20,
    //         bottom: 850,
    //         left: 20,
    //         top: 100,
    //       },
    //     },
    //   );
    // }, 3000);

    // OneSignal.getTags(tags => console.log(`ONESIGNAL USER ID TAG: ${tags.userId}`));
    OneSignal.addEventListener('opened', onNotificationOpened);

    // const backHandler = BackHandler.addEventListener('hardwareBackPress', function() {
    //   return true;
    // });
    return () => {
      // backHandler.remove();
      OneSignal.removeEventListener('received');
    };
  }, []);

  const onSubmit = async () => {
    try {
      if (
        senderStop.latitude === 0 ||
        senderStop.longitude === 0 ||
        senderStop.formattedAddress === '' ||
        senderStop.name === '' ||
        senderStop.mobile === ''
      ) {
        Alert.alert('', 'Please complete sender details.');
        return;
      }

      let emptyRecipient = false;

      recipient.forEach((rec) => {
        if (
          rec.latitude === 0 ||
          rec.longitude === 0 ||
          rec.formattedAddress === '' ||
          rec.name === '' ||
          rec.mobile === ''
        ) {
          emptyRecipient = true;
        }
      });

      if (emptyRecipient) {
        Alert.alert('', 'Please enter recipient details.');
        return;
      }

      const input = {
        tokConsumerId: session.user.consumer.id,
        distance: directions.distance,
        duration: parseInt(directions.duration),
        price: price,
        referralCode: session.user.consumer.referralCode,
        senderStop: senderStop,
        recipientStop: recipient,
      };

      // Delete this field. Only used in mobile app.
      delete input.senderStop.accuracy;
      delete input.senderStop.latitudeDelta;
      delete input.senderStop.longitudeDelta;

      delete input.recipientStop[0].accuracy;
      delete input.recipientStop[0].latitudeDelta;
      delete input.recipientStop[0].longitudeDelta;

      input.senderStop.mobile = `${input.senderStop.mobile}`;
      input.recipientStop[0].mobile = `${input.recipientStop[0].mobile}`;

      postDelivery({
        variables: {
          input,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onBookSuccessOk = () => {
    setBookingSuccess(false);
    navigation.navigate('CustomerDeliveries');
  };

  return (
    <View style={styles.container}>
      <WelcomeBanner />
      {/* {showWelcome && <WelcomeMessage data={welcomeData.getWelcomeMessage} onOkay={hideWelcomeMessage} />} */}

      <BookingOverlay visible={postDeliveryLoading || bookingSuccess} done={bookingSuccess} onOkay={onBookSuccessOk} />

      <BookingMap bookingData={bookingData} bookingRoute={bookingRoute} />

      <View style={styles.footer}>
        {/* ---------------------------------------- TESTING BOX START----------------------------------------*/}
        {false && (
          <View style={styles.testBox}>
            <View style={{height: 500}}>
              <ScrollView>
                {/* <Text style={{fontSize: 8}}>{JSON.stringify({senderStop}, null, 4)}</Text>
              <Text style={{fontSize: 8}}>{JSON.stringify({recipient}, null, 4)}</Text> */}
                <Text style={{fontSize: 10}}>{JSON.stringify({detectedLocation}, null, 4)}</Text>
                <Text style={{fontSize: 10}}>{JSON.stringify({bookingData}, null, 4)}</Text>
              </ScrollView>
            </View>
          </View>
        )}
        {/*---------------------------------------- TESTING BOX END---------------------------------------- */}

        <BookingSummaryCard bookingData={bookingData} />

        <BlackButton onPress={onSubmit} label="Book" containerStyle={{margin: 20}} />
      </View>
      {/*---------------------------------------- DRAWER BUTTON ----------------------------------------*/}
      <TouchableHighlight onPress={() => navigation.openDrawer()} underlayColor={COLOR} style={styles.menuBox}>
        <View style={styles.menu}>
          <FIcon name="menu" size={24} color={COLOR} />
        </View>
      </TouchableHighlight>

      {/*---------------------------------------- BRANDING ICON ----------------------------------------*/}
      <TouchableHighlight underlayColor={COLOR} style={styles.branding}>
        <Image style={styles.brandingImage} source={ToktokLogo} />
      </TouchableHighlight>
    </View>
  );
};

const mapStateToProps = (state) => ({
  session: state.session,
  constants: state.constants,
});

export default connect(mapStateToProps, null)(ConsumerMap);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9,
  },
  menuBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: 20,
    borderRadius: 10,
  },
  branding: {
    position: 'absolute',
    top: 0,
    left: 70,
    marginTop: 20,
    borderRadius: 10,
  },
  brandingImage: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 10,
  },
  menu: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    backgroundColor: DARK,
    borderRadius: 10,
  },
  testBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
