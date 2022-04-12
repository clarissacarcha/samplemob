import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image, StatusBar} from 'react-native';
import constants from '../../../common/res/constants';
import {SheetManager} from 'react-native-actions-sheet';
import {useDispatch, useSelector} from 'react-redux';
import {
  BookingDistanceTime,
  BookingSelectVehicle,
  BookingSelectPaymentMethod,
  BookingConfirmButton,
  BookingMap,
  BookingVoucher,
} from './Sections';
import {PaymentMethodModal, PaymentSuccesModal, PassengerCapacityActionSheet} from './Components';
import ArrowLeftIcon from '../../../assets/icons/arrow-left-icon.png';
import {GET_TRIP_FARE} from '../../graphql';
import {TOKTOK_GO_GRAPHQL_CLIENT} from '../../../graphql';
import {useLazyQuery} from '@apollo/react-hooks';

const ToktokGoBookingSummary = ({navigation, route}) => {
  const {popTo} = route.params;
  const {details, routeDetails, origin, destination} = useSelector(state => state.toktokGo);
  const {quotationDataResult, decodedPolyline} = route.params;
  const [viewSelectPaymentModal, setViewSelectPaymentModal] = useState(false);
  const [viewPaymenetSucessModal, setViewPaymenetSucessModal] = useState(false);
  const dispatch = useDispatch();
  const [selectedVehicle, setSelectedVehicle] = useState(quotationDataResult.vehicleTypeRates?.[0]);
  const [selectedVouchers, setSelectedVouchers] = useState(null);
  const [loading, setLoading] = useState(true);

  const [getTripFare, {called}] = useLazyQuery(GET_TRIP_FARE, {
    client: TOKTOK_GO_GRAPHQL_CLIENT,
    fetchPolicy: 'network-only',
    onCompleted: response => {
      dispatch({
        type: 'SET_TOKTOKGO_BOOKING_DETAILS',
        payload: {...details, rate: response.getTripFare},
      });
    },
    onError: error => console.log('error', error),
  });

  const selectVehicle = data => {
    setLoading(true);
    setSelectedVehicle(data);
  };

  const setSelectedVouchersNull = () => {
    setSelectedVouchers(null);
    dispatch({
      type: 'SET_TOKTOKGO_BOOKING_DETAILS',
      payload: {...details, voucher: null},
    });
  };

  const dispatchRequest = async () => {
    dispatch({
      type: 'SET_TOKTOKGO_BOOKING_DETAILS',
      payload: {...details, vehicleType: selectedVehicle.vehicleType},
    });
    getTripFare({
      variables: {
        input: {
          vehicleTypeRateHash: selectedVehicle.hash,
          voucherHash: selectedVouchers?.hash ? selectedVouchers?.hash : '',
        },
      },
    });
  };

  useEffect(() => {
    dispatchRequest();
  }, [selectedVehicle, selectedVouchers]);

  useEffect(() => {
    setSelectedVouchers(details.voucher);
  }, [details.voucher]);

  useEffect(() => {
    setLoading(false);
  }, [details]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.pop()}>
        <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
      </TouchableOpacity>

      <PassengerCapacityActionSheet
        navigation={navigation}
        popTo={popTo}
        details={details}
        decodedPolyline={decodedPolyline}
      />

      <PaymentMethodModal
        viewSelectPaymentModal={viewSelectPaymentModal}
        setViewSelectPaymentModal={setViewSelectPaymentModal}
        details={details}
      />

      <PaymentSuccesModal
        viewPaymenetSucessModal={viewPaymenetSucessModal}
        setViewPaymenetSucessModal={setViewPaymenetSucessModal}
      />

      <BookingMap
        decodedPolyline={decodedPolyline}
        routeDetails={routeDetails}
        origin={origin}
        destination={destination}
      />

      <View style={styles.card}>
        <BookingDistanceTime quotationData={quotationDataResult} />
        <BookingSelectVehicle
          data={quotationDataResult}
          selectedVehicle={selectedVehicle}
          navigation={navigation}
          selectVehicle={selectVehicle}
          loading={loading}
        />
        <BookingVoucher
          navigation={navigation}
          selectedVouchers={selectedVouchers}
          setSelectedVouchersNull={setSelectedVouchersNull}
        />
        <BookingSelectPaymentMethod
          viewPaymenetSucessModal={viewPaymenetSucessModal}
          setViewSelectPaymentModal={setViewSelectPaymentModal}
          details={details}
        />
        <BookingConfirmButton SheetManager={SheetManager} />
      </View>
    </View>
  );
};

export default ToktokGoBookingSummary;

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
});
