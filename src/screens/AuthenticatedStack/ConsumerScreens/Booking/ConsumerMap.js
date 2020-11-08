import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {BookingOverlay, LocationPermission, WelcomeBanner, WelcomeMessage} from '../../../../components';
import {COLOR, DARK, LIGHT, MAPS_API_KEY, MEDIUM} from '../../../../res/constants';
import {GET_ORDER_PRICE, GET_WELCOME_MESSAGE, POST_DELIVERY} from '../../../../graphql';
import MapView, {Marker, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import MapBoxPolyline from '@mapbox/polyline';
import {PERMISSIONS, RESULTS, check} from 'react-native-permissions';
import React, {useEffect, useRef, useState} from 'react';
import {useMutation, useQuery} from '@apollo/react-hooks';

import EIcon from 'react-native-vector-icons/Entypo';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FIcon from 'react-native-vector-icons/Feather';
import MapViewDirections from 'react-native-maps-directions';
import OneSignal from 'react-native-onesignal';
import ToktokLogo from '../../../../assets/icons/ToktokLogo.png';
import {YellowIcon} from '../../../../components/ui';
import {connect} from 'react-redux';
import {currentLocation} from '../../../../helper';
import {onError} from '../../../../util/ErrorUtility';

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

  const onExpressDeliveryChange = (value) => {
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

  // const {data: welcomeData, loading: welcomeLoading, error: welcomeError} = useQuery(GET_WELCOME_MESSAGE);
  // const [showWelcome, setShowWelcome] = useState(false);
  // const hideWelcomeMessage = () => {
  //   setShowWelcome(false);
  // };

  // useEffect(() => {
  //   console.log(welcomeData);
  //   if (welcomeData) {
  //     if (welcomeData.getWelcomeMessage) {
  //       setShowWelcome(true);
  //     }
  //   }
  // }, [welcomeData]);

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
    // OneSignal.init(constants.consumerOneSignalAppId);
    // OneSignal.inFocusDisplaying(2);
  };

  useEffect(() => {
    oneSignalInit();

    setTimeout(() => {
      mapViewRef.current.fitToCoordinates(
        [
          {
            latitude: 14.8088456,
            longitude: 121.0872078,
          },
          {
            latitude: 14.5564054,
            longitude: 120.9935436,
          },
        ],
        {
          edgePadding: {
            right: 20,
            bottom: 850,
            left: 20,
            top: 100,
          },
        },
      );
    }, 3000);

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

  const polylineCoordinates = () => {
    const coordinates = JSON.parse(
      `[{"latitude":14.80867,"longitude":120.99354},{"latitude":14.80868,"longitude":120.99334},{"latitude":14.80869,"longitude":120.99329},{"latitude":14.8087,"longitude":120.99315},{"latitude":14.80871,"longitude":120.99306},{"latitude":14.80871,"longitude":120.99295},{"latitude":14.80872,"longitude":120.99273},{"latitude":14.80873,"longitude":120.99263},{"latitude":14.80873,"longitude":120.99259},{"latitude":14.80874,"longitude":120.99247},{"latitude":14.80876,"longitude":120.99238},{"latitude":14.80876,"longitude":120.9923},{"latitude":14.80877,"longitude":120.99225},{"latitude":14.80878,"longitude":120.9922},{"latitude":14.8088,"longitude":120.99214},{"latitude":14.80882,"longitude":120.99206},{"latitude":14.80888,"longitude":120.99187},{"latitude":14.80901,"longitude":120.99141},{"latitude":14.8091,"longitude":120.99115},{"latitude":14.80919,"longitude":120.99089},{"latitude":14.80921,"longitude":120.99082},{"latitude":14.80924,"longitude":120.99075},{"latitude":14.80928,"longitude":120.99061},{"latitude":14.80933,"longitude":120.99047},{"latitude":14.80937,"longitude":120.99035},{"latitude":14.80943,"longitude":120.99025},{"latitude":14.80949,"longitude":120.99014},{"latitude":14.80956,"longitude":120.99003},{"latitude":14.80964,"longitude":120.98992},{"latitude":14.80971,"longitude":120.98983},{"latitude":14.80975,"longitude":120.98977},{"latitude":14.80977,"longitude":120.98974},{"latitude":14.80978,"longitude":120.98973},{"latitude":14.80982,"longitude":120.98967},{"latitude":14.80986,"longitude":120.98959},{"latitude":14.8099,"longitude":120.98948},{"latitude":14.80997,"longitude":120.98928},{"latitude":14.81003,"longitude":120.98909},{"latitude":14.81007,"longitude":120.9889},{"latitude":14.81019,"longitude":120.98833},{"latitude":14.81028,"longitude":120.988},{"latitude":14.81045,"longitude":120.98731},{"latitude":14.81055,"longitude":120.98685},{"latitude":14.81062,"longitude":120.98655},{"latitude":14.81068,"longitude":120.98627},{"latitude":14.81072,"longitude":120.98599},{"latitude":14.81076,"longitude":120.98571},{"latitude":14.81077,"longitude":120.9856},{"latitude":14.81077,"longitude":120.9856},{"latitude":14.81059,"longitude":120.98557},{"latitude":14.81033,"longitude":120.98555},{"latitude":14.81009,"longitude":120.98549},{"latitude":14.80991,"longitude":120.98545},{"latitude":14.80985,"longitude":120.98544},{"latitude":14.80972,"longitude":120.98545},{"latitude":14.80971,"longitude":120.98545},{"latitude":14.80953,"longitude":120.98548},{"latitude":14.80936,"longitude":120.98551},{"latitude":14.8092,"longitude":120.98555},{"latitude":14.80918,"longitude":120.98555},{"latitude":14.80907,"longitude":120.98558},{"latitude":14.80893,"longitude":120.98564},{"latitude":14.8088,"longitude":120.98569},{"latitude":14.80865,"longitude":120.98574},{"latitude":14.80854,"longitude":120.98577},{"latitude":14.80849,"longitude":120.98579},{"latitude":14.80845,"longitude":120.98581},{"latitude":14.80843,"longitude":120.98585},{"latitude":14.8084,"longitude":120.98589},{"latitude":14.80836,"longitude":120.98604},{"latitude":14.80834,"longitude":120.9861},{"latitude":14.80833,"longitude":120.98612},{"latitude":14.80829,"longitude":120.9862},{"latitude":14.80824,"longitude":120.98626},{"latitude":14.80821,"longitude":120.98631},{"latitude":14.80802,"longitude":120.98655},{"latitude":14.80785,"longitude":120.98659},{"latitude":14.8078,"longitude":120.98659},{"latitude":14.80774,"longitude":120.98659},{"latitude":14.80765,"longitude":120.98657},{"latitude":14.80759,"longitude":120.98655},{"latitude":14.8075,"longitude":120.98652},{"latitude":14.80734,"longitude":120.98647},{"latitude":14.80726,"longitude":120.98645},{"latitude":14.80719,"longitude":120.98644},{"latitude":14.80712,"longitude":120.98645},{"latitude":14.80702,"longitude":120.98646},{"latitude":14.80676,"longitude":120.9865},{"latitude":14.80667,"longitude":120.98653},{"latitude":14.80662,"longitude":120.98658},{"latitude":14.80658,"longitude":120.98663},{"latitude":14.80656,"longitude":120.98668},{"latitude":14.80654,"longitude":120.98674},{"latitude":14.80648,"longitude":120.98681},{"latitude":14.80643,"longitude":120.98686},{"latitude":14.80639,"longitude":120.98687},{"latitude":14.80634,"longitude":120.98687},{"latitude":14.80629,"longitude":120.98688},{"latitude":14.80621,"longitude":120.98688},{"latitude":14.80606,"longitude":120.98686},{"latitude":14.80593,"longitude":120.98685},{"latitude":14.80564,"longitude":120.98678},{"latitude":14.80535,"longitude":120.98682},{"latitude":14.80522,"longitude":120.98681},{"latitude":14.8051,"longitude":120.98678},{"latitude":14.80491,"longitude":120.98674},{"latitude":14.80476,"longitude":120.98673},{"latitude":14.8046,"longitude":120.98676},{"latitude":14.80447,"longitude":120.98679},{"latitude":14.8044,"longitude":120.98681},{"latitude":14.80406,"longitude":120.98692},{"latitude":14.80385,"longitude":120.987},{"latitude":14.80371,"longitude":120.98708},{"latitude":14.8036,"longitude":120.98713},{"latitude":14.80349,"longitude":120.98716},{"latitude":14.80348,"longitude":120.98716},{"latitude":14.80329,"longitude":120.98719},{"latitude":14.80319,"longitude":120.98723},{"latitude":14.80318,"longitude":120.98723},{"latitude":14.80302,"longitude":120.9873},{"latitude":14.80295,"longitude":120.98733},{"latitude":14.80268,"longitude":120.98749},{"latitude":14.80248,"longitude":120.98761},{"latitude":14.80236,"longitude":120.9877},{"latitude":14.80224,"longitude":120.9878},{"latitude":14.80218,"longitude":120.98785},{"latitude":14.80209,"longitude":120.98788},{"latitude":14.80205,"longitude":120.9879},{"latitude":14.80199,"longitude":120.98791},{"latitude":14.80195,"longitude":120.98792},{"latitude":14.80182,"longitude":120.98793},{"latitude":14.80098,"longitude":120.98805},{"latitude":14.80093,"longitude":120.98806},{"latitude":14.80092,"longitude":120.98806},{"latitude":14.80075,"longitude":120.98807},{"latitude":14.80061,"longitude":120.98807},{"latitude":14.8005,"longitude":120.98809},{"latitude":14.80023,"longitude":120.98813},{"latitude":14.8001,"longitude":120.98815},{"latitude":14.8001,"longitude":120.98815},{"latitude":14.80009,"longitude":120.98815},{"latitude":14.79998,"longitude":120.98815},{"latitude":14.79985,"longitude":120.98814},{"latitude":14.79963,"longitude":120.98813},{"latitude":14.79942,"longitude":120.98811},{"latitude":14.79853,"longitude":120.98799},{"latitude":14.79847,"longitude":120.98798},{"latitude":14.79829,"longitude":120.98796},{"latitude":14.79802,"longitude":120.98791},{"latitude":14.798,"longitude":120.98791},{"latitude":14.7979,"longitude":120.98789},{"latitude":14.79776,"longitude":120.98786},{"latitude":14.79771,"longitude":120.98784},{"latitude":14.79727,"longitude":120.98774},{"latitude":14.79712,"longitude":120.98769},{"latitude":14.79666,"longitude":120.9876},{"latitude":14.7964,"longitude":120.98755},{"latitude":14.79611,"longitude":120.98751},{"latitude":14.796,"longitude":120.98749},{"latitude":14.79562,"longitude":120.98737},{"latitude":14.7954,"longitude":120.98731},{"latitude":14.79529,"longitude":120.98729},{"latitude":14.79508,"longitude":120.98728},{"latitude":14.79493,"longitude":120.98728},{"latitude":14.7947,"longitude":120.9873},{"latitude":14.79446,"longitude":120.98735},{"latitude":14.79425,"longitude":120.98739},{"latitude":14.79398,"longitude":120.98745},{"latitude":14.79384,"longitude":120.9875},{"latitude":14.79348,"longitude":120.98767},{"latitude":14.79331,"longitude":120.98776},{"latitude":14.79319,"longitude":120.98783},{"latitude":14.79309,"longitude":120.9879},{"latitude":14.79303,"longitude":120.98794},{"latitude":14.79298,"longitude":120.98799},{"latitude":14.79295,"longitude":120.98803},{"latitude":14.79293,"longitude":120.98805},{"latitude":14.79288,"longitude":120.98812},{"latitude":14.79284,"longitude":120.98817},{"latitude":14.79281,"longitude":120.98822},{"latitude":14.79278,"longitude":120.98829},{"latitude":14.7927,"longitude":120.98845},{"latitude":14.79268,"longitude":120.98849},{"latitude":14.79265,"longitude":120.98851},{"latitude":14.79262,"longitude":120.98853},{"latitude":14.79258,"longitude":120.98857},{"latitude":14.79233,"longitude":120.98869},{"latitude":14.79228,"longitude":120.98871},{"latitude":14.79224,"longitude":120.98872},{"latitude":14.7922,"longitude":120.98872},{"latitude":14.79215,"longitude":120.98871},{"latitude":14.79202,"longitude":120.98868},{"latitude":14.79171,"longitude":120.98859},{"latitude":14.7916,"longitude":120.98857},{"latitude":14.79152,"longitude":120.98857},{"latitude":14.79145,"longitude":120.98856},{"latitude":14.79136,"longitude":120.98856},{"latitude":14.79132,"longitude":120.98857},{"latitude":14.79127,"longitude":120.98858},{"latitude":14.79122,"longitude":120.98858},{"latitude":14.79108,"longitude":120.98857},{"latitude":14.791,"longitude":120.98855},{"latitude":14.79078,"longitude":120.9885},{"latitude":14.79074,"longitude":120.98849},{"latitude":14.79055,"longitude":120.98841},{"latitude":14.7904,"longitude":120.98835},{"latitude":14.79025,"longitude":120.98827},{"latitude":14.79007,"longitude":120.98817},{"latitude":14.7897,"longitude":120.98795},{"latitude":14.78964,"longitude":120.9879},{"latitude":14.78958,"longitude":120.98787},{"latitude":14.78936,"longitude":120.98777},{"latitude":14.78904,"longitude":120.98763},{"latitude":14.78896,"longitude":120.98759},{"latitude":14.78882,"longitude":120.98753},{"latitude":14.78877,"longitude":120.98751},{"latitude":14.78865,"longitude":120.98745},{"latitude":14.78832,"longitude":120.9873},{"latitude":14.78814,"longitude":120.98723},{"latitude":14.78742,"longitude":120.987},{"latitude":14.78734,"longitude":120.98697},{"latitude":14.78719,"longitude":120.98691},{"latitude":14.78718,"longitude":120.98691},{"latitude":14.78704,"longitude":120.98686},{"latitude":14.78694,"longitude":120.98684},{"latitude":14.78684,"longitude":120.98683},{"latitude":14.7867,"longitude":120.98682},{"latitude":14.78631,"longitude":120.98682},{"latitude":14.78626,"longitude":120.98682},{"latitude":14.78595,"longitude":120.98683},{"latitude":14.78578,"longitude":120.98683},{"latitude":14.78563,"longitude":120.98685},{"latitude":14.78542,"longitude":120.98689},{"latitude":14.78533,"longitude":120.98691},{"latitude":14.78516,"longitude":120.98695},{"latitude":14.78506,"longitude":120.98696},{"latitude":14.785,"longitude":120.98697},{"latitude":14.78453,"longitude":120.98703},{"latitude":14.78435,"longitude":120.98705},{"latitude":14.78421,"longitude":120.98705},{"latitude":14.78399,"longitude":120.98704},{"latitude":14.78381,"longitude":120.98704},{"latitude":14.78367,"longitude":120.98703},{"latitude":14.78363,"longitude":120.98703},{"latitude":14.78363,"longitude":120.98703},{"latitude":14.7836,"longitude":120.98685},{"latitude":14.7836,"longitude":120.98681},{"latitude":14.78354,"longitude":120.98645},{"latitude":14.78354,"longitude":120.98643},{"latitude":14.78352,"longitude":120.98635},{"latitude":14.78351,"longitude":120.98629},{"latitude":14.78346,"longitude":120.98614},{"latitude":14.78338,"longitude":120.98595},{"latitude":14.78336,"longitude":120.98589},{"latitude":14.78328,"longitude":120.98566},{"latitude":14.78324,"longitude":120.98554},{"latitude":14.78319,"longitude":120.98542},{"latitude":14.78316,"longitude":120.98534},{"latitude":14.7831,"longitude":120.98521},{"latitude":14.78302,"longitude":120.98502},{"latitude":14.78291,"longitude":120.98481},{"latitude":14.78281,"longitude":120.98461},{"latitude":14.78268,"longitude":120.98437},{"latitude":14.78266,"longitude":120.98432},{"latitude":14.78245,"longitude":120.98391},{"latitude":14.78235,"longitude":120.98369},{"latitude":14.78231,"longitude":120.98358},{"latitude":14.78225,"longitude":120.98337},{"latitude":14.78222,"longitude":120.98325},{"latitude":14.78217,"longitude":120.98307},{"latitude":14.78212,"longitude":120.98289},{"latitude":14.78204,"longitude":120.98256},{"latitude":14.78198,"longitude":120.98238},{"latitude":14.78198,"longitude":120.98237},{"latitude":14.78198,"longitude":120.98236},{"latitude":14.78194,"longitude":120.98226},{"latitude":14.78193,"longitude":120.98221},{"latitude":14.78191,"longitude":120.98218},{"latitude":14.78186,"longitude":120.98202},{"latitude":14.78179,"longitude":120.98177},{"latitude":14.78178,"longitude":120.98172},{"latitude":14.78169,"longitude":120.98116},{"latitude":14.78168,"longitude":120.98114},{"latitude":14.78163,"longitude":120.98084},{"latitude":14.78158,"longitude":120.98047},{"latitude":14.78155,"longitude":120.98026},{"latitude":14.78154,"longitude":120.98018},{"latitude":14.78153,"longitude":120.98003},{"latitude":14.78152,"longitude":120.9798},{"latitude":14.78151,"longitude":120.9797},{"latitude":14.7815,"longitude":120.97958},{"latitude":14.78147,"longitude":120.97947},{"latitude":14.78141,"longitude":120.9793},{"latitude":14.78136,"longitude":120.97916},{"latitude":14.78127,"longitude":120.979},{"latitude":14.78101,"longitude":120.97858},{"latitude":14.781,"longitude":120.97857},{"latitude":14.78095,"longitude":120.97846},{"latitude":14.78081,"longitude":120.97819},{"latitude":14.78029,"longitude":120.97702},{"latitude":14.7802,"longitude":120.97685},{"latitude":14.77989,"longitude":120.97646},{"latitude":14.77966,"longitude":120.9762},{"latitude":14.77957,"longitude":120.97609},{"latitude":14.77953,"longitude":120.97603},{"latitude":14.77948,"longitude":120.97591},{"latitude":14.77923,"longitude":120.97535},{"latitude":14.77918,"longitude":120.97523},{"latitude":14.77902,"longitude":120.9749},{"latitude":14.7789,"longitude":120.97467},{"latitude":14.77876,"longitude":120.97438},{"latitude":14.77846,"longitude":120.97375},{"latitude":14.77842,"longitude":120.97365},{"latitude":14.77824,"longitude":120.97317},{"latitude":14.77821,"longitude":120.97313},{"latitude":14.77791,"longitude":120.97265},{"latitude":14.77734,"longitude":120.97217},{"latitude":14.77706,"longitude":120.97197},{"latitude":14.777,"longitude":120.97193},{"latitude":14.77692,"longitude":120.97189},{"latitude":14.77676,"longitude":120.97182},{"latitude":14.77655,"longitude":120.97173},{"latitude":14.77611,"longitude":120.97152},{"latitude":14.77575,"longitude":120.97133},{"latitude":14.77574,"longitude":120.97132},{"latitude":14.7755,"longitude":120.97119},{"latitude":14.7754,"longitude":120.97113},{"latitude":14.77529,"longitude":120.97107},{"latitude":14.77525,"longitude":120.97103},{"latitude":14.77524,"longitude":120.97103},{"latitude":14.77521,"longitude":120.971},{"latitude":14.77517,"longitude":120.97096},{"latitude":14.77512,"longitude":120.97091},{"latitude":14.77496,"longitude":120.97065},{"latitude":14.77491,"longitude":120.97054},{"latitude":14.77479,"longitude":120.97029},{"latitude":14.77474,"longitude":120.9702},{"latitude":14.77455,"longitude":120.96979},{"latitude":14.77446,"longitude":120.96959},{"latitude":14.77433,"longitude":120.96932},{"latitude":14.77415,"longitude":120.96889},{"latitude":14.774,"longitude":120.96855},{"latitude":14.77388,"longitude":120.96827},{"latitude":14.77375,"longitude":120.96797},{"latitude":14.77352,"longitude":120.96746},{"latitude":14.77345,"longitude":120.96732},{"latitude":14.77337,"longitude":120.96713},{"latitude":14.77332,"longitude":120.96701},{"latitude":14.77329,"longitude":120.96695},{"latitude":14.77326,"longitude":120.96688},{"latitude":14.7731,"longitude":120.96642},{"latitude":14.77297,"longitude":120.96599},{"latitude":14.77295,"longitude":120.96592},{"latitude":14.77289,"longitude":120.96571},{"latitude":14.77284,"longitude":120.96556},{"latitude":14.77279,"longitude":120.96542},{"latitude":14.77264,"longitude":120.96501},{"latitude":14.77262,"longitude":120.96494},{"latitude":14.77239,"longitude":120.96425},{"latitude":14.77224,"longitude":120.96383},{"latitude":14.77213,"longitude":120.9635},{"latitude":14.77207,"longitude":120.9633},{"latitude":14.77189,"longitude":120.96276},{"latitude":14.77178,"longitude":120.96241},{"latitude":14.77172,"longitude":120.96221},{"latitude":14.7717,"longitude":120.96212},{"latitude":14.77168,"longitude":120.96203},{"latitude":14.77167,"longitude":120.96194},{"latitude":14.77167,"longitude":120.96187},{"latitude":14.77168,"longitude":120.96179},{"latitude":14.77169,"longitude":120.96169},{"latitude":14.77173,"longitude":120.96157},{"latitude":14.77176,"longitude":120.96148},{"latitude":14.7718,"longitude":120.96139},{"latitude":14.77204,"longitude":120.96082},{"latitude":14.77213,"longitude":120.96027},{"latitude":14.77215,"longitude":120.96008},{"latitude":14.77216,"longitude":120.95989},{"latitude":14.77214,"longitude":120.95983},{"latitude":14.77212,"longitude":120.9597},{"latitude":14.7721,"longitude":120.95965},{"latitude":14.77209,"longitude":120.95959},{"latitude":14.77205,"longitude":120.95948},{"latitude":14.77205,"longitude":120.95947},{"latitude":14.77201,"longitude":120.95936},{"latitude":14.77198,"longitude":120.9593},{"latitude":14.77196,"longitude":120.95926},{"latitude":14.77189,"longitude":120.95913},{"latitude":14.77181,"longitude":120.95897},{"latitude":14.77175,"longitude":120.95884},{"latitude":14.77167,"longitude":120.95865},{"latitude":14.7716,"longitude":120.9585},{"latitude":14.77153,"longitude":120.95833},{"latitude":14.77152,"longitude":120.95833},{"latitude":14.77152,"longitude":120.95832},{"latitude":14.77152,"longitude":120.95831},{"latitude":14.77151,"longitude":120.9583},{"latitude":14.77151,"longitude":120.95829},{"latitude":14.7715,"longitude":120.95828},{"latitude":14.7715,"longitude":120.95827},{"latitude":14.77149,"longitude":120.95826},{"latitude":14.77149,"longitude":120.95825},{"latitude":14.77148,"longitude":120.95824},{"latitude":14.77148,"longitude":120.95823},{"latitude":14.77147,"longitude":120.95822},{"latitude":14.77147,"longitude":120.95821},{"latitude":14.77147,"longitude":120.9582},{"latitude":14.77146,"longitude":120.9582},{"latitude":14.77146,"longitude":120.95819},{"latitude":14.77146,"longitude":120.95818},{"latitude":14.77145,"longitude":120.95817},{"latitude":14.77145,"longitude":120.95816},{"latitude":14.77145,"longitude":120.95815},{"latitude":14.77144,"longitude":120.95815},{"latitude":14.77144,"longitude":120.95814},{"latitude":14.77144,"longitude":120.95813},{"latitude":14.77143,"longitude":120.95812},{"latitude":14.77143,"longitude":120.95811},{"latitude":14.77142,"longitude":120.9581},{"latitude":14.77142,"longitude":120.95809},{"latitude":14.77141,"longitude":120.95808},{"latitude":14.77141,"longitude":120.95807},{"latitude":14.77141,"longitude":120.95806},{"latitude":14.7714,"longitude":120.95806},{"latitude":14.7714,"longitude":120.95805},{"latitude":14.7714,"longitude":120.95804},{"latitude":14.77139,"longitude":120.95803},{"latitude":14.77139,"longitude":120.95802},{"latitude":14.77138,"longitude":120.95801},{"latitude":14.77138,"longitude":120.958},{"latitude":14.77137,"longitude":120.95799},{"latitude":14.77137,"longitude":120.95798},{"latitude":14.77136,"longitude":120.95797},{"latitude":14.77136,"longitude":120.95796},{"latitude":14.77136,"longitude":120.95795},{"latitude":14.77135,"longitude":120.95795},{"latitude":14.77135,"longitude":120.95794},{"latitude":14.77135,"longitude":120.95793},{"latitude":14.77134,"longitude":120.95793},{"latitude":14.77134,"longitude":120.95792},{"latitude":14.77134,"longitude":120.95791},{"latitude":14.77133,"longitude":120.9579},{"latitude":14.77133,"longitude":120.95789},{"latitude":14.77133,"longitude":120.95788},{"latitude":14.77132,"longitude":120.95788},{"latitude":14.77132,"longitude":120.95787},{"latitude":14.77132,"longitude":120.95786},{"latitude":14.77131,"longitude":120.95785},{"latitude":14.77131,"longitude":120.95784},{"latitude":14.7713,"longitude":120.95783},{"latitude":14.7713,"longitude":120.95782},{"latitude":14.77129,"longitude":120.95781},{"latitude":14.77129,"longitude":120.9578},{"latitude":14.77128,"longitude":120.95779},{"latitude":14.77128,"longitude":120.95778},{"latitude":14.77127,"longitude":120.95777},{"latitude":14.77127,"longitude":120.95776},{"latitude":14.77127,"longitude":120.95775},{"latitude":14.77126,"longitude":120.95775},{"latitude":14.77126,"longitude":120.95774},{"latitude":14.77126,"longitude":120.95773},{"latitude":14.77125,"longitude":120.95773},{"latitude":14.77125,"longitude":120.95772},{"latitude":14.77125,"longitude":120.95771},{"latitude":14.77124,"longitude":120.9577},{"latitude":14.77124,"longitude":120.95769},{"latitude":14.77123,"longitude":120.95768},{"latitude":14.77123,"longitude":120.95767},{"latitude":14.77122,"longitude":120.95766},{"latitude":14.77122,"longitude":120.95765},{"latitude":14.77121,"longitude":120.95764},{"latitude":14.77121,"longitude":120.95763},{"latitude":14.7712,"longitude":120.95762},{"latitude":14.77101,"longitude":120.95724},{"latitude":14.77099,"longitude":120.9572},{"latitude":14.77091,"longitude":120.95708},{"latitude":14.77089,"longitude":120.95706},{"latitude":14.7708,"longitude":120.95696},{"latitude":14.77062,"longitude":120.95675},{"latitude":14.77055,"longitude":120.95668},{"latitude":14.77045,"longitude":120.95655},{"latitude":14.77029,"longitude":120.95635},{"latitude":14.77006,"longitude":120.95605},{"latitude":14.76977,"longitude":120.95569},{"latitude":14.7694,"longitude":120.95524},{"latitude":14.76936,"longitude":120.95519},{"latitude":14.76929,"longitude":120.9551},{"latitude":14.76918,"longitude":120.95495},{"latitude":14.76907,"longitude":120.9548},{"latitude":14.76905,"longitude":120.95477},{"latitude":14.76901,"longitude":120.95472},{"latitude":14.76882,"longitude":120.9544},{"latitude":14.76879,"longitude":120.95436},{"latitude":14.76874,"longitude":120.95426},{"latitude":14.76863,"longitude":120.95405},{"latitude":14.76845,"longitude":120.95373},{"latitude":14.76821,"longitude":120.9532},{"latitude":14.76818,"longitude":120.95315},{"latitude":14.76807,"longitude":120.9529},{"latitude":14.76804,"longitude":120.95282},{"latitude":14.76801,"longitude":120.95277},{"latitude":14.76797,"longitude":120.95268},{"latitude":14.7679,"longitude":120.95257},{"latitude":14.76784,"longitude":120.95249},{"latitude":14.7678,"longitude":120.95244},{"latitude":14.76774,"longitude":120.95238},{"latitude":14.76756,"longitude":120.95223},{"latitude":14.76756,"longitude":120.95222},{"latitude":14.76752,"longitude":120.95219},{"latitude":14.76731,"longitude":120.95199},{"latitude":14.76728,"longitude":120.95197},{"latitude":14.76711,"longitude":120.95182},{"latitude":14.76703,"longitude":120.95176},{"latitude":14.76691,"longitude":120.95169},{"latitude":14.76682,"longitude":120.95165},{"latitude":14.76675,"longitude":120.95162},{"latitude":14.76658,"longitude":120.95156},{"latitude":14.76644,"longitude":120.95151},{"latitude":14.76641,"longitude":120.9515},{"latitude":14.76623,"longitude":120.95145},{"latitude":14.76606,"longitude":120.95141},{"latitude":14.76601,"longitude":120.9514},{"latitude":14.76594,"longitude":120.95138},{"latitude":14.76554,"longitude":120.95128},{"latitude":14.76545,"longitude":120.95128},{"latitude":14.76533,"longitude":120.95127},{"latitude":14.76532,"longitude":120.95127},{"latitude":14.7649,"longitude":120.95126},{"latitude":14.76489,"longitude":120.95126},{"latitude":14.7648,"longitude":120.95125},{"latitude":14.76443,"longitude":120.95123},{"latitude":14.76422,"longitude":120.9512},{"latitude":14.76335,"longitude":120.9511},{"latitude":14.76305,"longitude":120.95105},{"latitude":14.76302,"longitude":120.95104},{"latitude":14.7629,"longitude":120.951},{"latitude":14.76275,"longitude":120.95092},{"latitude":14.76263,"longitude":120.95087},{"latitude":14.76251,"longitude":120.9508},{"latitude":14.76243,"longitude":120.95075},{"latitude":14.76232,"longitude":120.95068},{"latitude":14.76231,"longitude":120.95067},{"latitude":14.76211,"longitude":120.95053},{"latitude":14.76211,"longitude":120.95053},{"latitude":14.76218,"longitude":120.95044},{"latitude":14.76223,"longitude":120.95039},{"latitude":14.7623,"longitude":120.95034},{"latitude":14.76254,"longitude":120.95023},{"latitude":14.76264,"longitude":120.95017},{"latitude":14.76282,"longitude":120.95005},{"latitude":14.763,"longitude":120.94991},{"latitude":14.76314,"longitude":120.9498},{"latitude":14.76318,"longitude":120.94974},{"latitude":14.76318,"longitude":120.94974},{"latitude":14.76321,"longitude":120.94963},{"latitude":14.76322,"longitude":120.94958},{"latitude":14.76322,"longitude":120.94951},{"latitude":14.76323,"longitude":120.94944},{"latitude":14.76322,"longitude":120.9494},{"latitude":14.76321,"longitude":120.94935},{"latitude":14.7632,"longitude":120.9493},{"latitude":14.76318,"longitude":120.94926},{"latitude":14.76314,"longitude":120.94919},{"latitude":14.76311,"longitude":120.94914},{"latitude":14.7631,"longitude":120.94913},{"latitude":14.76303,"longitude":120.94906},{"latitude":14.76287,"longitude":120.94887},{"latitude":14.76264,"longitude":120.94867},{"latitude":14.76259,"longitude":120.94862},{"latitude":14.76239,"longitude":120.94845},{"latitude":14.76205,"longitude":120.94815},{"latitude":14.76205,"longitude":120.94815},{"latitude":14.76193,"longitude":120.94829},{"latitude":14.76181,"longitude":120.94843},{"latitude":14.7617,"longitude":120.94857},{"latitude":14.76158,"longitude":120.94871},{"latitude":14.76146,"longitude":120.94885},{"latitude":14.76134,"longitude":120.94899},{"latitude":14.76123,"longitude":120.94913},{"latitude":14.76111,"longitude":120.94927},{"latitude":14.76104,"longitude":120.94935},{"latitude":14.76099,"longitude":120.94941},{"latitude":14.76094,"longitude":120.94947},{"latitude":14.7609,"longitude":120.94953},{"latitude":14.76085,"longitude":120.94958},{"latitude":14.76078,"longitude":120.94967},{"latitude":14.76066,"longitude":120.94981},{"latitude":14.76054,"longitude":120.94995},{"latitude":14.76053,"longitude":120.94996},{"latitude":14.76046,"longitude":120.95004},{"latitude":14.76038,"longitude":120.95015},{"latitude":14.7603,"longitude":120.95025},{"latitude":14.76026,"longitude":120.95029},{"latitude":14.76003,"longitude":120.95057},{"latitude":14.75969,"longitude":120.95098},{"latitude":14.75956,"longitude":120.95113},{"latitude":14.75956,"longitude":120.95114},{"latitude":14.75951,"longitude":120.9512},{"latitude":14.75949,"longitude":120.95122},{"latitude":14.75942,"longitude":120.95131},{"latitude":14.75932,"longitude":120.95142},{"latitude":14.75929,"longitude":120.95146},{"latitude":14.75915,"longitude":120.95161},{"latitude":14.75902,"longitude":120.95174},{"latitude":14.75892,"longitude":120.95183},{"latitude":14.75888,"longitude":120.95186},{"latitude":14.75874,"longitude":120.95197},{"latitude":14.75869,"longitude":120.952},{"latitude":14.75858,"longitude":120.95206},{"latitude":14.75849,"longitude":120.95212},{"latitude":14.75843,"longitude":120.95215},{"latitude":14.75827,"longitude":120.95224},{"latitude":14.75811,"longitude":120.95232},{"latitude":14.75794,"longitude":120.95239},{"latitude":14.75778,"longitude":120.95247},{"latitude":14.75761,"longitude":120.95255},{"latitude":14.75745,"longitude":120.95262},{"latitude":14.75735,"longitude":120.95267},{"latitude":14.75655,"longitude":120.95307},{"latitude":14.75629,"longitude":120.9532},{"latitude":14.7562,"longitude":120.95325},{"latitude":14.75593,"longitude":120.95337},{"latitude":14.75496,"longitude":120.95386},{"latitude":14.75489,"longitude":120.95389},{"latitude":14.75471,"longitude":120.95398},{"latitude":14.75464,"longitude":120.95402},{"latitude":14.75463,"longitude":120.95402},{"latitude":14.75461,"longitude":120.95403},{"latitude":14.75448,"longitude":120.9541},{"latitude":14.75432,"longitude":120.95418},{"latitude":14.75418,"longitude":120.95424},{"latitude":14.75395,"longitude":120.95436},{"latitude":14.75367,"longitude":120.95452},{"latitude":14.75366,"longitude":120.95452},{"latitude":14.7535,"longitude":120.9546},{"latitude":14.75334,"longitude":120.95468},{"latitude":14.75297,"longitude":120.95485},{"latitude":14.75288,"longitude":120.9549},{"latitude":14.75281,"longitude":120.95493},{"latitude":14.75267,"longitude":120.955},{"latitude":14.75254,"longitude":120.95507},{"latitude":14.75251,"longitude":120.95508},{"latitude":14.75248,"longitude":120.9551},{"latitude":14.75244,"longitude":120.95513},{"latitude":14.75241,"longitude":120.95515},{"latitude":14.75228,"longitude":120.95522},{"latitude":14.75171,"longitude":120.95549},{"latitude":14.75122,"longitude":120.95573},{"latitude":14.75065,"longitude":120.95601},{"latitude":14.74976,"longitude":120.95645},{"latitude":14.74968,"longitude":120.95649},{"latitude":14.74951,"longitude":120.95657},{"latitude":14.74935,"longitude":120.95665},{"latitude":14.74919,"longitude":120.95673},{"latitude":14.74903,"longitude":120.95681},{"latitude":14.74795,"longitude":120.95738},{"latitude":14.74774,"longitude":120.95746},{"latitude":14.74761,"longitude":120.95751},{"latitude":14.74722,"longitude":120.95763},{"latitude":14.74675,"longitude":120.95779},{"latitude":14.74641,"longitude":120.95791},{"latitude":14.74635,"longitude":120.95793},{"latitude":14.74631,"longitude":120.95792},{"latitude":14.7463,"longitude":120.95791},{"latitude":14.74628,"longitude":120.95792},{"latitude":14.74623,"longitude":120.95793},{"latitude":14.74612,"longitude":120.95797},{"latitude":14.74589,"longitude":120.95808},{"latitude":14.74538,"longitude":120.95824},{"latitude":14.74503,"longitude":120.95836},{"latitude":14.74495,"longitude":120.95838},{"latitude":14.74478,"longitude":120.95844},{"latitude":14.74461,"longitude":120.9585},{"latitude":14.74444,"longitude":120.95856},{"latitude":14.74427,"longitude":120.95862},{"latitude":14.7441,"longitude":120.95868},{"latitude":14.74393,"longitude":120.95874},{"latitude":14.74363,"longitude":120.95885},{"latitude":14.74338,"longitude":120.95894},{"latitude":14.74292,"longitude":120.95913},{"latitude":14.74269,"longitude":120.95922},{"latitude":14.74237,"longitude":120.95932},{"latitude":14.74204,"longitude":120.95944},{"latitude":14.74182,"longitude":120.95951},{"latitude":14.74174,"longitude":120.95954},{"latitude":14.74164,"longitude":120.95957},{"latitude":14.74154,"longitude":120.9596},{"latitude":14.74139,"longitude":120.95965},{"latitude":14.74136,"longitude":120.95971},{"latitude":14.74135,"longitude":120.95971},{"latitude":14.7412,"longitude":120.95977},{"latitude":14.7411,"longitude":120.9598},{"latitude":14.74104,"longitude":120.95982},{"latitude":14.74089,"longitude":120.95988},{"latitude":14.74073,"longitude":120.95993},{"latitude":14.74058,"longitude":120.95999},{"latitude":14.74042,"longitude":120.96004},{"latitude":14.74017,"longitude":120.96013},{"latitude":14.74004,"longitude":120.96017},{"latitude":14.73983,"longitude":120.96024},{"latitude":14.73961,"longitude":120.9603},{"latitude":14.73941,"longitude":120.96034},{"latitude":14.73918,"longitude":120.9604},{"latitude":14.73905,"longitude":120.96043},{"latitude":14.7385,"longitude":120.96057},{"latitude":14.73845,"longitude":120.96058},{"latitude":14.73828,"longitude":120.96063},{"latitude":14.7381,"longitude":120.96067},{"latitude":14.73771,"longitude":120.96077},{"latitude":14.73708,"longitude":120.96093},{"latitude":14.73626,"longitude":120.96114},{"latitude":14.73582,"longitude":120.96124},{"latitude":14.73533,"longitude":120.96137},{"latitude":14.73508,"longitude":120.96142},{"latitude":14.73503,"longitude":120.96142},{"latitude":14.73498,"longitude":120.96142},{"latitude":14.73483,"longitude":120.96142},{"latitude":14.73482,"longitude":120.96142},{"latitude":14.73464,"longitude":120.96142},{"latitude":14.73452,"longitude":120.96142},{"latitude":14.73445,"longitude":120.96142},{"latitude":14.73426,"longitude":120.96142},{"latitude":14.73422,"longitude":120.96142},{"latitude":14.73409,"longitude":120.96141},{"latitude":14.73404,"longitude":120.96141},{"latitude":14.73403,"longitude":120.96141},{"latitude":14.73386,"longitude":120.96141},{"latitude":14.73368,"longitude":120.9614},{"latitude":14.7335,"longitude":120.9614},{"latitude":14.73332,"longitude":120.9614},{"latitude":14.73314,"longitude":120.96139},{"latitude":14.73308,"longitude":120.96139},{"latitude":14.73296,"longitude":120.96139},{"latitude":14.73278,"longitude":120.96139},{"latitude":14.73263,"longitude":120.96138},{"latitude":14.7326,"longitude":120.96138},{"latitude":14.73242,"longitude":120.96138},{"latitude":14.73228,"longitude":120.96137},{"latitude":14.73224,"longitude":120.96137},{"latitude":14.73107,"longitude":120.96134},{"latitude":14.73089,"longitude":120.96134},{"latitude":14.73071,"longitude":120.96134},{"latitude":14.73053,"longitude":120.96133},{"latitude":14.73035,"longitude":120.96133},{"latitude":14.73027,"longitude":120.96132},{"latitude":14.72962,"longitude":120.9613},{"latitude":14.72944,"longitude":120.96129},{"latitude":14.72925,"longitude":120.96129},{"latitude":14.72907,"longitude":120.96129},{"latitude":14.72888,"longitude":120.96128},{"latitude":14.7287,"longitude":120.96128},{"latitude":14.72852,"longitude":120.96127},{"latitude":14.72833,"longitude":120.96127},{"latitude":14.72815,"longitude":120.96127},{"latitude":14.72799,"longitude":120.96126},{"latitude":14.72796,"longitude":120.96126},{"latitude":14.72788,"longitude":120.96126},{"latitude":14.72786,"longitude":120.96126},{"latitude":14.72776,"longitude":120.96125},{"latitude":14.72765,"longitude":120.96125},{"latitude":14.72755,"longitude":120.96125},{"latitude":14.72736,"longitude":120.96122},{"latitude":14.72719,"longitude":120.96117},{"latitude":14.72703,"longitude":120.96112},{"latitude":14.72673,"longitude":120.961},{"latitude":14.72633,"longitude":120.96085},{"latitude":14.72621,"longitude":120.9608},{"latitude":14.72612,"longitude":120.96077},{"latitude":14.726,"longitude":120.96073},{"latitude":14.72593,"longitude":120.9607},{"latitude":14.72573,"longitude":120.96063},{"latitude":14.72535,"longitude":120.96048},{"latitude":14.72512,"longitude":120.9604},{"latitude":14.72442,"longitude":120.96014},{"latitude":14.72427,"longitude":120.96009},{"latitude":14.72237,"longitude":120.95934},{"latitude":14.72219,"longitude":120.95928},{"latitude":14.72186,"longitude":120.95913},{"latitude":14.72168,"longitude":120.95905},{"latitude":14.72146,"longitude":120.95892},{"latitude":14.72108,"longitude":120.95869},{"latitude":14.72099,"longitude":120.95863},{"latitude":14.72098,"longitude":120.95863},{"latitude":14.72087,"longitude":120.95856},{"latitude":14.72081,"longitude":120.95852},{"latitude":14.72073,"longitude":120.95847},{"latitude":14.72062,"longitude":120.9584},{"latitude":14.72058,"longitude":120.95837},{"latitude":14.72053,"longitude":120.95834},{"latitude":14.72041,"longitude":120.95827},{"latitude":14.71971,"longitude":120.9579},{"latitude":14.71946,"longitude":120.95776},{"latitude":14.7193,"longitude":120.95768},{"latitude":14.71891,"longitude":120.95747},{"latitude":14.7187,"longitude":120.95737},{"latitude":14.71865,"longitude":120.95734},{"latitude":14.71848,"longitude":120.95726},{"latitude":14.71837,"longitude":120.95722},{"latitude":14.71833,"longitude":120.95721},{"latitude":14.71822,"longitude":120.95719},{"latitude":14.71809,"longitude":120.95715},{"latitude":14.71806,"longitude":120.95715},{"latitude":14.71797,"longitude":120.95713},{"latitude":14.71792,"longitude":120.95713},{"latitude":14.71786,"longitude":120.95713},{"latitude":14.71779,"longitude":120.95714},{"latitude":14.71773,"longitude":120.95715},{"latitude":14.71765,"longitude":120.95716},{"latitude":14.71759,"longitude":120.95717},{"latitude":14.71751,"longitude":120.9572},{"latitude":14.71741,"longitude":120.95723},{"latitude":14.71725,"longitude":120.95728},{"latitude":14.71714,"longitude":120.95731},{"latitude":14.71669,"longitude":120.95746},{"latitude":14.71644,"longitude":120.95754},{"latitude":14.7163,"longitude":120.95759},{"latitude":14.71552,"longitude":120.95783},{"latitude":14.71531,"longitude":120.9579},{"latitude":14.71488,"longitude":120.95804},{"latitude":14.71456,"longitude":120.95815},{"latitude":14.71424,"longitude":120.95825},{"latitude":14.714,"longitude":120.95833},{"latitude":14.7138,"longitude":120.95839},{"latitude":14.71363,"longitude":120.95845},{"latitude":14.71346,"longitude":120.9585},{"latitude":14.71324,"longitude":120.95855},{"latitude":14.71309,"longitude":120.9586},{"latitude":14.71295,"longitude":120.95865},{"latitude":14.71289,"longitude":120.95866},{"latitude":14.71263,"longitude":120.95876},{"latitude":14.71206,"longitude":120.95894},{"latitude":14.71162,"longitude":120.95907},{"latitude":14.7113,"longitude":120.95918},{"latitude":14.71105,"longitude":120.95926},{"latitude":14.71083,"longitude":120.95933},{"latitude":14.71034,"longitude":120.95948},{"latitude":14.71006,"longitude":120.95958},{"latitude":14.70995,"longitude":120.95961},{"latitude":14.70953,"longitude":120.95975},{"latitude":14.70939,"longitude":120.9598},{"latitude":14.70925,"longitude":120.95984},{"latitude":14.70921,"longitude":120.95985},{"latitude":14.70856,"longitude":120.96006},{"latitude":14.70761,"longitude":120.96037},{"latitude":14.70721,"longitude":120.96049},{"latitude":14.70693,"longitude":120.96057},{"latitude":14.70654,"longitude":120.9607},{"latitude":14.706,"longitude":120.96087},{"latitude":14.70494,"longitude":120.96122},{"latitude":14.70479,"longitude":120.96127},{"latitude":14.70447,"longitude":120.96137},{"latitude":14.7043,"longitude":120.96142},{"latitude":14.70412,"longitude":120.96148},{"latitude":14.7035,"longitude":120.96169},{"latitude":14.70313,"longitude":120.96181},{"latitude":14.70221,"longitude":120.96211},{"latitude":14.70214,"longitude":120.96213},{"latitude":14.70196,"longitude":120.96218},{"latitude":14.7018,"longitude":120.96223},{"latitude":14.70161,"longitude":120.96229},{"latitude":14.7015,"longitude":120.96233},{"latitude":14.70139,"longitude":120.96236},{"latitude":14.70096,"longitude":120.96249},{"latitude":14.70058,"longitude":120.96261},{"latitude":14.69982,"longitude":120.96285},{"latitude":14.69963,"longitude":120.96291},{"latitude":14.69945,"longitude":120.96297},{"latitude":14.69927,"longitude":120.96302},{"latitude":14.69909,"longitude":120.96308},{"latitude":14.69891,"longitude":120.96314},{"latitude":14.69873,"longitude":120.9632},{"latitude":14.69855,"longitude":120.96326},{"latitude":14.69843,"longitude":120.9633},{"latitude":14.69833,"longitude":120.96333},{"latitude":14.6982,"longitude":120.96337},{"latitude":14.69804,"longitude":120.96342},{"latitude":14.69769,"longitude":120.96354},{"latitude":14.69696,"longitude":120.96377},{"latitude":14.69661,"longitude":120.96388},{"latitude":14.6963,"longitude":120.96398},{"latitude":14.69601,"longitude":120.96409},{"latitude":14.6957,"longitude":120.96419},{"latitude":14.69562,"longitude":120.96421},{"latitude":14.69553,"longitude":120.96421},{"latitude":14.69543,"longitude":120.96421},{"latitude":14.69541,"longitude":120.96421},{"latitude":14.69436,"longitude":120.96413},{"latitude":14.69421,"longitude":120.96412},{"latitude":14.6942,"longitude":120.96411},{"latitude":14.69415,"longitude":120.96408},{"latitude":14.69412,"longitude":120.96407},{"latitude":14.69409,"longitude":120.96406},{"latitude":14.69403,"longitude":120.96406},{"latitude":14.69385,"longitude":120.96404},{"latitude":14.69367,"longitude":120.96403},{"latitude":14.69349,"longitude":120.96402},{"latitude":14.69336,"longitude":120.96401},{"latitude":14.69332,"longitude":120.96401},{"latitude":14.69324,"longitude":120.96401},{"latitude":14.69314,"longitude":120.96402},{"latitude":14.69306,"longitude":120.96404},{"latitude":14.69296,"longitude":120.96407},{"latitude":14.69295,"longitude":120.96407},{"latitude":14.69286,"longitude":120.96411},{"latitude":14.69281,"longitude":120.96416},{"latitude":14.6927,"longitude":120.96427},{"latitude":14.69266,"longitude":120.96431},{"latitude":14.69263,"longitude":120.96434},{"latitude":14.69258,"longitude":120.96441},{"latitude":14.69254,"longitude":120.96447},{"latitude":14.69251,"longitude":120.96452},{"latitude":14.6925,"longitude":120.96457},{"latitude":14.69249,"longitude":120.96458},{"latitude":14.69247,"longitude":120.96463},{"latitude":14.69246,"longitude":120.96469},{"latitude":14.69245,"longitude":120.96474},{"latitude":14.69245,"longitude":120.9648},{"latitude":14.69245,"longitude":120.96484},{"latitude":14.69245,"longitude":120.96488},{"latitude":14.69245,"longitude":120.96492},{"latitude":14.69245,"longitude":120.96495},{"latitude":14.69246,"longitude":120.96499},{"latitude":14.69247,"longitude":120.96502},{"latitude":14.69251,"longitude":120.9652},{"latitude":14.69258,"longitude":120.96542},{"latitude":14.69263,"longitude":120.96559},{"latitude":14.69264,"longitude":120.96566},{"latitude":14.69269,"longitude":120.96579},{"latitude":14.69274,"longitude":120.96597},{"latitude":14.69279,"longitude":120.96616},{"latitude":14.69282,"longitude":120.96696},{"latitude":14.69287,"longitude":120.96701},{"latitude":14.69286,"longitude":120.96793},{"latitude":14.69285,"longitude":120.96824},{"latitude":14.69285,"longitude":120.96846},{"latitude":14.69285,"longitude":120.9686},{"latitude":14.69285,"longitude":120.96864},{"latitude":14.69282,"longitude":120.9688},{"latitude":14.6928,"longitude":120.96893},{"latitude":14.69275,"longitude":120.96912},{"latitude":14.69273,"longitude":120.96916},{"latitude":14.69262,"longitude":120.96949},{"latitude":14.69256,"longitude":120.96965},{"latitude":14.6925,"longitude":120.96981},{"latitude":14.69247,"longitude":120.96991},{"latitude":14.69245,"longitude":120.96996},{"latitude":14.69243,"longitude":120.97004},{"latitude":14.69236,"longitude":120.97022},{"latitude":14.6923,"longitude":120.97041},{"latitude":14.69225,"longitude":120.97055},{"latitude":14.69224,"longitude":120.97059},{"latitude":14.6922,"longitude":120.97071},{"latitude":14.69217,"longitude":120.97081},{"latitude":14.69215,"longitude":120.97085},{"latitude":14.69215,"longitude":120.97088},{"latitude":14.69214,"longitude":120.9709},{"latitude":14.69206,"longitude":120.97114},{"latitude":14.69205,"longitude":120.97116},{"latitude":14.69202,"longitude":120.97123},{"latitude":14.69196,"longitude":120.97139},{"latitude":14.69183,"longitude":120.97179},{"latitude":14.6918,"longitude":120.97187},{"latitude":14.69172,"longitude":120.97208},{"latitude":14.69169,"longitude":120.97217},{"latitude":14.69165,"longitude":120.97226},{"latitude":14.69163,"longitude":120.97229},{"latitude":14.69161,"longitude":120.97233},{"latitude":14.69157,"longitude":120.97242},{"latitude":14.69156,"longitude":120.97244},{"latitude":14.69144,"longitude":120.97264},{"latitude":14.69143,"longitude":120.97267},{"latitude":14.69133,"longitude":120.97283},{"latitude":14.69118,"longitude":120.97306},{"latitude":14.69109,"longitude":120.97317},{"latitude":14.69099,"longitude":120.97328},{"latitude":14.69087,"longitude":120.97341},{"latitude":14.69072,"longitude":120.97353},{"latitude":14.69051,"longitude":120.97368},{"latitude":14.69032,"longitude":120.97381},{"latitude":14.69023,"longitude":120.97386},{"latitude":14.69004,"longitude":120.97395},{"latitude":14.68994,"longitude":120.974},{"latitude":14.68967,"longitude":120.97414},{"latitude":14.68896,"longitude":120.97452},{"latitude":14.68879,"longitude":120.97461},{"latitude":14.68859,"longitude":120.97473},{"latitude":14.68816,"longitude":120.97497},{"latitude":14.68769,"longitude":120.97522},{"latitude":14.68694,"longitude":120.97568},{"latitude":14.68676,"longitude":120.97579},{"latitude":14.68654,"longitude":120.97592},{"latitude":14.68614,"longitude":120.97614},{"latitude":14.68614,"longitude":120.97614},{"latitude":14.68602,"longitude":120.9759},{"latitude":14.68584,"longitude":120.9755},{"latitude":14.68577,"longitude":120.97538},{"latitude":14.6857,"longitude":120.97528},{"latitude":14.68568,"longitude":120.97526},{"latitude":14.68564,"longitude":120.97522},{"latitude":14.68561,"longitude":120.97518},{"latitude":14.6856,"longitude":120.97516},{"latitude":14.6856,"longitude":120.97513},{"latitude":14.68559,"longitude":120.97512},{"latitude":14.68559,"longitude":120.9751},{"latitude":14.68559,"longitude":120.97509},{"latitude":14.68558,"longitude":120.97505},{"latitude":14.68557,"longitude":120.975},{"latitude":14.68557,"longitude":120.97499},{"latitude":14.68557,"longitude":120.97499},{"latitude":14.68557,"longitude":120.975},{"latitude":14.68558,"longitude":120.97505},{"latitude":14.68559,"longitude":120.97509},{"latitude":14.68559,"longitude":120.9751},{"latitude":14.68559,"longitude":120.97512},{"latitude":14.6856,"longitude":120.97513},{"latitude":14.6856,"longitude":120.97516},{"latitude":14.68561,"longitude":120.97518},{"latitude":14.68564,"longitude":120.97522},{"latitude":14.68568,"longitude":120.97526},{"latitude":14.6857,"longitude":120.97528},{"latitude":14.68577,"longitude":120.97538},{"latitude":14.68584,"longitude":120.9755},{"latitude":14.68602,"longitude":120.9759},{"latitude":14.68614,"longitude":120.97614},{"latitude":14.68614,"longitude":120.97614},{"latitude":14.68583,"longitude":120.97632},{"latitude":14.68502,"longitude":120.97675},{"latitude":14.68495,"longitude":120.97679},{"latitude":14.6847,"longitude":120.97693},{"latitude":14.68464,"longitude":120.97696},{"latitude":14.6845,"longitude":120.97702},{"latitude":14.68444,"longitude":120.97707},{"latitude":14.68367,"longitude":120.9775},{"latitude":14.68331,"longitude":120.9777},{"latitude":14.68286,"longitude":120.97796},{"latitude":14.68249,"longitude":120.97815},{"latitude":14.68231,"longitude":120.97826},{"latitude":14.68217,"longitude":120.97834},{"latitude":14.68207,"longitude":120.9784},{"latitude":14.68196,"longitude":120.97845},{"latitude":14.68133,"longitude":120.97879},{"latitude":14.68111,"longitude":120.9789},{"latitude":14.68101,"longitude":120.97894},{"latitude":14.681,"longitude":120.97895},{"latitude":14.68084,"longitude":120.97902},{"latitude":14.68069,"longitude":120.97908},{"latitude":14.68056,"longitude":120.97913},{"latitude":14.68025,"longitude":120.97927},{"latitude":14.67955,"longitude":120.97953},{"latitude":14.67936,"longitude":120.9796},{"latitude":14.67913,"longitude":120.97969},{"latitude":14.679,"longitude":120.97974},{"latitude":14.67877,"longitude":120.97983},{"latitude":14.67872,"longitude":120.97985},{"latitude":14.67857,"longitude":120.97991},{"latitude":14.67856,"longitude":120.97991},{"latitude":14.67749,"longitude":120.98032},{"latitude":14.67742,"longitude":120.98035},{"latitude":14.6772,"longitude":120.98042},{"latitude":14.67715,"longitude":120.98045},{"latitude":14.67697,"longitude":120.98052},{"latitude":14.67679,"longitude":120.9806},{"latitude":14.67572,"longitude":120.98098},{"latitude":14.67568,"longitude":120.981},{"latitude":14.67566,"longitude":120.98101},{"latitude":14.67549,"longitude":120.98108},{"latitude":14.67531,"longitude":120.98114},{"latitude":14.67514,"longitude":120.98121},{"latitude":14.67497,"longitude":120.98128},{"latitude":14.67479,"longitude":120.98135},{"latitude":14.67462,"longitude":120.98142},{"latitude":14.67445,"longitude":120.98149},{"latitude":14.67429,"longitude":120.98154},{"latitude":14.67382,"longitude":120.98172},{"latitude":14.67375,"longitude":120.98175},{"latitude":14.6735,"longitude":120.98184},{"latitude":14.67317,"longitude":120.98199},{"latitude":14.67314,"longitude":120.982},{"latitude":14.67311,"longitude":120.98201},{"latitude":14.67303,"longitude":120.98203},{"latitude":14.67298,"longitude":120.98204},{"latitude":14.67295,"longitude":120.98205},{"latitude":14.67291,"longitude":120.98206},{"latitude":14.67287,"longitude":120.98206},{"latitude":14.67279,"longitude":120.98207},{"latitude":14.67272,"longitude":120.98208},{"latitude":14.67266,"longitude":120.98209},{"latitude":14.67262,"longitude":120.98209},{"latitude":14.67244,"longitude":120.9821},{"latitude":14.67223,"longitude":120.98208},{"latitude":14.67193,"longitude":120.98208},{"latitude":14.67163,"longitude":120.98207},{"latitude":14.67142,"longitude":120.98207},{"latitude":14.67087,"longitude":120.98206},{"latitude":14.67052,"longitude":120.98205},{"latitude":14.67044,"longitude":120.98206},{"latitude":14.67042,"longitude":120.98206},{"latitude":14.67024,"longitude":120.98205},{"latitude":14.67006,"longitude":120.98205},{"latitude":14.66997,"longitude":120.98201},{"latitude":14.66956,"longitude":120.982},{"latitude":14.66902,"longitude":120.98198},{"latitude":14.66849,"longitude":120.982},{"latitude":14.66837,"longitude":120.98202},{"latitude":14.66818,"longitude":120.98206},{"latitude":14.66807,"longitude":120.9821},{"latitude":14.66784,"longitude":120.9822},{"latitude":14.66764,"longitude":120.98233},{"latitude":14.66643,"longitude":120.98348},{"latitude":14.66603,"longitude":120.98383},{"latitude":14.66591,"longitude":120.98393},{"latitude":14.66576,"longitude":120.98402},{"latitude":14.66558,"longitude":120.98412},{"latitude":14.66547,"longitude":120.98416},{"latitude":14.66529,"longitude":120.98419},{"latitude":14.66517,"longitude":120.9842},{"latitude":14.66505,"longitude":120.98419},{"latitude":14.66457,"longitude":120.98419},{"latitude":14.66439,"longitude":120.98418},{"latitude":14.66421,"longitude":120.98418},{"latitude":14.66404,"longitude":120.98417},{"latitude":14.66386,"longitude":120.98416},{"latitude":14.66368,"longitude":120.98416},{"latitude":14.66357,"longitude":120.98415},{"latitude":14.66291,"longitude":120.98414},{"latitude":14.66271,"longitude":120.98413},{"latitude":14.66223,"longitude":120.98411},{"latitude":14.66173,"longitude":120.98408},{"latitude":14.66119,"longitude":120.98407},{"latitude":14.66108,"longitude":120.98407},{"latitude":14.66096,"longitude":120.98405},{"latitude":14.66009,"longitude":120.984},{"latitude":14.65874,"longitude":120.98398},{"latitude":14.65803,"longitude":120.98397},{"latitude":14.65798,"longitude":120.98397},{"latitude":14.65775,"longitude":120.98395},{"latitude":14.65765,"longitude":120.98394},{"latitude":14.65758,"longitude":120.98392},{"latitude":14.65754,"longitude":120.98391},{"latitude":14.65745,"longitude":120.98387},{"latitude":14.65745,"longitude":120.98387},{"latitude":14.65743,"longitude":120.98383},{"latitude":14.6574,"longitude":120.98378},{"latitude":14.65737,"longitude":120.98374},{"latitude":14.65734,"longitude":120.98371},{"latitude":14.6573,"longitude":120.98368},{"latitude":14.65726,"longitude":120.98366},{"latitude":14.65721,"longitude":120.98364},{"latitude":14.65716,"longitude":120.98363},{"latitude":14.65712,"longitude":120.98363},{"latitude":14.65707,"longitude":120.98363},{"latitude":14.65703,"longitude":120.98364},{"latitude":14.65699,"longitude":120.98366},{"latitude":14.65694,"longitude":120.98368},{"latitude":14.65691,"longitude":120.98371},{"latitude":14.65688,"longitude":120.98374},{"latitude":14.65685,"longitude":120.98378},{"latitude":14.65683,"longitude":120.98382},{"latitude":14.65681,"longitude":120.98388},{"latitude":14.6568,"longitude":120.9839},{"latitude":14.6568,"longitude":120.98393},{"latitude":14.65679,"longitude":120.98395},{"latitude":14.65679,"longitude":120.98398},{"latitude":14.65679,"longitude":120.984},{"latitude":14.65679,"longitude":120.98403},{"latitude":14.6568,"longitude":120.98405},{"latitude":14.6568,"longitude":120.98407},{"latitude":14.65682,"longitude":120.98412},{"latitude":14.65684,"longitude":120.98416},{"latitude":14.65687,"longitude":120.9842},{"latitude":14.6569,"longitude":120.98423},{"latitude":14.65693,"longitude":120.98426},{"latitude":14.65697,"longitude":120.98428},{"latitude":14.65701,"longitude":120.9843},{"latitude":14.65705,"longitude":120.98432},{"latitude":14.65707,"longitude":120.98487},{"latitude":14.65708,"longitude":120.9855},{"latitude":14.65709,"longitude":120.98598},{"latitude":14.65709,"longitude":120.98621},{"latitude":14.6571,"longitude":120.98696},{"latitude":14.65711,"longitude":120.98761},{"latitude":14.65711,"longitude":120.98798},{"latitude":14.65712,"longitude":120.98824},{"latitude":14.65712,"longitude":120.98861},{"latitude":14.65712,"longitude":120.9888},{"latitude":14.65712,"longitude":120.98906},{"latitude":14.65712,"longitude":120.98933},{"latitude":14.65712,"longitude":120.98953},{"latitude":14.65712,"longitude":120.98982},{"latitude":14.65712,"longitude":120.99001},{"latitude":14.65712,"longitude":120.99019},{"latitude":14.65712,"longitude":120.99038},{"latitude":14.65712,"longitude":120.99045},{"latitude":14.65712,"longitude":120.99047},{"latitude":14.65712,"longitude":120.99065},{"latitude":14.65713,"longitude":120.99077},{"latitude":14.65713,"longitude":120.99084},{"latitude":14.65713,"longitude":120.99092},{"latitude":14.65713,"longitude":120.99102},{"latitude":14.65713,"longitude":120.99121},{"latitude":14.65714,"longitude":120.9914},{"latitude":14.65714,"longitude":120.99158},{"latitude":14.65715,"longitude":120.99177},{"latitude":14.65715,"longitude":120.99195},{"latitude":14.65715,"longitude":120.99214},{"latitude":14.65716,"longitude":120.99233},{"latitude":14.65716,"longitude":120.99251},{"latitude":14.65716,"longitude":120.9927},{"latitude":14.65717,"longitude":120.99301},{"latitude":14.65717,"longitude":120.99319},{"latitude":14.65717,"longitude":120.99331},{"latitude":14.65718,"longitude":120.99348},{"latitude":14.65718,"longitude":120.99366},{"latitude":14.65719,"longitude":120.99383},{"latitude":14.6572,"longitude":120.99401},{"latitude":14.65721,"longitude":120.99418},{"latitude":14.65721,"longitude":120.99436},{"latitude":14.65721,"longitude":120.99441},{"latitude":14.65723,"longitude":120.99556},{"latitude":14.65723,"longitude":120.99572},{"latitude":14.65724,"longitude":120.99622},{"latitude":14.65725,"longitude":120.99659},{"latitude":14.65725,"longitude":120.99669},{"latitude":14.65726,"longitude":120.99687},{"latitude":14.65726,"longitude":120.99712},{"latitude":14.65727,"longitude":120.99762},{"latitude":14.65728,"longitude":120.99817},{"latitude":14.65728,"longitude":120.99825},{"latitude":14.65729,"longitude":120.99844},{"latitude":14.65729,"longitude":120.99858},{"latitude":14.65729,"longitude":120.99869},{"latitude":14.65729,"longitude":120.99894},{"latitude":14.65729,"longitude":120.99947},{"latitude":14.65728,"longitude":120.99979},{"latitude":14.65727,"longitude":120.99998},{"latitude":14.65728,"longitude":121.00023},{"latitude":14.65728,"longitude":121.00029},{"latitude":14.65729,"longitude":121.00047},{"latitude":14.6573,"longitude":121.00067},{"latitude":14.6573,"longitude":121.00115},{"latitude":14.65731,"longitude":121.00152},{"latitude":14.65732,"longitude":121.00177},{"latitude":14.65733,"longitude":121.00208},{"latitude":14.65733,"longitude":121.00226},{"latitude":14.65733,"longitude":121.00246},{"latitude":14.65733,"longitude":121.00256},{"latitude":14.65735,"longitude":121.00307},{"latitude":14.65737,"longitude":121.00359},{"latitude":14.65737,"longitude":121.00362},{"latitude":14.65736,"longitude":121.0038},{"latitude":14.65735,"longitude":121.00398},{"latitude":14.65735,"longitude":121.00406},{"latitude":14.65735,"longitude":121.00424},{"latitude":14.65736,"longitude":121.00435},{"latitude":14.65737,"longitude":121.00533},{"latitude":14.65737,"longitude":121.00642},{"latitude":14.65738,"longitude":121.00663},{"latitude":14.65738,"longitude":121.00684},{"latitude":14.65738,"longitude":121.00699},{"latitude":14.65738,"longitude":121.00703},{"latitude":14.65739,"longitude":121.00758},{"latitude":14.6574,"longitude":121.00851},{"latitude":14.65742,"longitude":121.00944},{"latitude":14.65742,"longitude":121.00981},{"latitude":14.65743,"longitude":121.01048},{"latitude":14.6574,"longitude":121.01082},{"latitude":14.65741,"longitude":121.01097},{"latitude":14.65742,"longitude":121.01174},{"latitude":14.65743,"longitude":121.0123},{"latitude":14.65744,"longitude":121.01313},{"latitude":14.65745,"longitude":121.01393},{"latitude":14.65746,"longitude":121.01442},{"latitude":14.65746,"longitude":121.01481},{"latitude":14.65748,"longitude":121.01551},{"latitude":14.65749,"longitude":121.01588},{"latitude":14.65749,"longitude":121.0161},{"latitude":14.65749,"longitude":121.0162},{"latitude":14.65749,"longitude":121.01629},{"latitude":14.6575,"longitude":121.01639},{"latitude":14.6575,"longitude":121.01657},{"latitude":14.65753,"longitude":121.01747},{"latitude":14.65755,"longitude":121.01878},{"latitude":14.65756,"longitude":121.01896},{"latitude":14.65756,"longitude":121.01906},{"latitude":14.65756,"longitude":121.01924},{"latitude":14.65756,"longitude":121.01943},{"latitude":14.65756,"longitude":121.01961},{"latitude":14.65756,"longitude":121.01963},{"latitude":14.65756,"longitude":121.01977},{"latitude":14.65756,"longitude":121.01985},{"latitude":14.65756,"longitude":121.01995},{"latitude":14.65756,"longitude":121.02006},{"latitude":14.65755,"longitude":121.02025},{"latitude":14.65753,"longitude":121.02044},{"latitude":14.65753,"longitude":121.02046},{"latitude":14.65753,"longitude":121.02051},{"latitude":14.65751,"longitude":121.02076},{"latitude":14.65746,"longitude":121.02107},{"latitude":14.65741,"longitude":121.02144},{"latitude":14.6574,"longitude":121.02152},{"latitude":14.6574,"longitude":121.02153},{"latitude":14.65737,"longitude":121.02165},{"latitude":14.65732,"longitude":121.02183},{"latitude":14.65718,"longitude":121.02248},{"latitude":14.6571,"longitude":121.0229},{"latitude":14.65707,"longitude":121.02306},{"latitude":14.65703,"longitude":121.02323},{"latitude":14.65687,"longitude":121.02403},{"latitude":14.65686,"longitude":121.02407},{"latitude":14.65683,"longitude":121.02421},{"latitude":14.65677,"longitude":121.02448},{"latitude":14.65661,"longitude":121.02518},{"latitude":14.65658,"longitude":121.02534},{"latitude":14.65645,"longitude":121.02593},{"latitude":14.65642,"longitude":121.02607},{"latitude":14.65641,"longitude":121.02611},{"latitude":14.65639,"longitude":121.02621},{"latitude":14.65635,"longitude":121.02637},{"latitude":14.65629,"longitude":121.02663},{"latitude":14.65614,"longitude":121.02731},{"latitude":14.65587,"longitude":121.02849},{"latitude":14.65569,"longitude":121.02922},{"latitude":14.65557,"longitude":121.02967},{"latitude":14.65552,"longitude":121.02983},{"latitude":14.65548,"longitude":121.02994},{"latitude":14.65542,"longitude":121.03006},{"latitude":14.65534,"longitude":121.03014},{"latitude":14.65524,"longitude":121.03022},{"latitude":14.65514,"longitude":121.03029},{"latitude":14.65483,"longitude":121.03049},{"latitude":14.65476,"longitude":121.03054},{"latitude":14.65461,"longitude":121.03065},{"latitude":14.65376,"longitude":121.0312},{"latitude":14.65366,"longitude":121.03126},{"latitude":14.65291,"longitude":121.03174},{"latitude":14.65192,"longitude":121.0324},{"latitude":14.65125,"longitude":121.03285},{"latitude":14.65123,"longitude":121.03287},{"latitude":14.6511,"longitude":121.03295},{"latitude":14.65,"longitude":121.03365},{"latitude":14.64994,"longitude":121.03369},{"latitude":14.6498,"longitude":121.03378},{"latitude":14.64971,"longitude":121.03384},{"latitude":14.64956,"longitude":121.03394},{"latitude":14.64941,"longitude":121.03404},{"latitude":14.64925,"longitude":121.03414},{"latitude":14.6491,"longitude":121.03423},{"latitude":14.64895,"longitude":121.03433},{"latitude":14.6488,"longitude":121.03443},{"latitude":14.64865,"longitude":121.03453},{"latitude":14.64849,"longitude":121.03463},{"latitude":14.64834,"longitude":121.03473},{"latitude":14.64778,"longitude":121.0351},{"latitude":14.64748,"longitude":121.03529},{"latitude":14.64747,"longitude":121.0353},{"latitude":14.64732,"longitude":121.03539},{"latitude":14.64716,"longitude":121.03549},{"latitude":14.64701,"longitude":121.03558},{"latitude":14.64678,"longitude":121.03572},{"latitude":14.64608,"longitude":121.03618},{"latitude":14.64593,"longitude":121.03628},{"latitude":14.64517,"longitude":121.03678},{"latitude":14.64507,"longitude":121.03685},{"latitude":14.64504,"longitude":121.03687},{"latitude":14.64503,"longitude":121.03688},{"latitude":14.64492,"longitude":121.03695},{"latitude":14.64483,"longitude":121.03701},{"latitude":14.64437,"longitude":121.0373},{"latitude":14.6441,"longitude":121.03748},{"latitude":14.64382,"longitude":121.03767},{"latitude":14.6436,"longitude":121.03781},{"latitude":14.64338,"longitude":121.03796},{"latitude":14.64327,"longitude":121.03803},{"latitude":14.64326,"longitude":121.03804},{"latitude":14.64325,"longitude":121.03804},{"latitude":14.64312,"longitude":121.03813},{"latitude":14.643,"longitude":121.0382},{"latitude":14.64285,"longitude":121.0383},{"latitude":14.6427,"longitude":121.03839},{"latitude":14.64254,"longitude":121.03849},{"latitude":14.64239,"longitude":121.03859},{"latitude":14.64224,"longitude":121.03868},{"latitude":14.64208,"longitude":121.03878},{"latitude":14.64193,"longitude":121.03888},{"latitude":14.64177,"longitude":121.03897},{"latitude":14.64162,"longitude":121.03907},{"latitude":14.64075,"longitude":121.03964},{"latitude":14.64069,"longitude":121.03968},{"latitude":14.64046,"longitude":121.03983},{"latitude":14.64031,"longitude":121.03993},{"latitude":14.64015,"longitude":121.04003},{"latitude":14.64,"longitude":121.04013},{"latitude":14.63985,"longitude":121.04023},{"latitude":14.6397,"longitude":121.04032},{"latitude":14.63962,"longitude":121.04038},{"latitude":14.63792,"longitude":121.04147},{"latitude":14.63757,"longitude":121.04172},{"latitude":14.63741,"longitude":121.04181},{"latitude":14.63726,"longitude":121.04191},{"latitude":14.63714,"longitude":121.04198},{"latitude":14.63653,"longitude":121.04238},{"latitude":14.63637,"longitude":121.04248},{"latitude":14.63622,"longitude":121.04257},{"latitude":14.63606,"longitude":121.04267},{"latitude":14.63591,"longitude":121.04276},{"latitude":14.63576,"longitude":121.04286},{"latitude":14.6356,"longitude":121.04296},{"latitude":14.63545,"longitude":121.04305},{"latitude":14.63529,"longitude":121.04315},{"latitude":14.63514,"longitude":121.04324},{"latitude":14.63501,"longitude":121.04333},{"latitude":14.63455,"longitude":121.04367},{"latitude":14.63426,"longitude":121.04389},{"latitude":14.63396,"longitude":121.0441},{"latitude":14.6339,"longitude":121.04414},{"latitude":14.63376,"longitude":121.04424},{"latitude":14.63375,"longitude":121.04424},{"latitude":14.63359,"longitude":121.04434},{"latitude":14.63344,"longitude":121.04444},{"latitude":14.63328,"longitude":121.04453},{"latitude":14.6331,"longitude":121.04465},{"latitude":14.63297,"longitude":121.04473},{"latitude":14.63295,"longitude":121.04475},{"latitude":14.63293,"longitude":121.04476},{"latitude":14.6328,"longitude":121.04484},{"latitude":14.63274,"longitude":121.04488},{"latitude":14.63265,"longitude":121.04493},{"latitude":14.63254,"longitude":121.04499},{"latitude":14.63249,"longitude":121.04501},{"latitude":14.63233,"longitude":121.04509},{"latitude":14.63216,"longitude":121.04516},{"latitude":14.632,"longitude":121.04524},{"latitude":14.63191,"longitude":121.04529},{"latitude":14.63125,"longitude":121.0456},{"latitude":14.63118,"longitude":121.04563},{"latitude":14.63101,"longitude":121.0457},{"latitude":14.63085,"longitude":121.04577},{"latitude":14.63078,"longitude":121.0458},{"latitude":14.63065,"longitude":121.04585},{"latitude":14.63045,"longitude":121.04594},{"latitude":14.63036,"longitude":121.04598},{"latitude":14.63019,"longitude":121.04606},{"latitude":14.63003,"longitude":121.04613},{"latitude":14.62986,"longitude":121.04621},{"latitude":14.62975,"longitude":121.04626},{"latitude":14.6297,"longitude":121.04628},{"latitude":14.62954,"longitude":121.04636},{"latitude":14.62937,"longitude":121.04644},{"latitude":14.62921,"longitude":121.04651},{"latitude":14.62904,"longitude":121.04659},{"latitude":14.62901,"longitude":121.0466},{"latitude":14.62884,"longitude":121.04667},{"latitude":14.62868,"longitude":121.04674},{"latitude":14.62851,"longitude":121.04681},{"latitude":14.62834,"longitude":121.04688},{"latitude":14.62817,"longitude":121.04695},{"latitude":14.62801,"longitude":121.04702},{"latitude":14.62785,"longitude":121.0471},{"latitude":14.62768,"longitude":121.04718},{"latitude":14.62752,"longitude":121.04726},{"latitude":14.62736,"longitude":121.04734},{"latitude":14.62735,"longitude":121.04735},{"latitude":14.62711,"longitude":121.04747},{"latitude":14.62694,"longitude":121.04755},{"latitude":14.62662,"longitude":121.04771},{"latitude":14.62646,"longitude":121.04779},{"latitude":14.62565,"longitude":121.0482},{"latitude":14.62465,"longitude":121.04863},{"latitude":14.62407,"longitude":121.04889},{"latitude":14.62374,"longitude":121.04904},{"latitude":14.62358,"longitude":121.04912},{"latitude":14.62343,"longitude":121.04919},{"latitude":14.62309,"longitude":121.04935},{"latitude":14.62293,"longitude":121.04943},{"latitude":14.62244,"longitude":121.04966},{"latitude":14.62211,"longitude":121.04981},{"latitude":14.62182,"longitude":121.04995},{"latitude":14.62152,"longitude":121.0501},{"latitude":14.62149,"longitude":121.05011},{"latitude":14.62132,"longitude":121.05019},{"latitude":14.62122,"longitude":121.05024},{"latitude":14.62121,"longitude":121.05024},{"latitude":14.62105,"longitude":121.05032},{"latitude":14.62088,"longitude":121.05039},{"latitude":14.62072,"longitude":121.05047},{"latitude":14.62056,"longitude":121.05055},{"latitude":14.62039,"longitude":121.05063},{"latitude":14.62023,"longitude":121.0507},{"latitude":14.62007,"longitude":121.05078},{"latitude":14.62006,"longitude":121.05078},{"latitude":14.6199,"longitude":121.05086},{"latitude":14.61974,"longitude":121.05094},{"latitude":14.61958,"longitude":121.05101},{"latitude":14.61941,"longitude":121.05109},{"latitude":14.61925,"longitude":121.05117},{"latitude":14.61923,"longitude":121.05117},{"latitude":14.61907,"longitude":121.05125},{"latitude":14.6189,"longitude":121.05132},{"latitude":14.61873,"longitude":121.05139},{"latitude":14.61857,"longitude":121.05146},{"latitude":14.6184,"longitude":121.05153},{"latitude":14.61823,"longitude":121.0516},{"latitude":14.61807,"longitude":121.05167},{"latitude":14.6179,"longitude":121.05174},{"latitude":14.61774,"longitude":121.05181},{"latitude":14.61757,"longitude":121.05188},{"latitude":14.6175,"longitude":121.05191},{"latitude":14.6174,"longitude":121.05196},{"latitude":14.61708,"longitude":121.05212},{"latitude":14.61684,"longitude":121.05224},{"latitude":14.61659,"longitude":121.05236},{"latitude":14.61651,"longitude":121.0524},{"latitude":14.61644,"longitude":121.05243},{"latitude":14.6161,"longitude":121.05261},{"latitude":14.61571,"longitude":121.05278},{"latitude":14.61555,"longitude":121.05286},{"latitude":14.61522,"longitude":121.05301},{"latitude":14.61474,"longitude":121.05322},{"latitude":14.61449,"longitude":121.05332},{"latitude":14.61423,"longitude":121.05344},{"latitude":14.61394,"longitude":121.05358},{"latitude":14.61361,"longitude":121.05374},{"latitude":14.61321,"longitude":121.05393},{"latitude":14.61262,"longitude":121.05419},{"latitude":14.61248,"longitude":121.05426},{"latitude":14.61235,"longitude":121.05433},{"latitude":14.61219,"longitude":121.0544},{"latitude":14.61202,"longitude":121.05448},{"latitude":14.61186,"longitude":121.05455},{"latitude":14.61169,"longitude":121.05463},{"latitude":14.61168,"longitude":121.05464},{"latitude":14.61153,"longitude":121.05471},{"latitude":14.61137,"longitude":121.05478},{"latitude":14.6112,"longitude":121.05486},{"latitude":14.61104,"longitude":121.05494},{"latitude":14.61101,"longitude":121.05495},{"latitude":14.61085,"longitude":121.05502},{"latitude":14.61068,"longitude":121.05509},{"latitude":14.61063,"longitude":121.05511},{"latitude":14.61025,"longitude":121.05528},{"latitude":14.61022,"longitude":121.05529},{"latitude":14.61006,"longitude":121.05537},{"latitude":14.60989,"longitude":121.05544},{"latitude":14.60974,"longitude":121.0555},{"latitude":14.60973,"longitude":121.05551},{"latitude":14.60956,"longitude":121.05558},{"latitude":14.60939,"longitude":121.05565},{"latitude":14.60923,"longitude":121.05572},{"latitude":14.60896,"longitude":121.05584},{"latitude":14.6088,"longitude":121.05591},{"latitude":14.60863,"longitude":121.05598},{"latitude":14.60748,"longitude":121.05652},{"latitude":14.60626,"longitude":121.05705},{"latitude":14.6055,"longitude":121.05739},{"latitude":14.60466,"longitude":121.05777},{"latitude":14.60428,"longitude":121.05795},{"latitude":14.60413,"longitude":121.05802},{"latitude":14.60412,"longitude":121.05803},{"latitude":14.60331,"longitude":121.05841},{"latitude":14.60295,"longitude":121.05858},{"latitude":14.60275,"longitude":121.05867},{"latitude":14.60248,"longitude":121.05879},{"latitude":14.60219,"longitude":121.05891},{"latitude":14.60205,"longitude":121.05897},{"latitude":14.60195,"longitude":121.05901},{"latitude":14.60165,"longitude":121.05912},{"latitude":14.60156,"longitude":121.05915},{"latitude":14.6015,"longitude":121.05917},{"latitude":14.60133,"longitude":121.05922},{"latitude":14.60108,"longitude":121.05931},{"latitude":14.60082,"longitude":121.05937},{"latitude":14.60076,"longitude":121.05939},{"latitude":14.60059,"longitude":121.05943},{"latitude":14.60058,"longitude":121.05943},{"latitude":14.60044,"longitude":121.05946},{"latitude":14.60041,"longitude":121.05946},{"latitude":14.60023,"longitude":121.05949},{"latitude":14.60019,"longitude":121.0595},{"latitude":14.60005,"longitude":121.05952},{"latitude":14.59999,"longitude":121.05953},{"latitude":14.59988,"longitude":121.05955},{"latitude":14.59979,"longitude":121.05956},{"latitude":14.5997,"longitude":121.05957},{"latitude":14.59952,"longitude":121.05959},{"latitude":14.59946,"longitude":121.05959},{"latitude":14.59934,"longitude":121.0596},{"latitude":14.59916,"longitude":121.05962},{"latitude":14.59914,"longitude":121.05962},{"latitude":14.59899,"longitude":121.05962},{"latitude":14.59878,"longitude":121.05961},{"latitude":14.59877,"longitude":121.05961},{"latitude":14.5985,"longitude":121.05962},{"latitude":14.5982,"longitude":121.05963},{"latitude":14.59759,"longitude":121.05963},{"latitude":14.59723,"longitude":121.05958},{"latitude":14.59685,"longitude":121.05955},{"latitude":14.59638,"longitude":121.05943},{"latitude":14.59626,"longitude":121.05939},{"latitude":14.59608,"longitude":121.05933},{"latitude":14.59591,"longitude":121.05928},{"latitude":14.59574,"longitude":121.05922},{"latitude":14.59557,"longitude":121.05917},{"latitude":14.5954,"longitude":121.05911},{"latitude":14.59525,"longitude":121.05907},{"latitude":14.59474,"longitude":121.05889},{"latitude":14.59406,"longitude":121.05866},{"latitude":14.59386,"longitude":121.05859},{"latitude":14.59371,"longitude":121.05854},{"latitude":14.59343,"longitude":121.05845},{"latitude":14.59313,"longitude":121.05835},{"latitude":14.59307,"longitude":121.05833},{"latitude":14.59302,"longitude":121.05832},{"latitude":14.59291,"longitude":121.05827},{"latitude":14.59281,"longitude":121.05823},{"latitude":14.59246,"longitude":121.05813},{"latitude":14.59205,"longitude":121.058},{"latitude":14.59178,"longitude":121.05789},{"latitude":14.59158,"longitude":121.05782},{"latitude":14.59125,"longitude":121.05771},{"latitude":14.59097,"longitude":121.05762},{"latitude":14.58935,"longitude":121.05713},{"latitude":14.58918,"longitude":121.05707},{"latitude":14.58901,"longitude":121.05701},{"latitude":14.58884,"longitude":121.05695},{"latitude":14.58867,"longitude":121.05689},{"latitude":14.5885,"longitude":121.05683},{"latitude":14.58833,"longitude":121.05677},{"latitude":14.58816,"longitude":121.05671},{"latitude":14.58799,"longitude":121.05665},{"latitude":14.58782,"longitude":121.05659},{"latitude":14.58767,"longitude":121.05653},{"latitude":14.58752,"longitude":121.05647},{"latitude":14.58735,"longitude":121.05641},{"latitude":14.58685,"longitude":121.05625},{"latitude":14.58546,"longitude":121.0558},{"latitude":14.58527,"longitude":121.05573},{"latitude":14.58457,"longitude":121.05549},{"latitude":14.58444,"longitude":121.05544},{"latitude":14.58437,"longitude":121.05542},{"latitude":14.58437,"longitude":121.05542},{"latitude":14.58424,"longitude":121.0554},{"latitude":14.58415,"longitude":121.05537},{"latitude":14.58405,"longitude":121.05534},{"latitude":14.58388,"longitude":121.05526},{"latitude":14.58387,"longitude":121.05525},{"latitude":14.58363,"longitude":121.05513},{"latitude":14.58324,"longitude":121.05491},{"latitude":14.58319,"longitude":121.05488},{"latitude":14.58291,"longitude":121.05472},{"latitude":14.58277,"longitude":121.05462},{"latitude":14.58262,"longitude":121.05452},{"latitude":14.58257,"longitude":121.05449},{"latitude":14.58227,"longitude":121.05428},{"latitude":14.58202,"longitude":121.05411},{"latitude":14.58194,"longitude":121.05406},{"latitude":14.58181,"longitude":121.05396},{"latitude":14.58136,"longitude":121.05364},{"latitude":14.58135,"longitude":121.05364},{"latitude":14.58133,"longitude":121.05362},{"latitude":14.58124,"longitude":121.05356},{"latitude":14.58121,"longitude":121.05353},{"latitude":14.58114,"longitude":121.05349},{"latitude":14.58062,"longitude":121.05311},{"latitude":14.58056,"longitude":121.05307},{"latitude":14.58051,"longitude":121.05303},{"latitude":14.58048,"longitude":121.05301},{"latitude":14.58015,"longitude":121.05278},{"latitude":14.58004,"longitude":121.0527},{"latitude":14.57941,"longitude":121.05225},{"latitude":14.57865,"longitude":121.05171},{"latitude":14.57852,"longitude":121.05162},{"latitude":14.57841,"longitude":121.05154},{"latitude":14.57833,"longitude":121.05147},{"latitude":14.57824,"longitude":121.05138},{"latitude":14.57812,"longitude":121.05125},{"latitude":14.57812,"longitude":121.05125},{"latitude":14.57798,"longitude":121.05115},{"latitude":14.57784,"longitude":121.05105},{"latitude":14.57775,"longitude":121.05099},{"latitude":14.57753,"longitude":121.05083},{"latitude":14.57731,"longitude":121.05068},{"latitude":14.57715,"longitude":121.05057},{"latitude":14.577,"longitude":121.05045},{"latitude":14.57664,"longitude":121.05016},{"latitude":14.57635,"longitude":121.04994},{"latitude":14.5762,"longitude":121.04984},{"latitude":14.57606,"longitude":121.04973},{"latitude":14.57603,"longitude":121.04971},{"latitude":14.57499,"longitude":121.04894},{"latitude":14.57475,"longitude":121.04876},{"latitude":14.57382,"longitude":121.04807},{"latitude":14.57323,"longitude":121.04764},{"latitude":14.57308,"longitude":121.04754},{"latitude":14.57293,"longitude":121.04744},{"latitude":14.57271,"longitude":121.04731},{"latitude":14.57255,"longitude":121.04722},{"latitude":14.57253,"longitude":121.04721},{"latitude":14.57247,"longitude":121.04718},{"latitude":14.57237,"longitude":121.04713},{"latitude":14.57218,"longitude":121.04704},{"latitude":14.57208,"longitude":121.04699},{"latitude":14.57186,"longitude":121.04689},{"latitude":14.5716,"longitude":121.04679},{"latitude":14.57112,"longitude":121.0466},{"latitude":14.56998,"longitude":121.04627},{"latitude":14.56954,"longitude":121.04615},{"latitude":14.56944,"longitude":121.04613},{"latitude":14.56932,"longitude":121.0461},{"latitude":14.56883,"longitude":121.04591},{"latitude":14.56821,"longitude":121.04577},{"latitude":14.56803,"longitude":121.0457},{"latitude":14.56786,"longitude":121.04563},{"latitude":14.56777,"longitude":121.0456},{"latitude":14.56769,"longitude":121.04557},{"latitude":14.56769,"longitude":121.04557},{"latitude":14.56761,"longitude":121.04544},{"latitude":14.5676,"longitude":121.04542},{"latitude":14.56759,"longitude":121.04537},{"latitude":14.56758,"longitude":121.0453},{"latitude":14.56758,"longitude":121.04522},{"latitude":14.56759,"longitude":121.04515},{"latitude":14.5676,"longitude":121.04509},{"latitude":14.56762,"longitude":121.04503},{"latitude":14.56763,"longitude":121.04501},{"latitude":14.56767,"longitude":121.04496},{"latitude":14.56774,"longitude":121.04489},{"latitude":14.56782,"longitude":121.04484},{"latitude":14.56785,"longitude":121.04483},{"latitude":14.56785,"longitude":121.04483},{"latitude":14.56795,"longitude":121.0449},{"latitude":14.56802,"longitude":121.04496},{"latitude":14.56807,"longitude":121.04502},{"latitude":14.5681,"longitude":121.04507},{"latitude":14.56814,"longitude":121.04517},{"latitude":14.5681,"longitude":121.04545},{"latitude":14.56808,"longitude":121.04554},{"latitude":14.56798,"longitude":121.04601},{"latitude":14.56787,"longitude":121.04634},{"latitude":14.56785,"longitude":121.04643},{"latitude":14.56783,"longitude":121.04649},{"latitude":14.56782,"longitude":121.04656},{"latitude":14.56778,"longitude":121.04677},{"latitude":14.56778,"longitude":121.04685},{"latitude":14.56778,"longitude":121.04693},{"latitude":14.56778,"longitude":121.047},{"latitude":14.56779,"longitude":121.04704},{"latitude":14.56779,"longitude":121.04705},{"latitude":14.5678,"longitude":121.04719},{"latitude":14.5678,"longitude":121.04721},{"latitude":14.56783,"longitude":121.04752},{"latitude":14.56785,"longitude":121.04768},{"latitude":14.56787,"longitude":121.04795},{"latitude":14.56788,"longitude":121.04802},{"latitude":14.56803,"longitude":121.04929},{"latitude":14.56804,"longitude":121.04934},{"latitude":14.56806,"longitude":121.04955},{"latitude":14.56806,"longitude":121.04959},{"latitude":14.56807,"longitude":121.04977},{"latitude":14.56806,"longitude":121.04997},{"latitude":14.56805,"longitude":121.05004},{"latitude":14.56803,"longitude":121.05013},{"latitude":14.56799,"longitude":121.05026},{"latitude":14.56798,"longitude":121.05029},{"latitude":14.56792,"longitude":121.05041},{"latitude":14.56785,"longitude":121.05053},{"latitude":14.56757,"longitude":121.05092},{"latitude":14.56741,"longitude":121.05117},{"latitude":14.56722,"longitude":121.05149},{"latitude":14.56714,"longitude":121.05165},{"latitude":14.56702,"longitude":121.05197},{"latitude":14.56691,"longitude":121.05224},{"latitude":14.56684,"longitude":121.05236},{"latitude":14.56674,"longitude":121.05252},{"latitude":14.56674,"longitude":121.05253},{"latitude":14.56663,"longitude":121.0527},{"latitude":14.56644,"longitude":121.05292},{"latitude":14.56624,"longitude":121.05313},{"latitude":14.5659,"longitude":121.05345},{"latitude":14.56562,"longitude":121.05372},{"latitude":14.56514,"longitude":121.0541},{"latitude":14.56489,"longitude":121.0543},{"latitude":14.56473,"longitude":121.05442},{"latitude":14.56473,"longitude":121.05442},{"latitude":14.56466,"longitude":121.05439},{"latitude":14.56461,"longitude":121.05438},{"latitude":14.56453,"longitude":121.05436},{"latitude":14.56435,"longitude":121.05433},{"latitude":14.56341,"longitude":121.05421},{"latitude":14.56289,"longitude":121.05413},{"latitude":14.56274,"longitude":121.05411},{"latitude":14.56238,"longitude":121.05407},{"latitude":14.56238,"longitude":121.05407},{"latitude":14.56228,"longitude":121.05405},{"latitude":14.56214,"longitude":121.05402},{"latitude":14.5621,"longitude":121.0541},{"latitude":14.56205,"longitude":121.05424},{"latitude":14.56199,"longitude":121.05437},{"latitude":14.56192,"longitude":121.0545},{"latitude":14.56184,"longitude":121.05466},{"latitude":14.56168,"longitude":121.05492},{"latitude":14.56157,"longitude":121.0551},{"latitude":14.56109,"longitude":121.05589},{"latitude":14.56109,"longitude":121.05589},{"latitude":14.56044,"longitude":121.05568},{"latitude":14.56044,"longitude":121.05568},{"latitude":14.56033,"longitude":121.05599},{"latitude":14.5603,"longitude":121.05612}]`,
    );

    console.log(JSON.stringify(coordinates, null, 4));

    return coordinates;
  };

  return (
    <View style={styles.container}>
      <WelcomeBanner />
      {/* {showWelcome && <WelcomeMessage data={welcomeData.getWelcomeMessage} onOkay={hideWelcomeMessage} />} */}

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
            directionsServiceBaseUrl={`https://maps.googleapis.com/maps/api/directions/json?origin=${senderStop.latitude},${senderStop.longitude}&destination=${recipient[recipientIndex].latitude},${recipient[recipientIndex].longitude}&avoid=tolls|highways`}
          />
        )}

        <Polyline
          coordinates={polylineCoordinates()}
          strokeColor="#FF0000" // fallback for when `strokeColors` is not supported by the map-provider
          strokeWidth={2}
        />
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
