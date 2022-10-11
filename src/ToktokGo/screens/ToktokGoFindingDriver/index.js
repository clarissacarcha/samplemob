import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Alert} from 'react-native';
import constants from '../../../common/res/constants';
import {connect, useDispatch, useSelector} from 'react-redux';
import {
  BackButton,
  FindingDriverStatus,
  BookingDistanceTime,
  DistanceOriginAddress,
  TotalBreakdown,
  CancelRetryButton,
} from './Sections';
import {DriverFoundModal} from './Components';
import {
  ReasonCancelModal,
  CancelBookingNoFeeModal,
  SuccesCancelBookingModal,
  CancelBookingModal,
} from '../CancelationModals';
import {useSubscription} from '@apollo/client';
import {
  ON_TRIP_UPDATE,
  TOKTOKGO_SUBSCRIPTION_CLIENT,
  TRIP_REBOOK,
  GET_TRIP_CANCELLATION_CHARGE,
  TRIP_CONSUMER_CANCEL,
  TRIP_REBOOK_INITIALIZE_PAYMENT,
  GET_TRIPS_CONSUMER,
  GET_BOOKING_DRIVER,
} from '../../graphql';
import {TOKTOK_GO_GRAPHQL_CLIENT} from '../../../graphql';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {onErrorAppSync} from '../../util';
import {AlertOverlay} from '../../../components';
import {useFocusEffect} from '@react-navigation/native';
import {useAlertGO} from '../../hooks';

