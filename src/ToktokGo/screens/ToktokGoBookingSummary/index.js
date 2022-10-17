import React, {useEffect, useState, useCallback} from 'react';
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
import {useFocusEffect} from '@react-navigation/native';
import {
  PaymentMethodModal,
  PaymentSuccesModal,
  PassengerCapacityActionSheet,
  OutstandingFeeModal,
  TokwaPaymentProcessedModal,
  FeeInfoModal,
  VoucherUsedModal,
  VoucherUsedModalRemoved,
} from './Components';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import DeviceInfo from 'react-native-device-info';
import ArrowLeftIcon from '../../../assets/icons/arrow-left-icon.png';
import {GO_GET_TRIP_FARE, GO_TRIP_BOOK, GO_TRIP_INITIALIZE_PAYMENT, GO_GET_TRIPS_CONSUMER} from '../../graphql';
import {TOKTOK_GO_GRAPHQL_CLIENT} from '../../../graphql';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import BottomSheet from 'reanimated-bottom-sheet';
import {AlertOverlay} from '../../../SuperApp/screens/Components';
import {useAccount} from 'toktokwallet/hooks';
import {AppSyncOnError, onErrorAppSync} from '../../util';
import {onError} from '../../../util/ErrorUtility';
import {PricesNoteModal} from './Components/PricesNoteModal';
import {VoucherRemovedModal} from './Components/VoucherRemovedModal';
import AsyncStorage from '@react-native-community/async-storage';
import {useAlertGO} from '../../hooks';

