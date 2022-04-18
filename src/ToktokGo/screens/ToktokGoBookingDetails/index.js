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
import {ScrollView, StyleSheet, Text, TextInput, View, Dimensions, Image} from 'react-native';
import {HeaderBack, HeaderTitle} from '../../../components';
import CONSTANTS from '../../../common/res/constants';
import {TouchableOpacity} from '@gorhom/bottom-sheet';
import EIcons from 'react-native-vector-icons/EvilIcons';
import AntIcons from 'react-native-vector-icons/AntDesign';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {PATCH_USER_CHANGE_PASSWORD} from '../../../../graphql';
import Toast from 'react-native-simple-toast';
import {useMutation} from '@apollo/react-hooks';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {SIZES, FONT_MEDIUM, COLORS, BUTTON_HEIGHT, NUMBERS} from '../../../res/constants';
import {connect, useSelector} from 'react-redux';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {onError} from '../../../../util/ErrorUtility';
import OnGoingIcon from '../../../assets/icons/OnGoing.png';
import Completed from '../../../assets/icons/Completed.png';
import Cancelled from '../../../assets/icons/Cancelled.png';

const screenWidth = Dimensions.get('window').width;
const modalHeight = (Dimensions.get('window').width / 1.55) * 2;

const SelectedBookingDetails = ({navigation, session, createSession, route}) => {
  const {delivery} = route.params;
  navigation.setOptions({
    headerLeft: () => <HeaderBack />,
    headerTitle: () => <HeaderTitle label={['Booking Details', '']} fontFamily={CONSTANTS.FONT_FAMILY.REGULAR} />,
  });

  const {details, destination, origin, driver, routeDetails, booking} = useSelector(state => state.toktokGo);

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
      <BookingID delivery={delivery} booking={booking} />
      {booking.tag == 'ONGOING' && (
        <>
          <BookingDriverDetails booking={booking} />
          <View style={{borderBottomWidth: 8, borderBottomColor: CONSTANTS.COLOR.LIGHT}} />
        </>
      )}

      <BookingInfo delivery={delivery} booking={booking} />
      {booking.notes && <BookingNote booking={booking} details={details} />}

      {/* todo: replace condition if status is completed */}
      {booking.tag == 'COMPLETED' && <BookingMap booking={booking} />}
      <BookingAddress booking={booking} />
      <BookingTotal booking={booking} details={details} />

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
