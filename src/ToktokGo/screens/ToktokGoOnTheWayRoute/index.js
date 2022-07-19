import React, {useRef, useCallback, useState, useEffect} from 'react';
import {Text, View, StyleSheet, StatusBar, TouchableOpacity, Image, Linking, Platform, Alert} from 'react-native';
import {Map, SeeBookingDetails, DriverStatus, DriverInfo, Actions, DriverStatusDestination} from './Sections';
import {DriverArrivedModal} from './Components';
import constants from '../../../common/res/constants';
import ArrowLeftIcon from '../../../assets/icons/arrow-left-icon.png';

import {
  CancelBookingModal,
  ReasonCancelModal,
  SuccesCancelBookingModal,
  DriverCancelledModal,
  CancelBookingActionSheet,
  CancelBookingNoFeeModal,
  DriverCancelled,
} from '../CancelationModals';
import DummyData from '../../components/DummyData';
import {connect, useDispatch, useSelector} from 'react-redux';
import {useSubscription} from '@apollo/client';
import {
  ON_TRIP_UPDATE,
  TOKTOKGO_SUBSCRIPTION_CLIENT,
  TRIP_REBOOK,
  TRIP_CONSUMER_CANCEL,
  GET_TRIP_CANCELLATION_CHARGE,
  GET_TRIPS_CONSUMER,
} from '../../graphql';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {TOKTOK_GO_GRAPHQL_CLIENT} from '../../../graphql';
import {onErrorAppSync} from '../../util';
import {useAccount} from 'toktokwallet/hooks';

const ToktokGoOnTheWayRoute = ({navigation, route, session}) => {
  const {popTo, decodedPolyline} = route.params;
  const {tokwaAccount} = useAccount();

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
  const [chargeAmount, setChargeAmount] = useState(0);
  const [cancellationState, setCancellationState] = useState();
  const [originData, setOriginData] = useState(false);
  const [cancellationChargeResponse, setCancellationChargeResponse] = useState(null);
  const [tripUpdateRetrySwitch, setTripUpdateRetrySwitch] = useState(true);

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
      console.log('zion', respones);
      setCancellationState(response.tripConsumerCancel.cancellation);
      setViewSuccessCancelBookingModal(true);
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
        visible={viewSuccessCancelBookingModal}
        setVisible={setViewSuccessCancelBookingModal}
        chargeAmount={chargeAmount}
        cancellationState={cancellationState}
        goBackAfterCancellation={goBackAfterCancellation}
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
      {/* <SuccesCancelBookingModal /> */}
      <CancelBookingActionSheet setVisible={setViewSuccessCancelBookingModal} />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.pop()}>
        <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
      </TouchableOpacity>
      <Map booking={booking} decodedPolyline={decodedPolyline} originData={originData} />
      <View style={styles.card}>
        {getHeader()}
        <View style={styles.divider} />
        <DriverInfo booking={booking} />
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
        <SeeBookingDetails booking={booking} navigation={navigation} />
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(ToktokGoOnTheWayRoute);

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
