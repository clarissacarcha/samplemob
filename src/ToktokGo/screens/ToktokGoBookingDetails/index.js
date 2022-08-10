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
import {AlertOverlay, HeaderBack, HeaderTitle} from '../../../components';
import CONSTANTS from '../../../common/res/constants';
import {connect, useSelector} from 'react-redux';
import {GET_TRIP} from '../../graphql';
import {useLazyQuery} from '@apollo/react-hooks';
import {TOKTOK_GO_GRAPHQL_CLIENT} from '../../../graphql';
import {onErrorAppSync} from '../../util';

const SelectedBookingDetails = ({navigation, session, createSession, route}) => {
  const {delivery, bookingId, driverData} = route.params;
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Booking Details', '']} />,
  });

  const dropDownRef = useRef(null);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSuccessCancelBooking, setShowSuccessCancelBooking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [showSuccessfull, setShowSuccessfull] = useState(false);
  const [confirmed, setConfirmed] = useState('');
  const [booking, setBooking] = useState(route.params.booking);

  const [getTrip, {loading, error}] = useLazyQuery(GET_TRIP, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onError: onErrorAppSync,
    onCompleted: response => {
      setBooking(response.getTrip);
    },
  });

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
    if (!booking) {
      getTrip({
        variables: {
          input: {
            id: bookingId,
          },
        },
      });
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

  if (loading || !booking) {
    console.log('loading', loading, 'booking', booking);
    return <AlertOverlay visible={loading} />;
  }

  return (
    <View style={{flex: 1}}>
      <ScrollView style={styles.container}>
        <BookingID booking={booking} />
        {booking.tag == 'ONGOING' && booking.driver && (
          <>
            <BookingDriverDetails booking={booking} driverData={driverData} />
            <View style={{borderBottomWidth: 8, borderBottomColor: CONSTANTS.COLOR.LIGHT}} />
          </>
        )}

        <BookingInfo booking={booking} />
        {booking.notes && <BookingNote booking={booking} />}

        {/* todo: replace condition if status is completed */}
        {booking.tag == 'COMPLETED' && <BookingMap booking={booking} routeDetails={booking.route} />}
        <BookingAddress booking={booking} />
        <BookingTotal booking={booking} navigation={navigation} />

        <View style={{borderBottomWidth: 8, borderBottomColor: CONSTANTS.COLOR.LIGHT}} />

        <BookingStatus booking={booking} />
        {/* todo: replace condition if status is cancelled */}
        {booking.tag == 'CANCELLED' && <BookingCancelledNote booking={booking} />}
      </ScrollView>
    </View>
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
