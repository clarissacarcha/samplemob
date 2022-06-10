import React, {useCallback, useEffect, useState} from 'react';
import {View, TouchableHighlight, Text, Image, Alert} from 'react-native';
import CONSTANTS from '../../../common/res/constants';
import {connect, useDispatch} from 'react-redux';
import {Landing, Header, OutstandingFee} from './Sections';
import {useFocusEffect} from '@react-navigation/native';
import {
  GET_PLACE_BY_LOCATION,
  GET_TRIPS_CONSUMER,
  TRIP_CHARGE_FINALIZE_PAYMENT,
  TRIP_CHARGE_INITIALIZE_PAYMENT,
} from '../../graphql';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_GO_GRAPHQL_CLIENT, TOKTOK_QUOTATION_GRAPHQL_CLIENT} from '../../../graphql';
import {ToktokgoBeta, EmptyRecent} from '../../components';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {currentLocation} from '../../../helper';
import DestinationIcon from '../../../assets/icons/DestinationIcon.png';
import {ThrottledHighlight} from '../../../components_section';
import {useMutation} from '@apollo/client';
import {onErrorAppSync} from '../../util';
import {PaymentSuccesfullModal} from './Components';
const ToktokGoBookingStart = ({navigation, constants, session}) => {
  const [tripConsumerPending, setTripConsumerPending] = useState([]);
  const [showPaymentSuccesful, setShowPaymentSuccessful] = useState(false);
  const dispatch = useDispatch();

  const setBookingInitialState = payload => {
    dispatch({type: 'SET_TOKTOKGO_BOOKING_ORIGIN', payload});
  };

  const [getPlaceByLocation] = useLazyQuery(GET_PLACE_BY_LOCATION, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      setBookingInitialState(response.getPlaceByLocation);
    },
    onError: error => console.log('error', error),
  });

  const [getTripsConsumer] = useLazyQuery(GET_TRIPS_CONSUMER, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      setTripConsumerPending(response.getTripsConsumer);
    },
  });

  const [tripChargeFinalizePayment] = useMutation(TRIP_CHARGE_FINALIZE_PAYMENT, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    onCompleted: response => {
      navigation.pop();
      setShowPaymentSuccessful(true);
    },
    onError: error => {
      const {graphQLErrors, networkError} = error;
      console.log(graphQLErrors);
      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      } else if (graphQLErrors.length > 0) {
        graphQLErrors.map(({message, locations, path, errorType}) => {
          if (errorType === 'INTERNAL_SERVER_ERROR') {
            Alert.alert('', message);
          } else if (errorType === 'BAD_USER_INPUT') {
            Alert.alert('', message);
          } else if (errorType === 'WALLET_PIN_CODE_MAX_ATTEMPT') {
            Alert.alert('', JSON.parse(message).message);
          } else if (errorType === 'WALLET_PIN_CODE_INVALID') {
            Alert.alert('', `Incorrect Pin, remaining attempts: ${JSON.parse(message).remainingAttempts}`);
          } else if (errorType === 'AUTHENTICATION_ERROR') {
            // Do Nothing. Error handling should be done on the scren
          } else if (errorType === 'ExecutionTimeout') {
            Alert.alert('', message);
          } else {
            console.log('ELSE ERROR:', error);
            Alert.alert('', 'Something went wrong...');
          }
        });
      }
    },
  });

  const tripChargeFinalizePaymentFunction = ({pinCode, data}) => {
    tripChargeFinalizePayment({
      variables: {
        input: {
          initializedPayment: {
            hash: data.hash,
            pinCode,
          },
        },
      },
    });
  };

  const [tripChargeInitializePayment] = useMutation(TRIP_CHARGE_INITIALIZE_PAYMENT, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    onCompleted: response => {
      const data = response.tripChargeInitializePayment;
      console.log('DATA', data.hash);
      if (data.validator == 'TPIN') {
        navigation.navigate('ToktokWalletTPINValidator', {
          callBackFunc: tripChargeFinalizePaymentFunction,
          data: {
            hash: data?.hash,
          },
        });
      } else {
        Alert.alert('', 'Something went wrong...');
      }
    },
    onError: onErrorAppSync,
  });

  const tripChargeInitializePaymentFunction = () => {
    tripChargeInitializePayment({
      variables: {
        input: {
          tripId: tripConsumerPending[0].id,
        },
      },
    });
  };

  const setPlaceFunction = async () => {
    const {latitude, longitude} = await currentLocation({showsReverseGeocode: false});
    getPlaceByLocation({
      variables: {
        input: {
          location: {
            latitude: latitude,
            longitude: longitude,
          },
        },
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      setPlaceFunction();
      getTripsConsumer({
        variables: {
          input: {
            tag: 'PENDING',
            cancellationChargeStatus: 'PENDING',
          },
        },
      });
    }, [navigation]),
  );
  return (
    <View style={{flex: 1, backgroundColor: CONSTANTS.COLOR.WHITE, justifyContent: 'space-between'}}>
      <View>
        <PaymentSuccesfullModal
          showPaymentSuccesful={showPaymentSuccesful}
          setShowPaymentSuccessful={setShowPaymentSuccessful}
          tripConsumerPending={tripConsumerPending}
        />
        <Header navigation={navigation} constants={constants} />
        <Landing navigation={navigation} />
        {/* <RecentDestinations navigation={navigation} />
        <View style={{borderBottomWidth: 6, borderBottomColor: CONSTANTS.COLOR.LIGHT}} />
        <SavedLocations /> */}
        {tripConsumerPending.length > 0 && (
          <OutstandingFee
            navigation={navigation}
            tripChargeInitializePaymentFunction={tripChargeInitializePaymentFunction}
            tripConsumerPending={tripConsumerPending}
          />
        )}
        {<ToktokgoBeta />}
      </View>
      <ThrottledHighlight
        delay={500}
        onPress={() => {
          navigation.push('ToktokGoBookingConfirmDestination', {
            popTo: 1,
          });
        }}>
        <View
          style={{
            paddingHorizontal: CONSTANTS.SIZE.MARGIN,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 16,
            borderTopColor: '#ECECEC',
            // borderTopWidth: 1,
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowRadius: 50,
            shadowOpacity: 1.0,
            elevation: 20,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* <FA5Icon name="map-marker-alt" size={15} color={CONSTANTS.COLOR.ORANGE} style={{marginRight: 10}} /> */}
            <Image source={DestinationIcon} style={{height: 20, width: 25, marginRight: 5}} resizeMode={'contain'} />

            <Text
              style={{
                color: CONSTANTS.COLOR.ORANGE,
                fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
                fontSize: CONSTANTS.FONT_SIZE.M,
              }}>
              Select via Map
            </Text>
          </View>
        </View>
      </ThrottledHighlight>
    </View>
  );
};

const mapStateToProps = state => ({
  constants: state.constants,
  session: state.session,
});

export default connect(mapStateToProps, null)(ToktokGoBookingStart);
