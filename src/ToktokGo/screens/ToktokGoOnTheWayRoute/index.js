import React, {useCallback, useState, useEffect} from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import {Map, SeeBookingDetails, DriverStatus, DriverInfo, Actions, DriverStatusDestination} from './Sections';
import {DriverArrivedModal} from './Components';
import constants from '../../../common/res/constants';
import ArrowLeftIcon from '../../../assets/icons/arrow-left-icon.png';
import {SheetManager} from 'react-native-actions-sheet';
import {
  CancelBookingModal,
  ReasonCancelModal,
  SuccesCancelBookingModal,
  DriverCancelledModal,
  CancelBookingActionSheet,
  CancelBookingNoFeeModal,
  DriverCancelled,
  FailedChargePaymentModal,
} from '../CancelationModals';
import {connect, useDispatch, useSelector} from 'react-redux';
import BottomSheet from 'reanimated-bottom-sheet';
import {useSubscription} from '@apollo/client';
import {
  ON_TRIP_UPDATE,
  TOKTOKGO_SUBSCRIPTION_CLIENT,
  TRIP_REBOOK,
  TRIP_CONSUMER_CANCEL,
  GET_TRIP_CANCELLATION_CHARGE,
  GET_TRIPS_CONSUMER,
  TRIP_CHARGE_FINALIZE_PAYMENT,
  TRIP_CHARGE_INITIALIZE_PAYMENT,
  GET_BOOKING_DRIVER,
  UPDATE_DRIVER_LOC,
} from '../../graphql';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {TOKTOK_GO_GRAPHQL_CLIENT} from '../../../graphql';
import {onErrorAppSync} from '../../util';
import {useAccount} from 'toktokwallet/hooks';
import BackgroundTimer from 'react-native-background-timer';
import CarImage from '../../../assets/images/car1.png';