const ToktokGoBookingSummary = ({navigation, route, session}) => {
  const FULLSCREEN_HEIGHT = Dimensions.get('window').height;
  const hasNotch = StatusBar.currentHeight > 24;
  const SNAP_ARR_NOTCH = [FULLSCREEN_HEIGHT - 78, FULLSCREEN_HEIGHT * 0.6];
  const SNAP_ARR = [FULLSCREEN_HEIGHT, FULLSCREEN_HEIGHT * 0.6];
  const dispatch = useDispatch();
  const {popTo} = route.params;
  const {details, routeDetails, origin, destination, paymentMethod, tempVehicleArr} = useSelector(
    state => state.toktokGo,
  );
  const alertGO = useAlertGO();

  const {tokwaAccount, getMyAccount, getMyAccountLoading, getMyAccountError} = useAccount();
  const {quotationDataResult, decodedPolyline} = route.params;
  const [viewSelectPaymentModal, setViewSelectPaymentModal] = useState(false);
  const [viewPaymenetSucessModal, setViewPaymenetSucessModal] = useState(false);
  const [viewOutstandingFeeModal, setViewOutstandingFeeModal] = useState(false);
  const [viewTokwaPaymentProcessedModal, setViewTokwaPaymentProcessedModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedVouchers, setSelectedVouchers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSeatNum, setSelectedSeatNum] = useState(1);
  const [showHeader, setshowHeader] = useState(false);
  const [tripBookError, setTripBookError] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethod);
  const [viewPriceNote, setViewPriceNote] = useState(false);
  const [outstandingFee, setOutstandingFee] = useState();
  const [voucherRemovedVisible, setvoucherRemovedVisible] = useState(false);
  const [voucherTextMessage, setvoucherTextMessage] = useState('');
  const [recentDestinationList, setrecentDestinationList] = useState([]);
  const [isNotVoucherApplicable, setIsNotVoucherApplicable] = useState(false);
  const [proceedBooking, setProceedBooking] = useState(false);
  const [bookingState, setBookingState] = useState(false);
  const [viewOutstandingFeeInfoModal, setViewOutstandingFeeInfoModal] = useState(false);
  const [voucherUsed, setVoucherUsed] = useState(false);
  const [voucherRemoved, setVoucherRemoved] = useState(false);

  useEffect(() => {
    if (session.user.toktokWalletAccountId) {
      getMyAccount();
    }
  }, []);

  useEffect(() => {
    async function tempFunction() {
      await getDestinationList();
    }

    tempFunction();

    return () => {};
  }, []);

  const [getTripFare, {called}] = useLazyQuery(GO_GET_TRIP_FARE, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      dispatch({
        type: 'SET_TOKTOKGO_BOOKING_DETAILS',
        payload: {...details, rate: response.goGetTripFare},
      });
      setLoading(false);
      if (bookingState) {
        setProceedBooking(true);
      }
    },
    onError: error => {
      // setSelectedVouchersNull();
      const {graphQLErrors, networkError} = error;
      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      } else if (graphQLErrors.length > 0) {
        graphQLErrors.map(({message, locations, path, errorType}) => {
          console.log('ERROR TYPE:', errorType, 'MESSAGE:', message);
          if (errorType === 'INTERNAL_SERVER_ERROR') {
            alertGO({message});
          } else if (errorType === 'BAD_USER_INPUT') {
            alertGO({message});
          } else if (errorType === 'AUTHENTICATION_ERROR') {
            // Do Nothing. Error handling should be done on the scren
          } else if (errorType === 'ExecutionTimeout') {
            alertGO({message});
          } else {
            console.log('ELSE ERROR:', error);
            // Alert.alert('', 'Something went wrong...');
            alertGO({title: 'Whooops', message: 'May kaunting aberya, ka-toktok. Keep calm and try again.'});
          }
        });
      }
    },
  });

  const [tripBook, {loading: TBLoading}] = useMutation(GO_TRIP_BOOK, {
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
            alertGO({message});
          } else if (errorType === 'BAD_USER_INPUT') {
            setTripBookError(message);
            navigation.pop();
            if (message == 'Promo Voucher Expired.') {
              setvoucherTextMessage('Promo Voucher Expired.');
              setvoucherRemovedVisible(true);
            } else if (message == 'Daily limit is reached.') {
              setvoucherTextMessage('Daily limit is reached.');
              setvoucherRemovedVisible(true);
            } else {
              alertGO({message});
            }
          } else if (errorType === 'AUTHENTICATION_ERROR') {
            // Do Nothing. Error handling should be done on the scren
          } else if (errorType === 'WALLET_PIN_CODE_MAX_ATTEMPT') {
            setTripBookError(JSON.parse(message).message);
            // Alert.alert('', JSON.parse(message).message);
            alertGO({message: JSON.parse(message).message});
          } else if (errorType === 'WALLET_PIN_CODE_INVALID') {
            setTripBookError(JSON.parse(message).remainingAttempts);
            // Alert.alert('', `Incorrect Pin, remaining attempts: ${JSON.parse(message).remainingAttempts}`);
            alertGO({message: `Incorrect Pin, remaining attempts: ${JSON.parse(message).remainingAttempts}`});
          } else if (errorType === 'ExecutionTimeout') {
            alertGO({message});
          } else if (errorType === 'CANCELLATION_CHARGE_OUTSTANDING') {
            setViewOutstandingFeeModal(true);
          } else {
            console.log('ELSE ERROR:', error);
            // Alert.alert('', 'Something went wrong...');
            alertGO({title: 'Whooops', message: 'May kaunting aberya, ka-toktok. Keep calm and try again.'});
          }
        });
      }
    },
    onCompleted: response => {
      dispatch({
        type: 'SET_TOKTOKGO_BOOKING',
        payload: response.goTripBook.trip,
      });
      if (details.paymentMethod == 'TOKTOKWALLET') {
        navigation.pop();
        setViewTokwaPaymentProcessedModal(true);
      } else {
        navigation.pop();
        navigation.replace('ToktokGoFindingDriver', {
          popTo: popTo + 1,
          decodedPolyline,
        });
      }
    },
  });

  const [tripInitializePayment, {loading: TIPLoading}] = useMutation(GO_TRIP_INITIALIZE_PAYMENT, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    onError: error => {
      const {graphQLErrors, networkError} = error;
      if (networkError) {
        Alert.alert('', 'Network error occurred. Please check your internet connection.');
      } else if (graphQLErrors.length > 0) {
        graphQLErrors.map(({message, locations, path, errorType}) => {
          console.log(message);
          if (errorType === 'INTERNAL_SERVER_ERROR') {
            alertGO({message});
          } else if (errorType === 'BAD_USER_INPUT') {
            alertGO({message});
          } else if (errorType === 'AUTHENTICATION_ERROR') {
            // Do Nothing. Error handling should be done on the scren
          } else if (errorType === 'WALLET_PIN_CODE_MAX_ATTEMPT') {
            setTripBookError(JSON.parse(message).message);
            // Alert.alert('', JSON.parse(message).message);
            alertGO({message: JSON.parse(message).message});
          } else if (errorType === 'ExecutionTimeout') {
            alertGO({message});
          } else {
            console.log('ELSE ERROR:', error);
            // Alert.alert('', 'Something went wrong...');
            alertGO({title: 'Whooops', message: 'May kaunting aberya, ka-toktok. Keep calm and try again.'});
          }
        });
      }
    },
    onCompleted: response => {
      if (response?.goTripInitializePayment?.validator == 'TPIN') {
        navigation.navigate('ToktokWalletTPINValidator', {
          callBackFunc: tripBooking,
          data: {
            paymentHash: response?.goTripInitializePayment?.hash,
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
    setIsNotVoucherApplicable(false);
    setSelectedVouchers(null);
    dispatch({
      type: 'SET_TOKTOKGO_BOOKING_DETAILS',
      payload: {...details, voucher: null},
    });
    setVoucherRemoved(true);
    setTimeout(() => {
      setVoucherRemoved(false);
    }, 3000);
  };

  // TODO: This will be used on onSelectVoucher
  const dispatchRequest = () => {
    setLoading(true);
    dispatch({
      type: 'SET_TOKTOKGO_BOOKING_DETAILS',
      payload: {...details, vehicleType: selectedVehicle.vehicleType},
    });
    console.log({
      input: {
        vehicleTypeRateHash: selectedVehicle.hash,
        voucherHash: selectedVouchers?.hash,
      },
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
    setSelectedVouchers(details.voucher);
    if (details.voucher != null) {
      setVoucherUsed(true);
      setTimeout(() => {
        setVoucherUsed(false);
      }, 3000);
    } else {
      setVoucherUsed(false);
    }
  }, [details.voucher]);

  useEffect(() => {
    setLoading(true);
    if (selectedVehicle) {
      dispatchRequest();
    }
  }, [selectedVehicle, selectedVouchers]);

  const tripBooking = ({pinCode, data}, headCount) => {
    if (!session.userHash) {
      return Alert.alert('', 'Please restart your application!');
    }
    tripBook({
      variables: {
        input: {
          userHash: session.userHash,
          tripFareHash: details?.rate?.hash,
          routeHash: routeDetails?.hash,
          passengerCount: selectedPaymentMethod == 'CASH' ? headCount : selectedSeatNum,
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
    if (details.voucher == null) {
      setSelectedSeatNum(num);
      SheetManager.hide('passenger_capacity');
      // setvoucherRemovedVisible(true);
      setTimeout(() => {
        if (selectedPaymentMethod == 'CASH') {
          tripBooking({pinCode: null}, num);
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
    } else if (selectedPaymentMethod == 'CASH' && details.voucher.isCash == 0) {
      SheetManager.hide('passenger_capacity');
      setvoucherTextMessage('WrongPaymentMethod');
      setvoucherRemovedVisible(true);
    } else if (selectedPaymentMethod == 'TOKTOKWALLET' && details.voucher.isTokwa == 0) {
      SheetManager.hide('passenger_capacity');
      setvoucherTextMessage('WrongPaymentMethod');
      setvoucherRemovedVisible(true);
    } else {
      setSelectedSeatNum(num);
      SheetManager.hide('passenger_capacity');
      // setvoucherRemovedVisible(true);
      setTimeout(() => {
        if (selectedPaymentMethod == 'CASH') {
          tripBooking({pinCode: null}, num);
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
    }
  };

  const onProceedToBooking = () => {
    setSelectedVouchersNull();
    dispatchRequest();
    setvoucherRemovedVisible(false);
    setBookingState(true);
  };

  useEffect(() => {
    if (proceedBooking) {
      if (selectedPaymentMethod == 'CASH') {
        tripBooking({pinCode: null}, selectedSeatNum);
      } else {
        tripInitializePayment({
          variables: {
            input: {
              tripFareHash: details?.rate?.hash,
            },
          },
        });
      }
    }
  }, [proceedBooking]);

  const [getTripsConsumer] = useLazyQuery(GO_GET_TRIPS_CONSUMER, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      if (response) {
        setOutstandingFee(response?.goGetTripsConsumer[0]?.cancellation);
      }
    },
  });

  useFocusEffect(
    useCallback(() => {
      getTripsConsumer({
        variables: {
          input: {
            tag: 'PENDING',
            cancellationChargeStatus: 'PENDING',
          },
        },
      });
    }, []),
  );

  const closeOutstandingFeeModal = () => {
    setViewOutstandingFeeModal(false);

    dispatch({
      type: 'SET_TOKTOKGO_BOOKING_DETAILS',
      payload: {...details, paymentMethod: 'TOKTOKWALLET'},
    });
    navigation.pop();
  };

  const tokwaPaymentConfirmed = () => {
    navigation.pop();
    navigation.replace('ToktokGoFindingDriver', {
      popTo: popTo + 1,
      decodedPolyline,
    });
    setViewTokwaPaymentProcessedModal(false);
  };

  const handleVoucherRemoved = () => {
    setvoucherRemovedVisible(false);
    setSelectedVouchersNull();
  };

  const checkPaymentMethod = () => {
    if (selectedVouchers) {
      if (selectedVouchers?.isCash && !selectedVouchers?.isTokwa) {
        selectedPaymentMethod == 'TOKTOKWALLET' ? setIsNotVoucherApplicable(false) : setIsNotVoucherApplicable(true);
      } else if (!selectedVouchers?.isCash && selectedVouchers?.isTokwa) {
        selectedPaymentMethod == 'CASH' ? setIsNotVoucherApplicable(false) : setIsNotVoucherApplicable(true);
      } else {
        setIsNotVoucherApplicable(false);
      }
    }
  };

  const renderContent = () => (
    <View style={styles.card}>
      <BookingDistanceTime quotationData={quotationDataResult} loading={loading} />
      <BookingSelectVehicle
        loading={loading}
        data={quotationDataResult}
        selectedVehicle={selectedVehicle}
        navigation={navigation}
        selectVehicle={selectVehicle}
        setViewPriceNote={setViewPriceNote}
      />
      <BookingVoucher
        navigation={navigation}
        selectedVouchers={selectedVouchers}
        setSelectedVouchersNull={setSelectedVouchersNull}
        selectedPaymentMethod={selectedPaymentMethod}
        isNotVoucherApplicable={isNotVoucherApplicable}
      />
      <BookingBreakdown
        selectedVehicle={selectedVehicle}
        loading={loading}
        details={details}
        setViewOutstandingFeeInfoModal={setViewOutstandingFeeInfoModal}
      />
      <BookingTotal loading={loading} details={details} />
      <View style={{height: FULLSCREEN_HEIGHT * 0.25}} />
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
          <Image source={ArrowLeftIcon} resizeMode={'contain'} style={[styles.iconDimensions, {marginLeft: 16}]} />
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
      <TokwaPaymentProcessedModal
        viewTokwaPaymentProcessedModal={viewTokwaPaymentProcessedModal}
        amount={details?.rate?.tripFare?.total}
        tokwaPaymentConfirmed={tokwaPaymentConfirmed}
      />

      <OutstandingFeeModal
        closeOutstandingFeeModal={closeOutstandingFeeModal}
        viewOutstandingFeeModal={viewOutstandingFeeModal}
        outstandingFee={outstandingFee}
      />
      <PaymentMethodModal
        navigation={navigation}
        viewSelectPaymentModal={viewSelectPaymentModal}
        setViewSelectPaymentModal={setViewSelectPaymentModal}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        setSelectedVouchers={setSelectedVouchers}
        details={details}
        tokwaAccount={tokwaAccount}
        getMyAccountLoading={getMyAccountLoading}
        checkPaymentMethod={checkPaymentMethod}
      />

      <PaymentSuccesModal
        viewPaymenetSucessModal={viewPaymenetSucessModal}
        setViewPaymenetSucessModal={setViewPaymenetSucessModal}
      />
      <FeeInfoModal vissible={viewOutstandingFeeInfoModal} setVissible={setViewOutstandingFeeInfoModal} />
      <PricesNoteModal viewPriceNote={viewPriceNote} setViewPriceNote={setViewPriceNote} />
      <VoucherRemovedModal
        voucherRemovedVisible={voucherRemovedVisible}
        setvoucherRemovedVisible={setvoucherRemovedVisible}
        handleVoucherRemoved={handleVoucherRemoved}
        voucherTextMessage={voucherTextMessage}
        onProceedToBooking={onProceedToBooking}
      />
      <VoucherUsedModal isVissible={voucherUsed} />
      <VoucherUsedModalRemoved isVissible={voucherRemoved} />
      <BookingMap
        decodedPolyline={decodedPolyline}
        routeDetails={routeDetails}
        origin={origin}
        destination={destination}
      />

      <View style={styles.buttonContainer}>
        <BookingSelectPaymentMethod
          viewPaymenetSucessModal={viewPaymenetSucessModal}
          setViewSelectPaymentModal={setViewSelectPaymentModal}
          details={details}
          tokwaAccount={tokwaAccount}
          getMyAccountLoading={getMyAccountLoading}
          navigation={navigation}
        />
        <BookingConfirmButton SheetManager={SheetManager} tokwaAccount={tokwaAccount} details={details} />
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
    marginTop: 3,
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
      height: 2,
    },
    shadowRadius: 3.84,
    shadowOpacity: 0.2,
    elevation: 5,
    borderTopColor: '#F8F8F8',
    borderTopWidth: 2,
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
  shimmer: {
    width: 382,
    height: 16,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: constants.COLOR.LIGHT,
    marginBottom: 16,
    marginTop: 14,
    width: 382,
  },
});
