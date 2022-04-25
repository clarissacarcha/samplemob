import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image, StatusBar, Text, Dimensions} from 'react-native';
import constants from '../../../common/res/constants';
import {SheetManager} from 'react-native-actions-sheet';
import {connect, useDispatch, useSelector} from 'react-redux';
import {
  BookingDistanceTime,
  BookingSelectVehicle,
  BookingSelectPaymentMethod,
  BookingConfirmButton,
  BookingMap,
  BookingVoucher,
  BookingBreakdown,
  BookingTotal,
} from './Sections';
import {PaymentMethodModal, PaymentSuccesModal, PassengerCapacityActionSheet} from './Components';
import ArrowLeftIcon from '../../../assets/icons/arrow-left-icon.png';
import {GET_TRIP_FARE, TRIP_BOOK} from '../../graphql';
import {TOKTOK_GO_GRAPHQL_CLIENT} from '../../../graphql';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import BottomSheet from 'reanimated-bottom-sheet';
import {AlertOverlay} from '../../../components';
import {onError} from '../../../util/ErrorUtility';

const FULLSCREEN_HEIGHT = Dimensions.get('window').height + StatusBar.currentHeight;
const SNAP_ARR = [FULLSCREEN_HEIGHT - StatusBar.currentHeight * 2, FULLSCREEN_HEIGHT * 0.6];

