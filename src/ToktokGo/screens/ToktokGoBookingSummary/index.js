import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Image, StatusBar} from 'react-native';
import constants from '../../../common/res/constants';
import BookingDummyData from '../../components/BookingDummyData';
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

const ToktokGoBookingSummary = ({navigation}) => {
  const [selectedVehicle, setSelectedVehicle] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(1);

  const [viewSelectPaymentModal, setViewSelectPaymentModal] = useState(false);
  const [viewPaymenetSucessModal, setViewPaymenetSucessModal] = useState(false);

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

      <BookingMap />

      <View style={[styles.card2]} />
      <View style={[styles.card]}>
        <BookingDistanceTime />
        <View style={styles.divider} />

        <BookingSelectVehicle
          data={BookingDummyData.vehicles}
          setSelectedVehicle={setSelectedVehicle}
          selectedVehicle={selectedVehicle}
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
    flex: 1,
    position: 'absolute',
    paddingTop: 13,
    paddingHorizontal: 16,
    bottom: 0,
    zIndex: 999,
    width: '100%',
    backgroundColor: constants.COLOR.WHITE,
    marginTop: 8,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    height: true ? '58%' : '60%', // if tokwa insufficient balance, use 60%
  },
  card2: {
    flex: 1,
    position: 'absolute',
    bottom: 3,
    zIndex: 999,
    width: '100%',
    backgroundColor: constants.COLOR.ORANGE,
    marginTop: 8,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    height: true ? '58%' : '60%', // if tokwa insufficient balance, use 60%
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
