import React, {useRef, useCallback, useState} from 'react';
import {Text, View, StyleSheet, StatusBar, TouchableOpacity, Image, Linking, Platform} from 'react-native';
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
import {ON_TRIP_UPDATE, TOKTOKGO_SUBSCRIPTION_CLIENT} from '../../graphql';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import {GET_TRIP_CANCELLATION_CHECK, TRIP_CONSUMER_CANCEL} from '../../graphql/model/Trip';
import {TOKTOK_GO_GRAPHQL_CLIENT} from '../../../graphql';

const ToktokGoOnTheWayRoute = ({navigation, route, session}) => {
  const {popTo, decodedPolyline} = route.params;

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

  const {driver, booking} = useSelector(state => state.toktokGo);
  const dispatch = useDispatch();

  const onTripUpdate = useSubscription(ON_TRIP_UPDATE, {
    client: TOKTOKGO_SUBSCRIPTION_CLIENT,
    variables: {
      consumerUserId: session.user.id,
    },
    onSubscriptionData: response => {
      const {id, status, cancellation} = response?.subscriptionData?.data?.onTripUpdate;
      if (id && status != 'CANCELLED' && cancellation.initiatedBy == 'CONSUMER') {
        dispatch({
          type: 'SET_TOKTOKGO_BOOKING',
          payload: response?.subscriptionData?.data?.onTripUpdate,
        });
      }
      if (status == 'CANCELLED' && cancellation.initiatedBy == 'DRIVER') {
        setCancellationState(cancellation);
        if (cancellation.chargeAmount > 0) {
          setCancellationFee(true);
        } else {
          onCancel(true);
        }
      }
      if (status == 'ARRIVED') {
        setmodal(true);
      }
      if (status == 'COMPLETED') {
        setmodal(true);
      }
    },
  });

  const [getTripCancellationCheck] = useLazyQuery(GET_TRIP_CANCELLATION_CHECK, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      console.log(response);
      setChargeAmount(response.getTripCancellationCheck.chargeAmount);
      if (response.getTripCancellationCheck.chargeAmount > 0) {
        setDriverCancel(true);
      } else {
        setViewCancelBookingModal(true);
      }
    },
    onError: error => console.log('error', error),
  });

  const [tripConsumerCancel] = useMutation(TRIP_CONSUMER_CANCEL, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    onError: err => {
      console.log(err);
    },
    onCompleted: response => {
      console.log(response);
      setViewSuccessCancelBookingModal(true);
    },
  });

  const goBackAfterCancellation = () => {
    navigation.replace('ToktokGoBookingStart', {
      popTo: popTo + 1,
    });
  };

  const initiateCancel = () => {
    getTripCancellationCheck({
      variables: {
        input: {
          trip: {
            id: booking.id,
          },
        },
      },
    });
  };

  const finalizeCancel = reason => {
    tripConsumerCancel({
      variables: {
        input: {
          cancellationCharge: {
            amount: chargeAmount,
          },
          reason: reason,
          trip: {
            id: booking.id,
          },
        },
      },
    });
  };

  console.log(onTripUpdate);

  const openModal = () => {
    setmodal(false);
  };
  const openRateDriver = () => {
    setmodal(false);
    navigation.push('ToktokGoRateDriver', {
      popTo: popTo + 1,
    });
  };
  const onCancel = () => {
    setCancel(false);
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
        type={bookingCancelledType}
        goBackAfterCancellation={goBackAfterCancellation}
      />
      <CancelBookingModal
        isVisible={driverCancel}
        setVisible={setDriverCancel}
        setViewCancelReasonModal={setViewCancelReasonModal}
      />
      <DriverCancelledModal
        driverVisible={cancellationFee}
        setDriverVisible={setCancellationFee}
        setVisible={setViewSuccessCancelBookingModal}
        setType={setBookingCancelledType}
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
        onCancel={onCancel}
        onCancelWithFee={onCancelWithFee}
        cancellationState={cancellationState}
      />
      {/* <SuccesCancelBookingModal /> */}
      <CancelBookingActionSheet setVisible={setViewSuccessCancelBookingModal} />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.pop()}>
        <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
      </TouchableOpacity>
      <Map decodedPolyline={decodedPolyline} />
      <View style={styles.card}>
        {booking.status == 'ACCEPTED' ? (
          <DriverStatus status={status} booking={booking} />
        ) : (
          <DriverStatusDestination booking={booking} />
        )}
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
        <SeeBookingDetails item={DummyData.onGoing.getDeliveries[0]} navigation={navigation} />
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
});