const ToktokGoBookingSummary = ({navigation, route, session}) => {
  const {popTo} = route.params;
  const {details, routeDetails, origin, destination, paymentMethod, tempVehicleArr} = useSelector(
    state => state.toktokGo,
  );
  const {quotationDataResult, decodedPolyline} = route.params;
  const [viewSelectPaymentModal, setViewSelectPaymentModal] = useState(false);
  const [viewPaymenetSucessModal, setViewPaymenetSucessModal] = useState(false);
  const dispatch = useDispatch();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedVouchers, setSelectedVouchers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSeatNum, setSelectedSeatNum] = useState(1);
  const [showHeader, setshowHeader] = useState(false);

  const [getTripFare, {called}] = useLazyQuery(GET_TRIP_FARE, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      dispatch({
        type: 'SET_TOKTOKGO_BOOKING_DETAILS',
        payload: {...details, rate: response.getTripFare},
      });
      setLoading(false);
    },
    onError: error => console.log('error', error),
  });

  const [tripBook] = useMutation(TRIP_BOOK, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    onError,
    onCompleted: response => {
      dispatch({
        type: 'SET_TOKTOKGO_BOOKING',
        payload: response.tripBook.trip,
      });
      navigation.pop();
      navigation.replace('ToktokGoFindingDriver', {
        popTo: popTo + 1,
        decodedPolyline,
      });
    },
  });

  const selectVehicle = data => {
    setSelectedVehicle(data);
  };

  useEffect(() => {
    selectVehicle(tempVehicleArr[0]);
  }, []);

  // TODO: This will be added once vouchers is added
  const setSelectedVouchersNull = () => {
    setSelectedVouchers(null);
    dispatch({
      type: 'SET_TOKTOKGO_BOOKING_DETAILS',
      payload: {...details, voucher: null},
    });
  };

  // TODO: This will be used on onSelectVoucher
  const dispatchRequest = async () => {
    setLoading(true);
    dispatch({
      type: 'SET_TOKTOKGO_BOOKING_DETAILS',
      payload: {...details, vehicleType: selectedVehicle.vehicleType},
    });
    getTripFare({
      variables: {
        input: {
          vehicleTypeRateHash: selectedVehicle.hash,
          voucherHash: selectedVouchers?.hash,
        },
      },
    });
  };

  useEffect(() => {
    setLoading(true);
    dispatchRequest();
  }, [selectedVehicle, selectedVouchers]);

  const confirmBooking = num => {
    SheetManager.hide('passenger_capacity');
    tripBook({
      variables: {
        input: {
          consumer: {
            mobileNumber: session.user.username,
            name: session.user.person.firstName + ' ' + session.user.person.lastName,
            referralCode: session.user.consumer.referralCode,
            resellerCode: session.user.consumer.resellerCode,
          },
          userId: session.user.id,
          tripFareHash: details?.rate?.hash,
          routeHash: routeDetails?.hash,
          passengerCount: num,
          paymentMethod: paymentMethod == 1 ? 'TOKTOKWALLET' : 'CASH',
          ...(details?.noteToDriver ? {notes: details?.noteToDriver} : {}),
        },
      },
    });
  };

  const renderContent = () => (
    <View style={styles.card}>
      <BookingDistanceTime quotationData={quotationDataResult} />

      <BookingSelectVehicle
        data={quotationDataResult}
        selectedVehicle={selectedVehicle}
        navigation={navigation}
        selectVehicle={selectVehicle}
      />
      {/*  TODO: Vouchers will be added after launch of April 18 */}
      {/* <BookingVoucher
        navigation={navigation}
        selectedVouchers={selectedVouchers}
        setSelectedVouchersNull={setSelectedVouchersNull}
      /> */}
      <BookingBreakdown selectedVehicle={selectedVehicle} />
      <BookingTotal loading={loading} details={details} />
      <BookingSelectPaymentMethod
        viewPaymenetSucessModal={viewPaymenetSucessModal}
        setViewSelectPaymentModal={setViewSelectPaymentModal}
        details={details}
      />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.bottomSheetHeader}>
      <View style={styles.orangeLine} />
    </View>
  );

  const sheetRef = React.useRef(null);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor={viewSelectPaymentModal ? 'rgba(0,0,0,0.6)' : null} />
      {!showHeader && (
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.pop()}>
          <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
        </TouchableOpacity>
      )}

      <BottomSheet
        // enabledContentGestureInteraction={false}
        renderHeader={renderHeader}
        ref={sheetRef}
        snapPoints={SNAP_ARR}
        initialSnap={1}
        renderContent={renderContent}
        enabledBottomClamp={true}
        onOpenEnd={() => {
          setshowHeader(true);
        }}
        onCloseEnd={() => {
          setshowHeader(false);
        }}
      />

      <PassengerCapacityActionSheet details={details} confirmBooking={confirmBooking} />

      <PaymentMethodModal
        viewSelectPaymentModal={viewSelectPaymentModal}
        setViewSelectPaymentModal={setViewSelectPaymentModal}
        details={details}
      />

      <PaymentSuccesModal
        viewPaymenetSucessModal={viewPaymenetSucessModal}
        setViewPaymenetSucessModal={setViewPaymenetSucessModal}
      />

      {showHeader && (
        <View style={styles.elementWrapper}>
          <TouchableOpacity style={styles.backButtonHeader} onPress={() => sheetRef.current.snapTo(1)}>
            <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
          </TouchableOpacity>
          <Text style={styles.textStyle}>Booking Summary</Text>
        </View>
      )}

      <BookingMap
        decodedPolyline={decodedPolyline}
        routeDetails={routeDetails}
        origin={origin}
        destination={destination}
      />

      {/* <View style={styles.card}>
        <BookingDistanceTime quotationData={quotationDataResult} />
        <BookingSelectVehicle
          data={quotationDataResult}
          selectedVehicle={selectedVehicle}
          navigation={navigation}
          selectVehicle={selectVehicle}
        />
        TODO: Vouchers will be added after launch of April 18
        <BookingVoucher
            navigation={navigation}
            selectedVouchers={selectedVouchers}
            setSelectedVouchersNull={setSelectedVouchersNull}
          />
        <BookingTotal loading={loading} details={details} />
        <BookingSelectPaymentMethod
          viewPaymenetSucessModal={viewPaymenetSucessModal}
          setViewSelectPaymentModal={setViewSelectPaymentModal}
          details={details}
        />
      </View> */}
      <View style={styles.buttonContainer}>
        <BookingConfirmButton SheetManager={SheetManager} />
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  session: state.session,
});

export default connect(mapStateToProps, null)(ToktokGoBookingSummary);

const styles = StyleSheet.create({
  bottomSheetHeader: {
    alignItems: 'center',
    backgroundColor: constants.COLOR.WHITE,
    paddingTop: 3,
    paddingBottom: 10,
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
    marginVertical: 3,
  },
  card: {
    paddingHorizontal: 16,
    backgroundColor: constants.COLOR.WHITE,
  },
  iconDimensions: {
    width: 10,
    height: 15,
  },
  backButtonHeader: {
    zIndex: 999,
    backgroundColor: constants.COLOR.WHITE,
    position: 'absolute',
    top: StatusBar.currentHeight + 23,
    left: 16,
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
  buttonContainer: {
    position: 'absolute',
    zIndex: 999,
    bottom: 0,
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    backgroundColor: 'white',
    paddingTop: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 50,
    shadowOpacity: 1.0,
    elevation: 20,
  },
  elementWrapper: {
    position: 'absolute',
    zIndex: 999,
    height: StatusBar.currentHeight * 2 + 14,
    width: '100%',
    top: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  textStyle: {
    top: StatusBar.currentHeight + 16,
    color: constants.COLOR.ALMOST_BLACK,
    fontSize: constants.FONT_SIZE.XL,
  },
});
