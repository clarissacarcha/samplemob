import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image, StatusBar} from 'react-native';
import constants from '../../../common/res/constants';
import {SheetManager} from 'react-native-actions-sheet';
import {
  BookingDistanceTime,
  BookingSelectVehicle,
  BookingSelectPaymentMethod,
  BookingConfirmButton,
  BookingMap,
} from './Sections';
import {PaymentMethodModal, PaymentSuccesModal, PassengerCapacityActionSheet} from './Components';
import ArrowLeftIcon from '../../../assets/icons/arrow-left-icon.png';

const ToktokGoBookingSummary = ({navigation, route}) => {
  const {quotationDataResult, decodedPolyline} = route.params;
  const [selectedVehicle, setSelectedVehicle] = useState('1');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(1);
  const [viewSelectPaymentModal, setViewSelectPaymentModal] = useState(false);
  const [viewPaymenetSucessModal, setViewPaymenetSucessModal] = useState(false);
  const [quotationData, setQuotationData] = useState(quotationDataResult);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.pop()}>
        <Image source={ArrowLeftIcon} resizeMode={'contain'} style={styles.iconDimensions} />
      </TouchableOpacity>

      <PassengerCapacityActionSheet />

      <PaymentMethodModal
        viewSelectPaymentModal={viewSelectPaymentModal}
        setViewSelectPaymentModal={setViewSelectPaymentModal}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
      />

      <PaymentSuccesModal
        viewPaymenetSucessModal={viewPaymenetSucessModal}
        setViewPaymenetSucessModal={setViewPaymenetSucessModal}
      />

      <BookingMap decodedPolyline={decodedPolyline} />

      <View style={styles.card}>
        <BookingDistanceTime quotationData={quotationData} />
        <View style={styles.divider} />

        <BookingSelectVehicle
          data={quotationData}
          setSelectedVehicle={setSelectedVehicle}
          selectedVehicle={selectedVehicle}
          navigation={navigation}
        />

        <View style={styles.divider} />

        <BookingSelectPaymentMethod
          setViewSelectPaymentModal={setViewSelectPaymentModal}
          selectedPaymentMethod={selectedPaymentMethod}
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
  divider: {
    borderBottomWidth: 2,
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
});
