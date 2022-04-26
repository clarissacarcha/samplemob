import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
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
import {ON_TRIP_UPDATE, TOKTOKGO_SUBSCRIPTION_CLIENT} from '../../graphql';
import {GET_TRIP_CANCELLATION_CHECK, TRIP_CONSUMER_CANCEL} from '../../graphql/model/Trip';
import {TOKTOK_GO_GRAPHQL_CLIENT} from '../../../graphql';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';

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

  const onTripUpdate = useSubscription(ON_TRIP_UPDATE, {
    client: TOKTOKGO_SUBSCRIPTION_CLIENT,
    variables: {
      consumerUserId: session.user.id,
    },
    onSubscriptionData: response => {
      console.log(response);
      if (response?.subscriptionData?.data?.onTripUpdate?.id) {
        dispatch({
          type: 'SET_TOKTOKGO_BOOKING',
          payload: response?.subscriptionData?.data?.onTripUpdate,
        });
      }
      if (response?.subscriptionData?.data?.onTripUpdate?.status == 'ACCEPTED') {
        setShowDriverFoundModal(true);
      }
      if (response?.subscriptionData?.data?.onTripUpdate?.status == 'EXPIRED') {
        setWaitingStatus(0);
        setWaitingText(6);
      }
    },
  });

  useEffect(() => {
    if (waitingText < 5 && waitingStatus) {
      const interval = setTimeout(() => {
        setWaitingText(waitingText + 1);
      }, 10000);
      return () => clearInterval(interval);
    } else if (waitingText >= 5 && waitingStatus) {
      setWaitingText(1);
    } else {
      setWaitingText(6);
    }
  }, [waitingText]);

  const [getTripCancellationCheck] = useLazyQuery(GET_TRIP_CANCELLATION_CHECK, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      console.log(response);
      setChargeAmount(response.getTripCancellationCheck.chargeAmount);
      if (response.getTripCancellationCheck.chargeAmount > 0) {
        setViewCancelBookingWithCharge(true);
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

  const renderStatus = type => {
    switch (type) {
      case 1: {
        return 'Looking for your nearby driver!';
      }
      case 2: {
        return "We're finding you a nearby driver.";
      }
      case 3: {
        return 'Getting ready for your driver.';
      }
      case 4: {
        return 'Patience is a virtue!';
      }
      case 5: {
        return "Let's wait for your driver to arrive!";
      }
      case 6: {
        return 'We’re sorry ka-toktok, but we couldn’t find a driver near your area.';
      }
    }
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
      />
      <SuccesCancelBookingModal
        visible={viewSuccessCancelBookingModal}
        setVisible={setViewSuccessCancelBookingModal}
        type={1}
        chargeAmount={chargeAmount}
        goBackAfterCancellation={goBackAfterCancellation}
      />
      <DriverFoundModal
        showDriverFoundModal={showDriverFoundModal}
        setShowDriverFoundModal={setShowDriverFoundModal}
        navigation={navigation}
        route={route}
        booking={booking}
      />
      <BackButton navigation={navigation} popTo={popTo} />
      <FindingDriverStatus waitingStatus={waitingStatus} renderStatus={renderStatus} waitingText={waitingText} />

      <View style={styles.card}>
        <BookingDistanceTime booking={booking} />
        <DistanceOriginAddress booking={booking} />
        <TotalBreakdown booking={booking} />
        <CancelRetryButton
          waitingStatus={waitingStatus}
          initiateCancel={initiateCancel}
          dismissBookingExpired={dismissBookingExpired}
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
