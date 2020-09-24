import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
  Switch,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, AnimatedRegion, Animated, PROVIDER_DEFAULT} from 'react-native-maps';
import OneSignal from 'react-native-onesignal';
import MapViewDirections from 'react-native-maps-directions';
import {connect} from 'react-redux';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {currentLocation} from '../../../../helper';
import {BookingOverlay, LocationPermission, WelcomeMessage} from '../../../../components';
import {YellowIcon} from '../../../../components/ui';
import {COLOR, DARK, MEDIUM, LIGHT, MAPS_API_KEY} from '../../../../res/constants';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {POST_DELIVERY, GET_ORDER_PRICE, GET_WELCOME_MESSAGE} from '../../../../graphql';
import {onError} from '../../../../util/ErrorUtility';

import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import EIcon from 'react-native-vector-icons/Entypo';
import FIcon from 'react-native-vector-icons/Feather';

import ToktokLogo from '../../../../assets/icons/ToktokLogo.png';

const INITIAL_SENDER = session => {
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
  const mapViewRef = useRef(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [recipientIndex, setRecipientIndex] = useState(0); // Used for multiple recipients
  const [allowBooking, setAllowBooking] = useState(false);

  const [region, setRegion] = useState(INITIAL_REGION);
  const [senderStop, setSender] = useState(INITIAL_SENDER(session));
  const [recipient, setRecipient] = useState(INITIAL_RECIPIENT);
  const [directions, setDirections] = useState(INITIAL_DIRECTIONS);
  const [price, setPrice] = useState(0);
  const [isExpress, setIsExpress] = useState(false);

  const onExpressDeliveryChange = value => {
    setIsExpress(value);

    if (value) {
      const expressData = recipient;
      expressData[recipientIndex].expressFee = parseFloat(constants.expressDeliveryFee);
      setRecipient(expressData);
    } else {
      const expressData = recipient;
      expressData[recipientIndex].expressFee = 0;
      setRecipient(expressData);
    }
  };

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
    } catch {
      console.log('GPS Location Turned Off Or Location Cannot Be Detected');
      setAllowBooking(true);
    }
  };

  const onGrantLocation = async () => {
    try {
      const location = await currentLocation({
        showsReverseGeocode: true,
      });

      if (!allowBooking) {
        setSender({
          ...senderStop,
          ...location,
        });

        mapViewRef.current.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        });

        setAllowBooking(true);
      }
    } catch {
      console.log('GPS Location Turned Off Or Location Cannot Be Detected');
      setAllowBooking(true);
    }
  };

  const onDenyLocation = async () => {
    // No Location. animate mapView to INITIAL_REGION and allow booking
    mapViewRef.current.animateToRegion(INITIAL_REGION);
    setAllowBooking(true);
  };

  const {data: welcomeData, loading: welcomeLoading, error: welcomeError} = useQuery(GET_WELCOME_MESSAGE);
  const [showWelcome, setShowWelcome] = useState(false);
  const hideWelcomeMessage = () => {
    setShowWelcome(false);
  };
  useEffect(() => {
    console.log(welcomeData);
    if (welcomeData) {
      if (welcomeData.getWelcomeMessage) {
        setShowWelcome(true);
      }
    }
  }, [welcomeData]);

  const [postDelivery, {loading: postDeliveryLoading}] = useMutation(POST_DELIVERY, {
    onError: onError,
    onCompleted: () => {
      try {
        setBookingSuccess(true);
        onResetAfterBooking();
      } catch (error) {
        // console.log(error);
      }
    },
  });

  const [getOrderPrice, {loading: getOrderPriceLoading}] = useMutation(GET_ORDER_PRICE, {
    onError: onError,
    ignoreResults: true,
    onCompleted: ({getOrderPrice}) => {
      setPrice(getOrderPrice);
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

  const oneSignalInit = async () => {
    OneSignal.init(constants.consumerOneSignalAppId);
    OneSignal.inFocusDisplaying(2);
  };

  useEffect(() => {
    oneSignalInit();

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

  // If directions.distance or price change, calculate for order price
  useEffect(() => {
    console.log(`EFFECT Distance: ${directions.distance} || Price: ${price}`);

    if (directions.distance != 0 && price == '0') {
      setTimeout(() => {
        getOrderPrice({
          variables: {
            input: {
              distance: directions.distance,
              senderAddress: senderStop.address,
              recipientAddress: recipient[recipientIndex].address,
            },
          },
        });
      }, 2000);
    }
  }, [directions.distance, price]);

  const onDirectionsReady = ({distance, duration, coordinates}) => {
    setDirections({
      // ...directions,
      distance,
      duration,
    });

    setTimeout(() => {
      mapViewRef.current.fitToCoordinates(coordinates, {
        edgePadding: {
          right: 20,
          bottom: 350,
          left: 20,
          top: 100,
        },
      });
    }, 0);
  };

  const onSenderPress = () => {
    navigation.navigate('SenderDetails', {data: senderStop, setData: setSender, setPrice});
  };

  const onRecipientPress = () => {
    navigation.navigate('RecipientDetails', {
      data: recipient,
      setData: setRecipient,
      index: recipientIndex,
      setPrice,
    });
  };

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

      recipient.forEach(rec => {
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
      {showWelcome && <WelcomeMessage data={welcomeData.getWelcomeMessage} onOkay={hideWelcomeMessage} />}

      <BookingOverlay visible={postDeliveryLoading || bookingSuccess} done={bookingSuccess} onOkay={onBookSuccessOk} />
      {!allowBooking && <LocationPermission onGrant={onGrantLocation} onDeny={onDenyLocation} />}
      {/*---------------------------------------- MAP ----------------------------------------*/}
      <MapView
        provider={PROVIDER_GOOGLE}
        // provider={Platform.OS == 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        ref={mapViewRef}
        style={styles.container}
        initialRegion={INITIAL_REGION}>
        {/*---------------------------------------- SENDER MARKER ----------------------------------------*/}
        {senderStop.latitude != 0 && (
          <Marker coordinate={{latitude: senderStop.latitude, longitude: senderStop.longitude}}>
            <FA5Icon name="map-pin" size={24} color={DARK} />
          </Marker>
        )}
        {/*---------------------------------------- RECIPIENT MARKER ----------------------------------------*/}
        {recipient[recipientIndex].name != '' && (
          <Marker
            coordinate={{
              latitude: recipient[recipientIndex].latitude,
              longitude: recipient[recipientIndex].longitude,
            }}>
            <FA5Icon name="map-marker-alt" size={24} color={DARK} />
          </Marker>
        )}
        {/*---------------------------------------- DIRECTIONS POLYLINE ----------------------------------------*/}
        {recipient[recipientIndex].name != '' && (
          <MapViewDirections
            apikey={MAPS_API_KEY}
            splitWaypoints={true}
            origin={senderStop}
            destination={recipient[recipientIndex]}
            strokeWidth={3}
            strokeColor={'#EA4335'}
            onReady={onDirectionsReady}
            directionsServiceBaseUrl={`https://maps.googleapis.com/maps/api/directions/json?origin=${
              senderStop.latitude
            },${senderStop.longitude}&destination=${recipient[recipientIndex].latitude},${
              recipient[recipientIndex].longitude
            }&avoid=tolls|highways`}
          />
        )}
      </MapView>
      <View style={styles.footer}>
        {/*---------------------------------------- TESTING BOX START----------------------------------------*/}
        {/* {!postDeliveryLoading && (
          <View style={styles.taskBox}>
            <View style={{height: 300}}>
              <ScrollView>
                <Text style={{fontSize: 8}}>{JSON.stringify({senderStop}, null, 4)}</Text>
                <Text style={{fontSize: 8}}>{JSON.stringify({recipient}, null, 4)}</Text>
              </ScrollView>
            </View>
          </View>
        )} */}
        {/*---------------------------------------- TESTING BOX END----------------------------------------*/}

        {/*---------------------------------------- DELIVERY DETAILS ----------------------------------------*/}
        {/* {senderStop.latitude != 0 && ( */}
        <View style={styles.taskBox}>
          <View style={{flexDirection: 'row', marginHorizontal: 20}}>
            {/*-------------------- ICONS --------------------*/}
            <View style={{width: 34, justifyContent: 'center'}}>
              <YellowIcon set="FontAwesome5" name="map-pin" darkIcon />
              <EIcon name="flow-line" size={26} color={DARK} style={{right: 1}} />
              <YellowIcon set="FontAwesome5" name="map-marker-alt" darkIcon />
            </View>
            <View style={{flex: 1}}>
              {/*-------------------- SENDER DETAILS --------------------*/}
              <TouchableOpacity onPress={onSenderPress}>
                <View
                  style={{
                    height: 50,
                    justifyContent: 'center',
                  }}>
                  <Text style={{fontFamily: 'Rubik-Medium'}}>{senderStop.name}</Text>
                  <Text numberOfLines={1} style={{color: MEDIUM, fontSize: 10}}>
                    {senderStop.formattedAddress}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={{borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: LIGHT}} />
              {/*-------------------- RECIPIENT DETAILS --------------------*/}
              <TouchableOpacity onPress={onRecipientPress}>
                <View style={{height: 50, justifyContent: 'center'}}>
                  {recipient[recipientIndex].name ? (
                    <>
                      <Text style={{fontFamily: 'Rubik-Medium'}}>{recipient[recipientIndex].name}</Text>
                      <Text numberOfLines={1} style={{paddingRight: 10, color: MEDIUM, fontSize: 10}}>
                        {recipient[recipientIndex].formattedAddress}
                      </Text>
                    </>
                  ) : (
                    <Text style={{fontFamily: 'Rubik-Medium'}}>Recipient</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/*---------------------------------------- ROUTE DETAILS ----------------------------------------*/}
          {directions.distance != 0 && (
            <View style={styles.directionsBox}>
              {/*-------------------- DISTANCE --------------------*/}
              <View style={styles.directionDetail}>
                <YellowIcon set="MaterialCommunity" name="map-marker-distance" />
                <Text style={{fontFamily: 'Rubik-Medium', marginLeft: 10, fontSize: 12}}>
                  {directions.distance.toFixed(2)}
                  <Text style={{color: MEDIUM}}> km</Text>
                </Text>
              </View>
              {/*-------------------- DURATION --------------------*/}
              <View style={styles.directionDetail}>
                <YellowIcon set="MaterialCommunity" name="timelapse" />
                <Text style={{fontFamily: 'Rubik-Medium', marginLeft: 10, fontSize: 12}}>
                  {directions.duration.toFixed(0)}
                  <Text style={{color: MEDIUM}}> min</Text>
                </Text>
              </View>
              {/*-------------------- PRICE --------------------*/}
              <View style={styles.directionDetail}>
                <YellowIcon set="Ionicon" name="md-pricetag" />
                {price == 0 || price == '0' ? (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: 12, marginHorizontal: 10, fontFamily: 'Rubik-Medium', color: MEDIUM}}>
                      Price
                    </Text>
                    <ActivityIndicator size={20} color={COLOR} />
                  </View>
                ) : (
                  <Text style={{fontFamily: 'Rubik-Medium', marginLeft: 10}}>
                    ₱{price + recipient[recipientIndex].expressFee}.00
                  </Text>
                )}
              </View>
            </View>
          )}
          {/*-------------------- Express Delivery --------------------*/}
          <View
            style={{
              marginHorizontal: 20,
              marginBottom: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <YellowIcon set="MaterialCommunity" name="clock-fast" />

            <View style={{flex: 1, marginHorizontal: 10}}>
              <Text style={{fontSize: 12, color: DARK, fontFamily: 'Rubik-Medium'}}>Express Delivery</Text>
              <Text style={{fontSize: 10, color: MEDIUM, fontFamily: 'Rubik-Medium'}}>
                Add P40.00, your order will be placed in a high priority.
              </Text>
            </View>
            <View>
              <Switch
                trackColor={{isExpress: LIGHT, true: LIGHT}}
                thumbColor={isExpress ? COLOR : MEDIUM}
                onValueChange={onExpressDeliveryChange}
                value={isExpress}
              />
            </View>
          </View>
        </View>
        {/*---------------------------------------- SUBMIT BUTTON ----------------------------------------*/}
        <TouchableHighlight
          onPress={onSubmit}
          underlayColor={COLOR}
          style={styles.submitBox}
          disabled={directions.distance != 0 && price == 0 ? true : false}>
          <View style={styles.submit}>
            <Text style={{color: COLOR, fontSize: 20}}>
              {directions.distance != 0 && price == 0 ? 'Please Wait' : 'Book'}
            </Text>
          </View>
        </TouchableHighlight>
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

const mapStateToProps = state => ({
  session: state.session,
  constants: state.constants,
});

export default connect(
  mapStateToProps,
  null,
)(ConsumerMap);

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
  taskBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 20,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitBox: {
    margin: 20,
    borderRadius: 10,
  },
  submit: {
    backgroundColor: DARK,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBox: {
    backgroundColor: COLOR,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
    overflow: 'hidden',
  },
  iconBoxDark: {
    backgroundColor: DARK,
    overflow: 'hidden',
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
  },
  directionsBox: {
    height: 50,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: LIGHT,
    alignItems: 'center',
  },
  directionDetail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

// const Buffer = require('buffer').Buffer;

// const token = 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ';
// const decodedString = new Buffer(token, 'base64').toString('ascii');
// const decodedObject = JSON.parse(decodedString);

// console.log(decodedObject);