const ToktokGoOnTheWayRoute = ({navigation, route, session}) => {
  const {popTo, decodedPolyline} = route.params;
  const {tokwaAccount, getMyAccount} = useAccount();
  const sheetRef = React.useRef(null);
  const SNAPS_ANDROID = [0, 370];
  const SNAPS_IOS = [0, 350];
  const [status, setStatus] = useState(5);
  const [action, setAction] = useState(true);
  const [modal, setmodal] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [actionSheetType, setActionSheetType] = useState(1);
  const [bookingCancelledType, setBookingCancelledType] = useState(1);
  const [cancellationFee, setCancellationFee] = useState(false);
  const [driverCancel, setDriverCancel] = useState(false);
  const [viewCancelBookingModal, setViewCancelBookingModal] = useState(false);
  const [viewCancelReasonModal, setViewCancelReasonModal] = useState(false);
  const [viewSuccessCancelBookingModal, setViewSuccessCancelBookingModal] = useState(false);
  const [viewFailedCancelBookingModal, setViewFailedCancelBookingModal] = useState(false);
  const [chargeAmount, setChargeAmount] = useState(0);
  const [cancellationState, setCancellationState] = useState();
  const [originData, setOriginData] = useState(false);
  const [cancellationChargeResponse, setCancellationChargeResponse] = useState(null);
  const [tripUpdateRetrySwitch, setTripUpdateRetrySwitch] = useState(true);
  const [isViaTokwa, setIsViaTokwa] = useState(false);
  const [driverData, setDriverData] = useState();
  const [driverLocLat, setDriverLocLat] = useState(14.5838);
  const [driverLocLong, setDriverLocLong] = useState(121.0597);

  const {driver, booking} = useSelector(state => state.toktokGo);
  const dispatch = useDispatch();

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
        const {id, status, cancellation} = data?.onTripUpdate;
        if (id && status != 'CANCELLED' && cancellation?.initiatedBy == 'CONSUMER') {
          dispatch({
            type: 'SET_TOKTOKGO_BOOKING',
            payload: data?.onTripUpdate,
          });
        }
        if (status == 'CANCELLED' && cancellation?.initiatedBy == 'DRIVER') {
          setCancellationState(cancellation);
          setChargeAmount(cancellation.charge?.amount);
          if (cancellation.charge?.amount > 0) {
            setCancellationFee(true);
          } else {
            onCancel();
          }
        }
        if (['ARRIVED', 'PICKED_UP', 'COMPLETED'].includes(status)) {
          dispatch({
            type: 'SET_TOKTOKGO_BOOKING',
            payload: data?.onTripUpdate,
          });
          if (['ARRIVED', 'COMPLETED'].includes(status)) {
            setmodal(true);
          }
        }
      },
      error => {
        console.log('[error] Trip Update:', error);
        if (error && subscription.closed) {
          setTimeout(() => {
            // retry subscription connection after 3s
            getTripsConsumer({
              variables: {
                input: {
                  tag: 'ONGOING',
                },
              },
            });
            setTripUpdateRetrySwitch(!tripUpdateRetrySwitch);
          }, 3000);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, [tripUpdateRetrySwitch]);

  useEffect(() => {
    getBookingDriver({
      variables: {
        input: {
          driverUserId: parseInt(booking.driverUserId),
        },
      },
    });
  }, []);

  useEffect(() => {
    const subscribe = navigation.addListener('focus', async () => {
      BackgroundTimer.runBackgroundTimer(async () => {
        //code that will be called every 5 seconds
        updateDriverLoc({
          variables: {
            input: {
              tripId: booking.id,
            },
          },
        });
      }, 15000);
      // Return the function to unsubscribe from the event so it gets removed on unmount
      return subscribe;
    });
    const unsubscribe = navigation.addListener('blur', async () => {
      // Return the function to unsubscribe from the event so it gets removed on unmount
      BackgroundTimer.stopBackgroundTimer();
      console.log('exit');
      return unsubscribe;
    });
  }, [navigation]);

  const [getBookingDriver] = useLazyQuery(GET_BOOKING_DRIVER, {
    fetchPolicy: 'network-only',
    onCompleted: response => {
      setDriverData(response.getBookingDriver.driver);
    },
    onError: onErrorAppSync,
  });

  const [updateDriverLoc] = useLazyQuery(UPDATE_DRIVER_LOC, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      setDriverLocLat(response.getTripDriver.location.latitude);
      setDriverLocLong(response.getTripDriver.location.longitude);
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
        navigation.replace('ToktokGoBookingStart');
      }
    },
    onError: onErrorAppSync,
  });

  const [getTripCancellationCharge] = useLazyQuery(GET_TRIP_CANCELLATION_CHARGE, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      setChargeAmount(response.getTripCancellationCharge?.amount);
      if (response.getTripCancellationCharge?.amount > 0) {
        setDriverCancel(true);
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
            Alert.alert('', message);
          } else if (errorType === 'BAD_USER_INPUT') {
            Alert.alert('', message);
          } else if (errorType === 'AUTHENTICATION_ERROR') {
            // Do Nothing. Error handling should be done on the scren
          } else if (errorType === 'ExecutionTimeout') {
            Alert.alert('', message);
          } else if (errorType === 'TRIP_EXPIRED') {
            dispatch({
              type: 'SET_TOKTOKGO_BOOKING_INITIAL_STATE',
            });
            navigation.replace('ToktokGoBookingStart', {
              popTo: popTo + 1,
            });
          } else {
            console.log('ELSE ERROR:', error);
            Alert.alert('', 'Something went wrong...');
          }
        });
      }
    },
  });

  const [tripConsumerCancel] = useMutation(TRIP_CONSUMER_CANCEL, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
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
          } else if (errorType === 'AUTHENTICATION_ERROR') {
            // Do Nothing. Error handling should be done on the scren
          } else if (errorType === 'ExecutionTimeout') {
            Alert.alert('', message);
          } else if (errorType === 'CANCELLATION_CHARGE_UNACKNOWLEDGED') {
            Alert.alert('', message);
          } else if (errorType === 'TRIP_EXPIRED') {
            dispatch({
              type: 'SET_TOKTOKGO_BOOKING_INITIAL_STATE',
            });
            navigation.replace('ToktokGoBookingStart', {
              popTo: popTo + 1,
            });
          } else {
            console.log('ELSE ERROR:', error);
            Alert.alert('', 'Something went wrong...');
          }
        });
      }
    },
    onCompleted: response => {
      if (chargeAmount) {
        setCancellationState(response.tripConsumerCancel.cancellation);
        sheetRef.current.snapTo(1);
      } else {
        setViewSuccessCancelBookingModal(true);
      }
    },
  });

  const [tripRebook] = useMutation(TRIP_REBOOK, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    onError: onErrorAppSync,
    onCompleted: response => {
      dispatch({
        type: 'SET_TOKTOKGO_BOOKING',
        payload: response.tripRebook.trip,
      });
    },
  });

  const tripRebookFunc = () => {
    tripRebook({
      variables: {
        input: {
          userId: session.user.id,
          tripId: booking.id,
        },
      },
    });
  };

  const goBackAfterCancellation = () => {
    setOriginData(true);
    setViewCancelBookingModal(false);
    setIsViaTokwa(false);
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

  const openModal = () => {
    setmodal(false);
  };
  const openRateDriver = () => {
    setmodal(false);
    navigation.replace('ToktokGoRateDriver', {
      popTo: popTo + 1,
      booking,
    });
  };
  const onCancel = () => {
    setCancel(true);
  };
  const onConsumerAcceptDriverCancelled = () => {
    setOriginData(true);
    dispatch({
      type: 'SET_TOKTOKGO_BOOKING_INITIAL_STATE',
    });
    navigation.replace('ToktokGoBookingStart', {
      popTo: popTo + 1,
    });
    setmodal(false);
  };
  const onCancelWithFee = () => {
    setCancel(false);
    setActionSheetType(10);
  };

  const callStop = () => {
    const link =
      Platform.OS === 'android' ? `tel:${booking.driver?.mobileNumber}` : `telprompt:${booking.driver?.mobileNumber}`;
    Linking.openURL(link);
  };
  const messageStop = () => {
    Linking.openURL(`sms:${booking.driver?.mobileNumber}`);
  };

  const noShowFeeSubmit = () => {
    setCancellationFee(false);
    setViewSuccessCancelBookingModal(true);
  };

  const getHeader = () => {
    if (booking.status == 'ACCEPTED') return <DriverStatus status={status} booking={booking} />;
    else if (booking.status == 'ARRIVED') return <Text style={styles.headerText}>Your driver has arrived</Text>;
    else return <DriverStatusDestination booking={booking} />;
  };

  const [tripChargeFinalizePayment] = useMutation(TRIP_CHARGE_FINALIZE_PAYMENT, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    onCompleted: response => {
      navigation.pop();
      setViewSuccessCancelBookingModal(true);
      setIsViaTokwa(true);
    },
    onError: error => {
      const {graphQLErrors, networkError} = error;
      console.log(graphQLErrors);
      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
        setViewFailedCancelBookingModal(true);
      } else if (graphQLErrors.length > 0) {
        graphQLErrors.map(({message, locations, path, errorType}) => {
          if (errorType === 'INTERNAL_SERVER_ERROR') {
            setViewFailedCancelBookingModal(true);
            Alert.alert('', message);
          } else if (errorType === 'BAD_USER_INPUT') {
            setViewFailedCancelBookingModal(true);
            Alert.alert('', message);
          } else if (errorType === 'WALLET_PIN_CODE_MAX_ATTEMPT') {
            Alert.alert('', JSON.parse(message).message);
          } else if (errorType === 'WALLET_PIN_CODE_INVALID') {
            Alert.alert('', `Incorrect Pin, remaining attempts: ${JSON.parse(message).remainingAttempts}`);
          } else if (errorType === 'AUTHENTICATION_ERROR') {
            setViewFailedCancelBookingModal(true);
            // Do Nothing. Error handling should be done on the scren
          } else if (errorType === 'ExecutionTimeout') {
            setViewFailedCancelBookingModal(true);
            Alert.alert('', message);
          } else {
            setViewFailedCancelBookingModal(true);
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

  const payFeeViaTokwa = () => {
    setCancellationFee(false);
    tripChargeInitializePayment({
      variables: {
        input: {
          tripId: booking.id,
        },
      },
    });
  };

  useEffect(() => {
    if (session.user.toktokWalletAccountId) {
      getMyAccount();
    }
  }, []);

  const renderContent = () => {
    return (
      <CancelBookingActionSheet
        hastokwa={tokwaAccount.wallet.id ? true : false}
        setViewSuccessCancelBookingModal={setViewSuccessCancelBookingModal}
        setVisible={setViewSuccessCancelBookingModal}
        sheetRef={sheetRef}
        cancellationState={cancellationState}
        payFeeViaTokwa={payFeeViaTokwa}
      />
    );
  };

  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <StatusBar
        backgroundColor={
          viewCancelBookingModal ||
          viewCancelReasonModal ||
          viewSuccessCancelBookingModal ||
          driverCancel ||
          cancellationFee ||
          modal ||
          cancel
            ? 'rgba(0,0,0,0.6)'
            : null
        }
      />

      <BottomSheet
        enabledContentGestureInteraction={false}
        ref={sheetRef}
        snapPoints={Platform.OS === 'android' ? SNAPS_ANDROID : SNAPS_IOS}
        initialSnap={0}
        renderContent={renderContent}
        enabledBottomClamp={true}
      />

      <CancelBookingNoFeeModal
        isVisible={viewCancelBookingModal}
        setVisible={setViewCancelBookingModal}
        setNextModal={setViewCancelReasonModal}
        setDriverVisivle={setDriverCancel}
      />
      <ReasonCancelModal
        isVisible={viewCancelReasonModal}
        setVisible={setViewCancelReasonModal}
        setNextModal={setViewSuccessCancelBookingModal}
        type={actionSheetType}
        setType={setActionSheetType}
        finalizeCancel={finalizeCancel}
      />
      <SuccesCancelBookingModal
        isViaTokwa={isViaTokwa}
        visible={viewSuccessCancelBookingModal}
        setVisible={setViewSuccessCancelBookingModal}
        chargeAmount={chargeAmount}
        cancellationState={cancellationState}
        goBackAfterCancellation={goBackAfterCancellation}
      />
      <FailedChargePaymentModal
        SheetManager={SheetManager}
        setCancellationFee={setCancellationFee}
        isVisible={viewFailedCancelBookingModal}
        setVisible={setViewFailedCancelBookingModal}
        cancellationState={cancellationState}
      />
      <CancelBookingModal
        isVisible={driverCancel}
        setVisible={setDriverCancel}
        setViewCancelReasonModal={setViewCancelReasonModal}
      />
      <DriverCancelledModal
        hastokwa={tokwaAccount.wallet.id ? true : false}
        cancellationFee={cancellationFee}
        noShowFeeSubmit={noShowFeeSubmit}
        cancellationState={cancellationState}
        payFeeViaTokwa={payFeeViaTokwa}
      />
      <DriverArrivedModal
        modal={modal}
        setmodal={setmodal}
        action={action}
        booking={booking}
        openModal={openModal}
        openRateDriver={openRateDriver}
      />
      <DriverCancelled
        cancel={cancel}
        onDriverCancelled={onConsumerAcceptDriverCancelled}
        onCancelWithFee={onCancelWithFee}
        cancellationState={cancellationState}
        tripRebookFunc={tripRebookFunc}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.pop()}>
        <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
      </TouchableOpacity>
      <Map
        booking={booking}
        decodedPolyline={decodedPolyline}
        originData={originData}
        driverLat={driverLocLat}
        driverLong={driverLocLong}
      />
      <View style={styles.card}>
        {getHeader()}
        <View style={styles.divider} />
        <DriverInfo booking={booking} driverData={driverData} />
        {['ARRIVED', 'ACCEPTED'].includes(booking.status) && (
          <Actions
            callStop={callStop}
            messageStop={messageStop}
            setVisible={setViewCancelBookingModal}
            initiateCancel={initiateCancel}
            setType={setBookingCancelledType}
            booking={booking}
          />
        )}
        <SeeBookingDetails booking={booking} navigation={navigation} driverData={driverData} />
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(ToktokGoOnTheWayRoute);

const styles = StyleSheet.create({
  bottomSheetHeader: {
    alignItems: 'center',
    backgroundColor: constants.COLOR.WHITE,
    paddingTop: 3,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 3,
    borderTopColor: constants.COLOR.ORANGE,
    borderLeftColor: constants.COLOR.ORANGE,
    borderRightColor: constants.COLOR.ORANGE,
    left: -3,
    width: '102%',
  },
  orangeLine: {
    width: '15%',
    height: 4,
    borderRadius: 50,
    backgroundColor: '#FFE1C7',
    marginTop: 3,
  },
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
    // zIndex: 999,
    backgroundColor: constants.COLOR.WHITE,
    // marginTop: 8,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  divider: {
    borderBottomWidth: 3,
    borderBottomColor: constants.COLOR.LIGHT,
    marginVertical: 16,
    marginHorizontal: -16,
  },
  iconDimensions: {
    width: 10,
    height: 15,
  },

  backButton: {
    zIndex: 999,
    backgroundColor: constants.COLOR.WHITE,
    position: 'absolute',
    top: StatusBar.currentHeight + 23,
    left: 16,
    padding: 6,
    borderRadius: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  displayRight: {
    zIndex: 999,
    backgroundColor: constants.COLOR.WHITE,
    position: 'absolute',
    top: StatusBar.currentHeight + 23,
    right: 16,
    padding: 6,
    borderRadius: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  displayRight1: {
    zIndex: 999,
    backgroundColor: constants.COLOR.WHITE,
    position: 'absolute',
    top: StatusBar.currentHeight + 70,
    right: 16,
    padding: 6,
    borderRadius: 5,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  headerText: {
    textAlign: 'center',
    fontSize: constants.FONT_SIZE.M,
  },
});