const ToktokGoFindingDriver = ({navigation, route, session}) => {
  const {popTo} = route.params;
  const {booking} = useSelector(state => state.toktokGo);
  const [showDriverFoundModal, setShowDriverFoundModal] = useState(false);
  const [waitingStatus, setWaitingStatus] = useState(1);
  const [waitingText, setWaitingText] = useState(1);
  const [viewCancelBookingModal, setViewCancelBookingModal] = useState(false);
  const [viewCancelReasonModal, setViewCancelReasonModal] = useState(false);
  const [viewSuccessCancelBookingModal, setViewSuccessCancelBookingModal] = useState(false);
  const dispatch = useDispatch();
  const [chargeAmount, setChargeAmount] = useState(0);
  const [viewCancelBookingWithCharge, setViewCancelBookingWithCharge] = useState(false);
  const [cancellationChargeResponse, setCancellationChargeResponse] = useState(null);
  const [tripUpdateRetrySwitch, setTripUpdateRetrySwitch] = useState(true);
  const [driverData, setDriverData] = useState();
  const [textValue, setTextValue] = useState('');
  const alertGO = useAlertGO();

  useFocusEffect(
    useCallback(() => {
      getTripsConsumer({
        variables: {
          input: {
            tag: 'ONGOING',
          },
        },
      });
    }, []),
  );

  useEffect(() => {
    console.log('[effect] Observe Trip Update!');
    const observer = TOKTOKGO_SUBSCRIPTION_CLIENT.subscribe({
      query: ON_TRIP_UPDATE,
      variables: {
        consumerUserId: session.user.id,
      },
    });
    const subscription = observer.subscribe(
      ({data}) => {
        console.log('[subscription] TripUpdate:', data);
        if (data?.onTripUpdate?.id) {
          dispatch({
            type: 'SET_TOKTOKGO_BOOKING',
            payload: data?.onTripUpdate,
          });
        }
        if (data?.onTripUpdate?.status == 'ACCEPTED') {
          getBookingDriver({
            variables: {
              input: {
                driverUserId: parseInt(data?.onTripUpdate?.driverUserId),
              },
            },
          });
        }
        if (data?.onTripUpdate?.status == 'EXPIRED') {
          setWaitingStatus(0);
          changeTextValue();
          setWaitingText(8);
        }
        // if (data?.onTripUpdate?.status == 'CANCELLED') {
        //   setChargeAmount(data?.onTripUpdate?.cancellation?.charge?.amount);
        //   if (data?.onTripUpdate?.cancellation?.charge?.amount > 0) {
        //     setViewCancelBookingWithCharge(true);
        //     setCancellationChargeResponse(data?.onTripUpdate.cancellation);
        //   } else {
        //     setViewCancelBookingModal(true);
        //   }
        // }
        getTripsConsumer({
          variables: {
            input: {
              tag: 'ONGOING',
            },
          },
        });
      },
      error => {
        console.log('[error] Trip Update:', error);
        if (error && subscription.closed) {
          setTimeout(() => {
            getTripsConsumer({
              variables: {
                input: {
                  tag: 'ONGOING',
                },
              },
            });
            // retry subscription connection after 3s
            setTripUpdateRetrySwitch(!tripUpdateRetrySwitch);
          }, 3000);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, [tripUpdateRetrySwitch, changeTextValue]);

  const [getBookingDriver] = useLazyQuery(GET_BOOKING_DRIVER, {
    fetchPolicy: 'network-only',
    onCompleted: response => {
      setShowDriverFoundModal(true);
      setDriverData(response.getBookingDriver.driver);
    },
    onError: onErrorAppSync,
  });

  const [getTripsConsumer] = useLazyQuery(GET_TRIPS_CONSUMER, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      if (response.getTripsConsumer.length > 0) {
        dispatch({
          type: 'SET_TOKTOKGO_BOOKING',
          payload: response.getTripsConsumer[0],
        });
      } else {
        setWaitingStatus(0);
        setWaitingText(8);
      }
      setTimeout(() => {
        if (
          response.getTripsConsumer[0]?.tag == 'ONGOING' &&
          ['ACCEPTED', 'ARRIVED', 'PICKED_UP'].includes(response.getTripsConsumer[0]?.status)
        ) {
          // setShowDriverFoundModal(true);
          getBookingDriver({
            variables: {
              input: {
                driverUserId: parseInt(booking?.driverUserId),
              },
            },
          });
        } else if (response.getTripsConsumer[0]?.status == 'EXPIRED') {
          setWaitingStatus(0);
          changeTextValue();
          setWaitingText(8);
        }
      }, 1000);
    },
    onError: onErrorAppSync,
  });
  useEffect(() => {
    if (waitingText <= 7 && waitingStatus) {
      const interval = setTimeout(() => {
        setWaitingText(waitingText + 1);
      }, 10000);
      return () => clearInterval(interval);
    } else if (waitingText > 7 && waitingStatus) {
      setWaitingText(1);
    } else {
      setWaitingText(8);
    }
  }, [waitingText]);

  const [getTripCancellationCharge] = useLazyQuery(GET_TRIP_CANCELLATION_CHARGE, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      console.log(response);
      setChargeAmount(response.getTripCancellationCharge?.amount);
      if (response.getTripCancellationCharge?.amount > 0) {
        setViewCancelBookingWithCharge(true);
        setCancellationChargeResponse(response.getTripCancellationCharge);
      } else {
        setViewCancelBookingModal(true);
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
          } else if (errorType === 'AUTHENTICATION_ERROR') {
            // Do Nothing. Error handling should be done on the scren
          } else if (errorType === 'ExecutionTimeout') {
            alertGO({message});
          } else if (errorType === 'TRIP_EXPIRED') {
            dispatch({
              type: 'SET_TOKTOKGO_BOOKING_INITIAL_STATE',
            });
            navigation.replace('ToktokGoBookingStart', {
              popTo: popTo + 1,
            });
          } else {
            console.log('ELSE ERROR:', error);
            // Alert.alert('', 'Something went wrong...');
            alertGO({title: 'Whooops', message: 'May kaunting aberya, ka-toktok. Keep calm and try again.'});
          }
        });
      }
    },
  });

  const [tripConsumerCancel] = useMutation(TRIP_CONSUMER_CANCEL, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    onCompleted: response => {
      console.log(response);
      setViewSuccessCancelBookingModal(true);
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
          } else if (errorType === 'AUTHENTICATION_ERROR') {
            // Do Nothing. Error handling should be done on the scren
          } else if (errorType === 'ExecutionTimeout') {
            alertGO({message});
          } else if (errorType === 'TRIP_EXPIRED') {
            dispatch({
              type: 'SET_TOKTOKGO_BOOKING_INITIAL_STATE',
            });
            navigation.replace('ToktokGoBookingStart', {
              popTo: popTo + 1,
            });
          } else {
            console.log('ELSE ERROR:', error);
            // Alert.alert('', 'Something went wrong...');
            alertGO({title: 'Whooops', message: 'May kaunting aberya, ka-toktok. Keep calm and try again.'});
          }
        });
      }
    },
  });

  const [tripRebook] = useMutation(TRIP_REBOOK, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    onError: error => {
      const {graphQLErrors, networkError} = error;
      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      } else if (graphQLErrors.length > 0) {
        graphQLErrors.map(({message, locations, path, errorType}) => {
          console.log('ERROR TYPE:', errorType, 'MESSAGE:', message);
          if (errorType === 'INTERNAL_SERVER_ERROR') {
            alertGO({message});
          } else if (errorType === 'BAD_USER_INPUT') {
            alertGO({message});
          } else if (errorType === 'AUTHENTICATION_ERROR') {
            // Do Nothing. Error handling should be done on the scren
          } else if (errorType === 'WALLET_PIN_CODE_MAX_ATTEMPT') {
            // Alert.alert('', JSON.parse(message).message);
            alertGO({message: JSON.parse(message).message});
          } else if (errorType === 'WALLET_INVALID_PIN_CODE') {
            // Alert.alert('', `Incorrect Pin, remaining attempts: ${JSON.parse(message).remainingAttempts}`);
            alertGO({message: `Incorrect Pin, remaining attempts: ${JSON.parse(message).remainingAttempts}`});
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
    onCompleted: response => {
      if (booking.paymentMethod == 'TOKTOKWALLET') {
        navigation.pop();
      }
      dispatch({
        type: 'SET_TOKTOKGO_BOOKING_INITIAL_STATE',
      });
      dispatch({
        type: 'SET_TOKTOKGO_BOOKING',
        payload: response.tripRebook.trip,
      });
      setWaitingStatus(1);
      setWaitingText(1);
    },
  });

  const [tripRebookInitializePayment] = useMutation(TRIP_REBOOK_INITIALIZE_PAYMENT, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    onError: error => {
      const {graphQLErrors, networkError} = error;
      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      } else if (graphQLErrors.length > 0) {
        graphQLErrors.map(({message, locations, path, errorType}) => {
          if (errorType === 'INTERNAL_SERVER_ERROR') {
            alertGO({message});
          } else if (errorType === 'BAD_USER_INPUT') {
            alertGO({message: message.message});
          } else if (errorType === 'AUTHENTICATION_ERROR') {
            // Do Nothing. Error handling should be done on the scren
          } else if (errorType === 'WALLET_PIN_CODE_MAX_ATTEMPT') {
            // Alert.alert('', JSON.parse(message).message);
            alertGO({message: JSON.parse(message).message});
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
    onCompleted: response => {
      if (response?.tripRebookInitializePayment?.validator == 'TPIN') {
        navigation.navigate('ToktokWalletTPINValidator', {
          callBackFunc: tripRebookMutation,
          data: {
            paymentHash: response?.tripRebookInitializePayment?.hash,
          },
        });
      } else {
        Alert.alert('', 'something went wrong');
      }
    },
  });

  const tripRebookMutation = ({pinCode, data}) => {
    tripRebook({
      variables: {
        input: {
          tripId: booking.id,
          ...(booking.paymentMethod == 'TOKTOKWALLET'
            ? {
                initializedPayment: {
                  hash: data.paymentHash,
                  pinCode: pinCode,
                },
              }
            : {}),
        },
      },
    });
  };

  const tripRebookFunc = () => {
    if (booking.paymentMethod == 'CASH') {
      tripRebookMutation({pinCode: null, data: null});
    } else {
      tripRebookInitializePayment({
        variables: {
          input: {
            tripId: booking.id,
          },
        },
      });
    }
  };

  const goBackAfterCancellation = () => {
    dispatch({
      type: 'SET_TOKTOKGO_BOOKING_INITIAL_STATE',
    });
    navigation.replace('ToktokGoBookingStart', {
      popTo: popTo + 1,
    });
  };

  const dismissBookingExpired = () => {
    dispatch({
      type: 'SET_TOKTOKGO_BOOKING_INITIAL_STATE',
    });
    navigation.replace('ToktokGoBookingStart', {
      popTo: popTo + 1,
    });
  };

  const initiateCancel = () => {
    getTripCancellationCharge({
      variables: {
        input: {
          tripId: booking.id,
        },
      },
    });
  };

  const finalizeCancel = reason => {
    tripConsumerCancel({
      variables: {
        input: {
          cancellationChargeHash: cancellationChargeResponse?.hash,
          reason: reason,
          tripId: booking.id,
        },
      },
    });
  };

  const renderStatus = type => {
    switch (type) {
      case 1: {
        return 'Kaunti nalang ka-toktok! Paparating na ang iyong toktok driver!';
      }
      case 2: {
        return 'Chill ka muna, while we look for your driver.';
      }
      case 3: {
        return 'Ka-toktok, please wear your mask before you ride para safe tayo. Ingat!';
      }
      case 4: {
        return 'Ready ka na ba? Malapit na mag-accept ang ating mga toktok drivers!';
      }
      case 5: {
        return 'Ka-toktok, pwede ka muna mag check ng aming other services while we look for your toktok driver!';
      }
      case 6: {
        return 'Did you know you can pay less with toktokwallet?';
      }
      case 7: {
        return 'Maghintay ka lamang, ako’y darating - toktok driver';
      }
      case 8: {
        return 'Kaunti na lang, ka-toktok! Paparating na ang toktok driver!';
      }
    }
  };

  const dataTitle = [
    {
      title: 'Find Driver Again',
      body: 'Kaunti na lang, ka-toktok! Paparating na ang toktok driver!',
    },
    {
      title: 'Drivers are Busy at the Moment',
      body: 'Try lang nang try mag-book ka-toktok! Toktok driver naman ang susundo sayo!',
    },
    {
      title: 'Book Again',
      body: 'Wait lang po. We are still looking for drivers, pa-wait lang po ng few minutes, please?',
    },
    {
      title: 'Wait lang po',
      body: 'Drivers are busy at the moment, try ulit natin?',
    },
  ];

  const changeTextValue = () => {
    const len = dataTitle.length;
    setTextValue(dataTitle[Math.floor(Math.random() * len)]);
  };

  return (
    <View style={{flex: 1, backgroundColor: constants.COLOR.WHITE}}>
      <CancelBookingNoFeeModal
        isVisible={viewCancelBookingModal}
        setVisible={setViewCancelBookingModal}
        setNextModal={setViewCancelReasonModal}
        chargeAmount={chargeAmount}
      />
      <CancelBookingModal
        isVisible={viewCancelBookingWithCharge}
        setVisible={setViewCancelBookingWithCharge}
        setViewCancelReasonModal={setViewCancelReasonModal}
      />
      <ReasonCancelModal
        isVisible={viewCancelReasonModal}
        setVisible={setViewCancelReasonModal}
        setNextModal={setViewSuccessCancelBookingModal}
        finalizeCancel={finalizeCancel}
        navigation={navigation}
      />
      <SuccesCancelBookingModal
        visible={viewSuccessCancelBookingModal}
        setVisible={setViewSuccessCancelBookingModal}
        chargeAmount={chargeAmount}
        goBackAfterCancellation={goBackAfterCancellation}
      />
      <DriverFoundModal
        driverData={driverData}
        showDriverFoundModal={showDriverFoundModal}
        setShowDriverFoundModal={setShowDriverFoundModal}
        navigation={navigation}
        route={route}
        booking={booking}
      />
      <BackButton navigation={navigation} popTo={popTo} />
      <FindingDriverStatus
        waitingStatus={waitingStatus}
        renderStatus={renderStatus}
        waitingText={waitingText}
        textValue={textValue}
      />

      <View style={styles.card}>
        <BookingDistanceTime booking={booking} />
        <DistanceOriginAddress booking={booking} />
        <TotalBreakdown booking={booking} />
        <CancelRetryButton
          waitingStatus={waitingStatus}
          initiateCancel={initiateCancel}
          dismissBookingExpired={dismissBookingExpired}
          tripRebookFunc={tripRebookFunc}
        />
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(ToktokGoFindingDriver);

const styles = StyleSheet.create({
  card: {
    right: -4.5,
    width: '102%',
    borderWidth: 3,
    borderTopColor: constants.COLOR.ORANGE,
    borderLeftColor: constants.COLOR.ORANGE,
    borderRightColor: constants.COLOR.ORANGE,
    borderBottomColor: constants.COLOR.WHITE,
    position: 'absolute',
    paddingTop: 13,
    paddingHorizontal: 16,
    bottom: 0,
    zIndex: 999,
    backgroundColor: constants.COLOR.WHITE,
    marginTop: 8,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
});
