import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  Share,
  ActivityIndicator,
  BackHandler,
  Image,
  ScrollView,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, AnimatedRegion, Animated} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {connect} from 'react-redux';
import {currentLocation} from '../../helper';
import {BookingOverlay, LocationPermission} from '../../components';
import {COLOR, DARK, MEDIUM, LIGHT, MAPS_API_KEY} from '../../res/constants';
import {useMutation} from '@apollo/react-hooks';
import {CLIENT, POST_DELIVERY, GET_ORDER_PRICE} from '../../graphql';

import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import EIcon from 'react-native-vector-icons/Entypo';
import FIcon from 'react-native-vector-icons/Feather';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';

import ToktokLogo from '../../assets/icons/ToktokLogo.png';
import {round} from 'lodash';

const toDateFormat = value => {
  return moment(value)
    .format('YYYY-MM-DD HH:mm:ss')
    .toString();
};

const INITIAL_SENDER = session => ({
  latitude: 0,
  longitude: 0,
  formattedAddress: '',
  name: session.user ? `${session.user.person.firstName} ${session.user.person.lastName}` : '',
  mobile: session.user ? `+63${session.user.username}` : '',
  landmark: '',
  orderType: 1,
  scheduledFrom: null,
  scheduledTo: null,
  scheduledDayIndex: '0',
});

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
    scheduledDayIndex: '0',
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

