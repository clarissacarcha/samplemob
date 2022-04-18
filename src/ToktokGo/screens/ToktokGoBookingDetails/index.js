import React, {useEffect, useRef, useState} from 'react';
import {
  BookingID,
  BookingDriverDetails,
  BookingAddress,
  BookingInfo,
  BookingNote,
  BookingTotal,
  BookingStatus,
  BookingCancelledNote,
  BookingMap,
} from './Sections';
import {ScrollView, StyleSheet, View, Dimensions} from 'react-native';
import {HeaderBack, HeaderTitle} from '../../../components';
import CONSTANTS from '../../../common/res/constants';
import {connect, useSelector} from 'react-redux';

const SelectedBookingDetails = ({navigation, session, createSession, route}) => {
  const {delivery, booking} = route.params;
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Booking Details', '']} />,
  });

  // const {booking} = useSelector(state => state.toktokGo);

  const dropDownRef = useRef(null);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSuccessCancelBooking, setShowSuccessCancelBooking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [showSuccessfull, setShowSuccessfull] = useState(false);
  const [confirmed, setConfirmed] = useState('');

  const showBookingReason = () => {
    setShowReason(!showReason);
    setShowModal(!showModal);
  };

  const succefullCancel = () => {
    setShowReason(!showReason);
    setShowSuccessfull(!showSuccessfull);
  };

  useEffect(() => {
    const oldStatus = session.dummyStatus;
    if (oldStatus == 4) {
      const updateStatus = {
        ...session,
        dummyStatus: oldStatus + 1,
      };
      createSession(updateStatus);
    }
  }, []);

  const declineBooking = () => {
    console.log('DECLINED!');
    setShowBookingModal(false);
    setShowSuccessCancelBooking(true);
  };

  const onAccept = (paymentMethodSelected = false) => {
    // setCaptchaVisible(false);
    console.log('ON ACCPET DELIVERY');
    const updateStatus = {
      ...session,
      dummyStatus: 2,
    };
    createSession(updateStatus);
    // patchDeliveryAccepted({
    //   variables: {
    //     input: {
    //       deliveryId: getDelivery.id,
    //       driverId: session.user.driver.id,
    //       userId: session.user.id,
    //     },
    //   },
    // });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}}>
      <BookingID booking={booking} />
      {booking.tag == 'ONGOING' && booking.driver && (
        <>
          <BookingDriverDetails booking={booking} />
          <View style={{borderBottomWidth: 8, borderBottomColor: CONSTANTS.COLOR.LIGHT}} />
        </>
      )}

      <BookingInfo booking={booking} />
      {booking.notes && <BookingNote booking={booking} />}

      {/* todo: replace condition if status is completed */}
      {booking.tag == 'COMPLETED' && <BookingMap booking={booking} />}
      <BookingAddress booking={booking} />
      <BookingTotal booking={booking} />

      <View style={{borderBottomWidth: 8, borderBottomColor: CONSTANTS.COLOR.LIGHT}} />

      <BookingStatus booking={booking} />
      {/* todo: replace condition if status is cancelled */}
      {booking.tag == 'CANCELLED' && <BookingCancelledNote />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CONSTANTS.COLOR.WHITE,
    marginHorizontal: 0,
  },
});

const mapStateToProps = state => ({
  session: state.session,
});

const mapDispatchToProps = dispatch => ({
  createSession: payload => dispatch({type: 'CREATE_SESSION', payload}),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectedBookingDetails);
