import React, {useCallback, useEffect, useState} from 'react';
import {View, TouchableHighlight, Text, Image, Alert, ScrollView, SafeAreaView} from 'react-native';
import CONSTANTS from '../../../common/res/constants';
import {connect, useDispatch} from 'react-redux';
import {Landing, Header, OutstandingFee} from './Sections';
import {useFocusEffect} from '@react-navigation/native';
import {
  GET_PLACE_BY_LOCATION,
  GET_TRIPS_CONSUMER,
  TRIP_CHARGE_FINALIZE_PAYMENT,
  TRIP_CHARGE_INITIALIZE_PAYMENT,
  GET_TRIP_DESTINATIONS,
} from '../../graphql';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_GO_GRAPHQL_CLIENT, TOKTOK_QUOTATION_GRAPHQL_CLIENT} from '../../../graphql';
import {ToktokgoBeta, EmptyRecent} from '../../components';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import {currentLocation} from '../../../helper';
import DestinationIcon from '../../../assets/icons/DestinationIcon.png';
import DestinationBC from '../../../assets/toktokgo/destination4.png';
import {ThrottledHighlight, ThrottledOpacity} from '../../../components_section';
import {useMutation} from '@apollo/client';
import {onErrorAppSync, onError} from '../../util';
import {useAccount} from 'toktokwallet/hooks';
import {CancellationPaymentSuccesfullModal, NoShowPaymentSuccesfullModal} from './Components';
import {SavedLocations} from './Sections/SavedLocations';
import {RecentDestinations} from './Sections/RecentDestinations';
import AsyncStorage from '@react-native-community/async-storage';
import {FlatList} from 'react-native-gesture-handler';
// import {onError} from '../../../util/ErrorUtility';
import {useAlertGO} from '../../hooks';

