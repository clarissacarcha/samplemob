import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import constants from '../../../common/res/constants';
import {useSelector} from 'react-redux';
import {
  BackButton,
  FindingDriverStatus,
  BookingDistanceTime,
  DistanceOriginAddress,
  TotalBreakdown,
  CancelRetryButton,
} from './Sections';
import {DriverFoundModal} from './Components';
import {ReasonCancelModal, CancelBookingNoFeeModal, SuccesCancelBookingModal} from '../CancelationModals';

const ToktokGoFindingDriver = ({navigation, route}) => {
  const {routeDetails, destination, origin} = useSelector(state => state.toktokGo);
  const [showDriverFoundModal, setShowDriverFoundModal] = useState(false);
  const [waitingStatus, setWaitingStatus] = useState(1);
  const [viewCancelBookingModal, setViewCancelBookingModal] = useState(false);
  const [viewCancelReasonModal, setViewCancelReasonModal] = useState(false);
  const [viewSuccessCancelBookingModal, setViewSuccessCancelBookingModal] = useState(false);

  useEffect(() => {
    if (waitingStatus < 6) {
      const interval = setTimeout(() => {
        setWaitingStatus(waitingStatus + 1);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [waitingStatus]);

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
      />
      <ReasonCancelModal
        isVisible={viewCancelReasonModal}
        setVisible={setViewCancelReasonModal}
        setNextModal={setViewSuccessCancelBookingModal}
      />
      <SuccesCancelBookingModal
        visible={viewSuccessCancelBookingModal}
        setVisible={setViewSuccessCancelBookingModal}
        type={1}
      />
      <DriverFoundModal
        showDriverFoundModal={showDriverFoundModal}
        setShowDriverFoundModal={setShowDriverFoundModal}
        navigation={navigation}
        route={route}
      />
      <BackButton navigation={navigation} />
      <TouchableOpacity
        style={{position: 'absolute', zIndex: 999, right: 0, top: 100}}
        onPress={() => setShowDriverFoundModal(!showDriverFoundModal)}>
        <Text>see driver found modal</Text>
      </TouchableOpacity>
      <FindingDriverStatus waitingStatus={waitingStatus} renderStatus={renderStatus} />

      <View style={styles.card}>
        <BookingDistanceTime routeDetails={routeDetails} />
        <DistanceOriginAddress destination={destination} origin={origin} />
        <TotalBreakdown />
        <CancelRetryButton
          waitingStatus={waitingStatus}
          setWaitingStatus={setWaitingStatus}
          setViewCancelBookingModal={setViewCancelBookingModal}
        />
      </View>
    </View>
  );
};

export default ToktokGoFindingDriver;

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
