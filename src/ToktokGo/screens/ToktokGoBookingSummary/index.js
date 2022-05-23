import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image, StatusBar, Text, Dimensions, Alert, Platform} from 'react-native';
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
import MIcon from 'react-native-vector-icons/MaterialIcons';
import DeviceInfo from 'react-native-device-info';
import ArrowLeftIcon from '../../../assets/icons/arrow-left-icon.png';
import {GET_TRIP_FARE, TRIP_BOOK, TRIP_INITIALIZE_PAYMENT} from '../../graphql';
import {TOKTOK_GO_GRAPHQL_CLIENT} from '../../../graphql';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import BottomSheet from 'reanimated-bottom-sheet';
import {AlertOverlay} from '../../../components';
import {useAccount} from 'toktokwallet/hooks';
import {AppSyncOnError, onErrorAppSync} from '../../util';
import {onError} from '../../../util/ErrorUtility';

const ToktokGoBookingSummary = ({navigation, route, session}) => {
  const FULLSCREEN_HEIGHT = Dimensions.get('window').height;
  const SNAP_ARR_NOTCH = [FULLSCREEN_HEIGHT - 78, FULLSCREEN_HEIGHT * 0.6];
  const SNAP_ARR = [FULLSCREEN_HEIGHT, FULLSCREEN_HEIGHT * 0.6];
  const {popTo} = route.params;
  const {details, routeDetails, origin, destination, paymentMethod, tempVehicleArr} = useSelector(
    state => state.toktokGo,
  );
  const {tokwaAccount, getMyAccount, getMyAccountLoading, getMyAccountError} = useAccount();
  const {quotationDataResult, decodedPolyline} = route.params;
  const [viewSelectPaymentModal, setViewSelectPaymentModal] = useState(false);
  const [viewPaymenetSucessModal, setViewPaymenetSucessModal] = useState(false);
  const dispatch = useDispatch();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedVouchers, setSelectedVouchers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSeatNum, setSelectedSeatNum] = useState(1);
  const [showHeader, setshowHeader] = useState(false);
  const [tripBookError, setTripBookError] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethod);
  const hasNotch = StatusBar.currentHeight > 24;

  useEffect(() => {
    if (session.user.toktokWalletAccountId) {
      getMyAccount();
    }
  }, []);

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
    onError: onErrorAppSync,
  });

  const [tripBook, {loading: TBLoading}] = useMutation(TRIP_BOOK, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    onError: error => {
      const {graphQLErrors, networkError} = error;
      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      } else if (graphQLErrors.length > 0) {
        graphQLErrors.map(({message, locations, path, errorType}) => {
          console.log('ERROR TYPE:', errorType, 'MESSAGE:', message);
          if (errorType === 'INTERNAL_SERVER_ERROR') {
            setTripBookError(message);
            Alert.alert('', message);
          } else if (errorType === 'BAD_USER_INPUT') {
            setTripBookError(message);
            Alert.alert('', message);
          } else if (errorType === 'AUTHENTICATION_ERROR') {
            // Do Nothing. Error handling should be done on the scren
          } else if (errorType === 'WALLET_PIN_CODE_MAX_ATTEMPT') {
            setTripBookError(JSON.parse(message).message);
            Alert.alert('', JSON.parse(message).message);
          } else if (errorType === 'WALLET_PIN_CODE_INVALID') {
            setTripBookError(JSON.parse(message).remainingAttempts);
            Alert.alert('', `Incorrect Pin, remaining attempts: ${JSON.parse(message).remainingAttempts}`);
          } else if (errorType === 'ExecutionTimeout') {
            Alert.alert('', message);
          } else {
            console.log('ELSE ERROR:', error);
            Alert.alert('', 'Something went wrong...');
          }
        });
      }
    },
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

  const [tripInitializePayment, {loading: TIPLoading}] = useMutation(TRIP_INITIALIZE_PAYMENT, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    onError: error => {
      const {graphQLErrors, networkError} = error;
      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      } else if (graphQLErrors.length > 0) {
        graphQLErrors.map(({message, locations, path, errorType}) => {
          if (errorType === 'INTERNAL_SERVER_ERROR') {
            Alert.alert('', message);
          } else if (errorType === 'BAD_USER_INPUT') {
            Alert.alert('', message.message);
          } else if (errorType === 'AUTHENTICATION_ERROR') {
            // Do Nothing. Error handling should be done on the scren
          } else if (errorType === 'WALLET_PIN_CODE_MAX_ATTEMPT') {
            setTripBookError(JSON.parse(message).message);
            Alert.alert('', JSON.parse(message).message);
          } else if (errorType === 'ExecutionTimeout') {
            Alert.alert('', message);
          } else {
            console.log('ELSE ERROR:', error);
            Alert.alert('', 'Something went wrong...');
          }
        });
      }
    },
    onCompleted: response => {
      if (response?.tripInitializePayment?.validator == 'TPIN') {
        navigation.navigate('ToktokWalletTPINValidator', {
          callBackFunc: tripBooking,
          data: {
            paymentHash: response?.tripInitializePayment?.hash,
          },
          errorMessage: tripBookError,
        });
      } else {
        Alert.alert('', 'something went wrong');
      }
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
    if (selectedVehicle) {
      dispatchRequest();
    }
  }, [selectedVehicle, selectedVouchers]);

  const tripBooking = ({pinCode, data}) => {
    if (!session.userHash) {
      return Alert.alert('', 'Please restart your application!');
    }
    tripBook({
      variables: {
        input: {
          userHash: session.userHash,
          tripFareHash: details?.rate?.hash,
          routeHash: routeDetails?.hash,
          passengerCount: selectedSeatNum,
          paymentMethod: selectedPaymentMethod,
          ...(selectedPaymentMethod == 'TOKTOKWALLET'
            ? {
                initializedPayment: {
                  hash: data.paymentHash,
                  pinCode: pinCode,
                },
              }
            : {}),
          ...(details?.noteToDriver ? {notes: details?.noteToDriver} : {}),
        },
      },
    });
  };

  const confirmBooking = num => {
    setSelectedSeatNum(num);
    SheetManager.hide('passenger_capacity');
    setTimeout(() => {
      if (selectedPaymentMethod == 'CASH') {
        tripBooking({pinCode: null});
      } else {
        tripInitializePayment({
          variables: {
            input: {
              tripFareHash: details?.rate?.hash,
            },
          },
        });
      }
    }, 500);
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
      <BookingBreakdown selectedVehicle={selectedVehicle} loading={loading} />
      <BookingTotal loading={loading} details={details} />
      <BookingSelectPaymentMethod
        viewPaymenetSucessModal={viewPaymenetSucessModal}
        setViewSelectPaymentModal={setViewSelectPaymentModal}
        details={details}
        tokwaAccount={tokwaAccount}
        getMyAccountLoading={getMyAccountLoading}
        navigation={navigation}
      />
    </View>
  );

  const renderHeader = () => (
    <View
      style={{
        flex: 1,
        marginTop: hasNotch ? 0 : StatusBar.currentHeight,
        paddingTop: Platform.OS === 'ios' && !DeviceInfo.hasNotch() ? 36 : 23,
        paddingBottom: 16,
        backgroundColor: 'white',
        shadowBottomColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
      }}>
      <View style={styles.greetingBox}>
        <TouchableOpacity
          style={styles.backButtonHeader}
          onPress={() => {
            sheetRef.current.snapTo(1), setshowHeader(false);
          }}>
          <Text>
            <MIcon name={'keyboard-arrow-left'} size={25} color={constants.COLOR.ORANGE} />
          </Text>
        </TouchableOpacity>
        <View style={{flex: 1, alignItems: 'center', marginRight: 30}}>
          <Text style={styles.greetingText}>Booking Summary</Text>
        </View>
      </View>
    </View>
  );

  const orangeBorder = () => (
    <View style={styles.bottomSheetHeader}>
      <View style={styles.orangeLine} />
    </View>
  );

  const sheetRef = React.useRef(null);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor={viewSelectPaymentModal ? 'rgba(0,0,0,0.6)' : null} />
      <StatusBar backgroundColor={showHeader ? 'white' : null} />
      {!showHeader && (
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.pop()}>
          <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
        </TouchableOpacity>
      )}

      <BottomSheet
        // enabledContentGestureInteraction={false}
        // renderHeader={renderHeader}
        renderHeader={showHeader ? renderHeader : orangeBorder}
        ref={sheetRef}
        snapPoints={DeviceInfo.hasNotch() ? SNAP_ARR_NOTCH : SNAP_ARR}
        initialSnap={1}
        renderContent={renderContent}
        enabledBottomClamp={true}
        onOpenEnd={() => {
          setshowHeader(true);
        }}
        onCloseEnd={() => {
          setshowHeader(false);
        }}
        onCloseStart={() => {
          setshowHeader(false);
        }}
      />

      <PassengerCapacityActionSheet details={details} confirmBooking={confirmBooking} />
      <AlertOverlay visible={TIPLoading || TBLoading} />
      <PaymentMethodModal
        viewSelectPaymentModal={viewSelectPaymentModal}
        setViewSelectPaymentModal={setViewSelectPaymentModal}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        details={details}
        tokwaAccount={tokwaAccount}
        getMyAccountLoading={getMyAccountLoading}
      />

      <PaymentSuccesModal
        viewPaymenetSucessModal={viewPaymenetSucessModal}
        setViewPaymenetSucessModal={setViewPaymenetSucessModal}
      />

      {/* {showHeader && (
        <View style={styles.elementWrapper}>
          <TouchableOpacity style={styles.backButtonHeader} onPress={() => sheetRef.current.snapTo(1)}>
            <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
          </TouchableOpacity>
          <Text style={styles.textStyle}>Booking Summary</Text>
        </View>
      )} */}

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
    paddingTop: 20,
    paddingHorizontal: 16,
    backgroundColor: constants.COLOR.WHITE,
  },
  iconDimensions: {
    width: 10,
    height: 15,
  },
  backButtonHeader: {
    // zIndex: 999,
    backgroundColor: constants.COLOR.WHITE,
    // position: 'absolute',
    // top: StatusBar.currentHeight + 23,
    // left: 16,
  },
  headerBox: {
    marginTop: 16,
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
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
  greetingBox: {
    flexDirection: 'row',
    marginLeft: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: constants.SIZE.MARGIN,
  },
  greetingText: {
    color: constants.COLOR.BLACK,
    fontSize: constants.FONT_SIZE.XL + 1,
    fontFamily: constants.FONT_FAMILY.REGULAR,
  },
});