const ToktokGoBookingStart = ({navigation, constants, session, route}) => {
  // const {popTo, selectInput} = route.params;
  const [selectedInput, setSelectedInput] = useState('D');
  const {tokwaAccount, getMyAccount} = useAccount();
  const [tripConsumerPending, setTripConsumerPending] = useState([]);
  const [showCancellationPaymentSuccesfulModal, setCancellationShowPaymentSuccessfulModal] = useState(false);
  const [showNoShowPaymentSuccessfulModal, setShowNoShowPaymentSuccessfulModal] = useState(false);
  const dispatch = useDispatch();
  const [recentSearchDataList, setrecentSearchDataList] = useState([]);
  const [recentDestinationList, setrecentDestinationList] = useState([]);
  const [showNotEnoughBalanceModal, setShowNotEnoughBalanceModal] = useState(false);
  const alertGO = useAlertGO();

  useEffect(() => {
    const subscribe = navigation.addListener('focus', async () => {
      await getSearchList();
      getTripDestinations();
      // Return the function to unsubscribe from the event so it gets removed on unmount
      return subscribe;
    });
    const unsubscribe = navigation.addListener('blur', async () => {
      // Return the function to unsubscribe from the event so it gets removed on unmount
      return unsubscribe;
    });
  }, [navigation]);

  const setBookingInitialState = payload => {
    dispatch({type: 'SET_TOKTOKGO_BOOKING_ORIGIN', payload});
  };

  const [getTripDestinations] = useLazyQuery(GET_TRIP_DESTINATIONS, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      setrecentDestinationList(response.getTripDestinations);
    },
    onError: onErrorAppSync,
  });

  const [getPlaceByLocation] = useLazyQuery(GET_PLACE_BY_LOCATION, {
    client: TOKTOK_QUOTATION_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      setBookingInitialState(response.getPlaceByLocation);
    },
    onError: onError,
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
      if (tripConsumerPending[0].cancellation.initiatedBy == 'CONSUMER') {
        setCancellationShowPaymentSuccessfulModal(true);
      } else {
        setShowNoShowPaymentSuccessfulModal(true);
      }
    },
    onError: error => {
      const {graphQLErrors, networkError} = error;
      console.log(graphQLErrors);
      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      } else if (graphQLErrors.length > 0) {
        graphQLErrors.map(({message, locations, path, errorType}) => {
          if (errorType === 'INTERNAL_SERVER_ERROR') {
            alertGO({message});
          } else if (errorType === 'BAD_USER_INPUT') {
            alertGO({message});
          } else if (errorType === 'WALLET_PIN_CODE_MAX_ATTEMPT') {
            // Alert.alert('', JSON.parse(message).message);
            alertGO({message: JSON.parse(message).message});
          } else if (errorType === 'WALLET_PIN_CODE_INVALID') {
            // Alert.alert('', `Incorrect Pin, remaining attempts: ${JSON.parse(message).remainingAttempts}`);
            alertGO({message: `Incorrect Pin, remaining attempts: ${JSON.parse(message).remainingAttempts}`});
          } else if (errorType === 'AUTHENTICATION_ERROR') {
            // Do Nothing. Error handling should be done on the scren
          } else if (errorType === 'ExecutionTimeout') {
            alertGO({message});
          } else {
            console.log('ELSE ERROR:', error);
            // Alert.alert('', 'Something went wrong...');
            alertGO({title: 'Whooops', message: 'May kaunting aberya, ka-toktok. Keep calm and try again.'});
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
    onError: error => {
      const {graphQLErrors, networkError} = error;
      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      } else if (graphQLErrors.length > 0) {
        graphQLErrors.map(({message, locations, path, errorType}) => {
          console.log(errorType);
          if (errorType === 'INTERNAL_SERVER_ERROR') {
            alertGO({message});
          } else if (errorType === 'BAD_USER_INPUT') {
            setShowNotEnoughBalanceModal(true);
          } else if (errorType === 'AUTHENTICATION_ERROR') {
            // Do Nothing. Error handling should be done on the scren
          } else if (errorType === 'ExecutionTimeout') {
            alertGO({message});
          } else {
            console.log('ELSE ERROR:', error);
            // Alert.alert('', 'Something went wrong...');
            alertGO({title: 'Whooops', message: 'May kaunting aberya, ka-toktok. Keep calm and try again.'});
          }
        });
      }
    },
  });

  useEffect(() => {
    if (session.user.toktokWalletAccountId) {
      getMyAccount();
    }
  }, []);

  const tripChargeInitializePaymentFunction = () => {
    if (tokwaAccount.wallet.id) {
      tripChargeInitializePayment({
        variables: {
          input: {
            tripId: tripConsumerPending[0].id,
          },
        },
      });
    } else {
      navigation.push('ToktokWalletLoginPage');
    }
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

  const onPressRecentSearch = loc => {
    dispatch({
      type: 'SET_TOKTOKGO_BOOKING_DETAILS',
      payload: {...route.params.details, noteToDriver: ''},
    });
    if (route?.params?.voucherData) {
      dispatch({
        type: 'SET_TOKTOKGO_BOOKING_DETAILS',
        payload: {...route.params.details, voucher: route.params.voucherData, paymentMethod: 'TOKTOKWALLET'},
      });
    }

    if (selectedInput == 'D') {
      dispatch({type: 'SET_TOKTOKGO_BOOKING_DESTINATION', payload: loc});
    } else {
      dispatch({type: 'SET_TOKTOKGO_BOOKING_ORIGIN', payload: loc});
    }
    onPressLocation();
  };

  const onPressRecentDestination = loc => {
    dispatch({
      type: 'SET_TOKTOKGO_BOOKING_DETAILS',
      payload: {...route.params.details, noteToDriver: ''},
    });
    if (route?.params?.voucherData) {
      dispatch({
        type: 'SET_TOKTOKGO_BOOKING_DETAILS',
        payload: {...route.params.details, voucher: route.params.voucherData, paymentMethod: 'TOKTOKWALLET'},
      });
    }
    if (selectedInput == 'D') {
      dispatch({type: 'SET_TOKTOKGO_BOOKING_DESTINATION', payload: loc});
    } else {
      dispatch({type: 'SET_TOKTOKGO_BOOKING_ORIGIN', payload: loc});
    }
    onPressLocation();
  };

  const onPressLocation = () => {
    if (selectedInput == 'D') {
      navigation.push('ToktokGoBookingConfirmDestination', {
        popTo: 1,
      });
    } else {
      navigation.pop();
      navigation.push('ToktokGoBookingConfirmPickup', {
        popTo: 1,
        source: 'searchLocation',
      });
    }
  };

  const getSearchList = async () => {
    try {
      const data = await AsyncStorage.getItem('recentSearchList');

      const output = JSON.parse(data);
      if (output != null) {
        setrecentSearchDataList(output);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: CONSTANTS.COLOR.WHITE, justifyContent: 'space-between'}}>
        <View style={{flex: 1}}>
          <NoShowPaymentSuccesfullModal
            isVissible={showNoShowPaymentSuccessfulModal}
            setVissible={setShowNoShowPaymentSuccessfulModal}
          />
          <CancellationPaymentSuccesfullModal
            isVissible={showCancellationPaymentSuccesfulModal}
            setVissible={setCancellationShowPaymentSuccessfulModal}
          />
          <Header navigation={navigation} constants={constants} />
          <Landing navigation={navigation} details={route?.params?.details} voucherData={route?.params?.voucherData} />
          <FlatList
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                scrollEnabled={
                  tripConsumerPending.length > 0 ||
                  recentSearchDataList.length != 0 ||
                  recentDestinationList.length != 0
                }>
                {tripConsumerPending.length > 0 && (
                  <OutstandingFee
                    navigation={navigation}
                    tripChargeInitializePaymentFunction={tripChargeInitializePaymentFunction}
                    tripConsumerPending={tripConsumerPending}
                    showNotEnoughBalanceModal={showNotEnoughBalanceModal}
                    setShowNotEnoughBalanceModal={setShowNotEnoughBalanceModal}
                  />
                )}
                {recentSearchDataList.length == 0 && recentDestinationList.length == 0 ? (
                  <ToktokgoBeta />
                ) : (
                  <View>
                    {recentSearchDataList.length == 0 && recentDestinationList.length == 0 ? null : (
                      <View>
                        {recentSearchDataList.length == 0 ? null : (
                          <SavedLocations
                            navigation={navigation}
                            // popTo={popTo}
                            recentSearchDataList={recentSearchDataList}
                            onPressRecentSearch={onPressRecentSearch}
                          />
                        )}
                        {recentDestinationList.length == 0 ? null : (
                          <View>
                            {recentSearchDataList.length != 0 && (
                              <View style={{borderBottomWidth: 6, borderBottomColor: CONSTANTS.COLOR.LIGHT}} />
                            )}
                            <RecentDestinations
                              navigation={navigation}
                              recentDestinationList={recentDestinationList}
                              onPressRecentDestination={onPressRecentDestination}
                              recentSearchDataList={recentSearchDataList}
                            />
                          </View>
                        )}
                      </View>
                    )}
                    {recentSearchDataList.length == 3 && recentDestinationList.length == 3 ? null : <ToktokgoBeta />}
                  </View>
                )}
              </ScrollView>
            }
          />
        </View>
        <ThrottledOpacity
          delay={500}
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
            shadowRadius: 5,
            shadowOpacity: 0.3,
            elevation: 10,
          }}
          onPress={() => {
            navigation.push('ToktokGoBookingConfirmDestination', {
              popTo: 1,
            });
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
        </ThrottledOpacity>
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = state => ({
  constants: state.constants,
  session: state.session,
});

export default connect(mapStateToProps, null)(ToktokGoBookingStart);
