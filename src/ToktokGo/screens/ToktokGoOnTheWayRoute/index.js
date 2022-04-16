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

const ToktokGoOnTheWayRoute = ({navigation, route}) => {
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
  const openModal = () => {
    setmodal(false);
    setAction(false);
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
    setCancellationFee(true);
    setActionSheetType(10);
  };

  const callStop = () => {
    const link = Platform.OS === 'android' ? `tel:09106350400` : `telprompt:09106350400`;
    Linking.openURL(link);
  };
  const messageStop = () => {
    Linking.openURL(`sms:09106350400`);
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
      />
      <SuccesCancelBookingModal
        visible={viewSuccessCancelBookingModal}
        setVisible={setViewSuccessCancelBookingModal}
        type={bookingCancelledType}
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
      />
      {/* <SuccesCancelBookingModal /> */}
      <CancelBookingActionSheet setVisible={setViewSuccessCancelBookingModal} />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.pop()}>
        <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
      </TouchableOpacity>
      <View>
        <Map decodedPolyline={decodedPolyline} />
        <TouchableOpacity
          style={styles.displayRight}
          onPress={() => {
            setmodal(true);
          }}>
          <DriverArrivedModal
            modal={modal}
            setmodal={setmodal}
            action={action}
            openModal={openModal}
            openRateDriver={openRateDriver}
          />
          <Text style={{color: 'red'}}>Driver Arrived</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.displayRight1}
          onPress={() => {
            setCancel(true), setBookingCancelledType(1);
          }}>
          <Text style={{color: 'red'}}>Driver Cancelled Booking</Text>
          <DriverCancelled cancel={cancel} onCancel={onCancel} onCancelWithFee={onCancelWithFee} />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        {action ? <DriverStatus status={status} /> : <DriverStatusDestination />}
        <View style={styles.divider} />
        <DriverInfo />
        {action && (
          <Actions
            callStop={callStop}
            messageStop={messageStop}
            setVisible={setViewCancelBookingModal}
            setType={setBookingCancelledType}
          />
        )}
        <SeeBookingDetails item={DummyData.onGoing.getDeliveries[0]} navigation={navigation} />
      </View>
    </View>
  );
};

export default ToktokGoOnTheWayRoute;

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