const Map = ({navigation, session}) => {
  navigation.setOptions({
    header: () => null,
  });

  const mapViewRef = useRef(null);

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [recipientIndex, setRecipientIndex] = useState(0); // Used for multiple recipients
  const [allowBooking, setAllowBooking] = useState(false);

  const [region, setRegion] = useState(INITIAL_REGION);
  const [senderStop, setSender] = useState(INITIAL_SENDER(session));
  const [recipient, setRecipient] = useState(INITIAL_RECIPIENT);
  const [directions, setDirections] = useState(INITIAL_DIRECTIONS);
  const [price, setPrice] = useState('0');

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
        setRegion({
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
    // No Location. Set Region to INITIAL_REGION and allow booking
    setRegion(INITIAL_REGION);
    setAllowBooking(true);
  };

  const [postDelivery, {loading: postDeliveryLoading}] = useMutation(POST_DELIVERY, {
    onCompleted: () => {
      setBookingSuccess(true);
      setRecipient(INITIAL_RECIPIENT);
      setDirections(INITIAL_DIRECTIONS);
    },
    onError: ({graphQLErrors, networkError}) => {
      Alert.alert('', 'Something went wrong.');
      // if (graphQLErrors) {
      //   Alert.alert('', graphQLErrors[0].message);
      // }
      // if (networkError) {
      //   Alert.alert('', 'Network error occurred. Please check your internet connection.');
      // }
    },
  });

  const [getOrderPrice, {loading: getOrderPriceLoading}] = useMutation(GET_ORDER_PRICE, {
    ignoreResults: true,
    onCompleted: ({getOrderPrice}) => {
      console.log(`Setting Price at: ${getOrderPrice.toString()}`);
      setPrice(getOrderPrice.toString());
    },
    onError: ({graphQLErrors, networkError}) => {
      Alert.alert('', 'Something went wrong.');
    },
  });

  useEffect(() => {
    // getCurrentLocation();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', function() {
      return true;
    });
    return () => backHandler.remove();
  }, []);

  // If directions.distance or price change, calcuate for order price
  useEffect(() => {
    console.log(`EFFECT Distance: ${directions.distance} || Price: ${price}`);

    if (directions.distance != 0 && price == '0') {
      setTimeout(() => {
        getOrderPrice({
          variables: {
            input: {
              distance: directions.distance,
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

    // Timeout needed to trigger fitToCoordinates
    setTimeout(() => {
      mapViewRef.current.fitToCoordinates(coordinates, {
        edgePadding: {
          right: 20,
          bottom: 650,
          left: 20,
          top: 150,
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
    let emptyRecipient = 0;

    recipient.forEach(rec => {
      if (
        rec.latitude === 0 ||
        rec.longitude === 0 ||
        rec.formattedAddress === '' ||
        rec.name === '' ||
        rec.mobile === ''
      ) {
        emptyRecipient++;
      }
    });

    if (emptyRecipient > 0) {
      Alert.alert('', 'Please enter recipient details.');
      return;
    }

    // Delete this field. Only used in mobile app.
    delete senderStop.accuracy;
    delete senderStop.scheduledDayIndex;
    delete recipient[0].scheduledDayIndex;

    postDelivery({
      variables: {
        input: {
          tokConsumerId: session.user.consumer.id,
          distance: directions.distance,
          duration: directions.duration,
          price: price,
          senderStop: senderStop,
          recipientStop: recipient,
        },
      },
    });
  };

  const onBookSuccessOk = () => {
    setBookingSuccess(false);
    navigation.navigate('CustomerDeliveries');
  };

  return (
    <View style={styles.container}>
      <BookingOverlay visible={postDeliveryLoading || bookingSuccess} done={bookingSuccess} onOkay={onBookSuccessOk} />
      {!allowBooking && <LocationPermission onGrant={onGrantLocation} onDeny={onDenyLocation} />}
      {/*---------------------------------------- MAP ----------------------------------------*/}
      {/* {senderStop.latitude != 0 ? ( */}
      <MapView
        provider={PROVIDER_GOOGLE}
        ref={mapViewRef}
        style={styles.container}
        region={region}
        onRegionChangeComplete={data => {
          setRegion(data);
        }}>
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
          />
        )}
      </MapView>
      {/* }) : (
        <View style={{...StyleSheet.absoluteFillObject, backgroundColor: COLOR}} />
      )} */}
      <View style={styles.footer}>
        {/*---------------------------------------- TESTING BOX START----------------------------------------*/}
        {/* {!postDeliveryLoading && (
          <View style={styles.taskBox}>
            <View style={{height: 300}}>
              <ScrollView>
                <Text style={{fontSize: 8}}>{JSON.stringify({senderStop}, null, 4)}</Text>
                <Text style={{fontSize: 8}}>{JSON.stringify({recipient}, null, 4)}</Text>
                <Text style={{fontSize: 8}}>{senderStop.name != '' ? 'T' : 'F'}</Text>
                <Text style={{fontSize: 8}}>{recipient[recipientIndex].name != '' ? 'T' : 'F'}</Text>
                <Text style={{fontSize: 8}}>{JSON.stringify({directions}, null, 4)}</Text>
                <Text style={{fontSize: 8}}>{JSON.stringify({price}, null, 4)}</Text>
                <Text style={{fontSize: 8}}>{JSON.stringify({session}, null, 4)}</Text>
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
            <View style={{width: 40, justifyContent: 'center'}}>
              <FA5Icon name="map-pin" size={16} color={DARK} style={styles.iconBox} />
              <EIcon name="flow-line" size={26} color={DARK} />
              <FA5Icon name="map-marker-alt" size={16} color={DARK} style={styles.iconBox} />
            </View>
            <View style={{flex: 1}}>
              {/*-------------------- SENDER DETAILS --------------------*/}
              <TouchableOpacity onPress={onSenderPress}>
                <View
                  style={{
                    height: 50,
                    justifyContent: 'center',
                  }}>
                  <Text style={{fontWeight: 'bold'}}>{senderStop.name}</Text>
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
                      <Text style={{fontWeight: 'bold'}}>{recipient[recipientIndex].name}</Text>
                      <Text numberOfLines={1} style={{paddingRight: 10, color: MEDIUM, fontSize: 10}}>
                        {recipient[recipientIndex].formattedAddress}
                      </Text>
                    </>
                  ) : (
                    <Text style={{fontWeight: 'bold'}}>Recipient</Text>
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
                <MCIcon name="map-marker-distance" size={16} color={'white'} style={styles.iconBox} />
                <Text style={{fontWeight: 'bold', marginLeft: 10}}>
                  {directions.distance.toFixed(2)}
                  <Text style={{color: MEDIUM}}> km</Text>
                </Text>
              </View>
              {/*-------------------- DURATION --------------------*/}
              <View style={styles.directionDetail}>
                <MCIcon name="timelapse" size={16} color={'white'} style={styles.iconBox} />
                <Text style={{fontWeight: 'bold', marginLeft: 10}}>
                  {directions.duration.toFixed(0)}
                  <Text style={{color: MEDIUM}}> min</Text>
                </Text>
              </View>
              {/*-------------------- PRICE --------------------*/}
              <View style={styles.directionDetail}>
                <Ionicon name="md-pricetag" size={16} color={'white'} style={styles.iconBox} />
                {price == 0 || price == '0' ? (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: 10, marginLeft: 10, fontWeight: 'bold', color: MEDIUM}}>
                      Calculating...
                    </Text>
                    <ActivityIndicator size={20} color={COLOR} />
                  </View>
                ) : (
                  <Text style={{fontWeight: 'bold', marginLeft: 10}}>₱{price}.00</Text>
                )}
              </View>
            </View>
          )}
        </View>
        {/* )} */}
        {/*---------------------------------------- SUBMIT BUTTON ----------------------------------------*/}
        {/* {senderStop.latitude != 0 && ( */}
        <TouchableHighlight
          onPress={onSubmit}
          underlayColor={COLOR}
          style={styles.submitBox}
          disabled={directions.distance != 0 && price == 0 ? true : false}>
          <View style={styles.submit}>
            <Text style={{color: COLOR, fontSize: 20}}>
              {directions.distance != 0 && price == 0 ? 'Please Wait' : 'Book'}
            </Text>
            {/* <Text style={{color: COLOR, fontSize: 20}}>{session.user.consumer.id}</Text> */}
          </View>
        </TouchableHighlight>
        {/* )} */}
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
});

export default connect(
  mapStateToProps,
  null,
)(Map);

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
  },
  iconBoxDark: {
    backgroundColor: DARK,
    height: 24,
    width: 24,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
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
