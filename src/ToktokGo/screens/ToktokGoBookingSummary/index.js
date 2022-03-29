import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import constants from '../../../common/res/constants';
import BookingDummyData from '../../components/BookingDummyData';
import {BookingDistanceTime, BookingSelectVehicle, BookingSelectPaymentMethod, BookingConfirmButton} from './Sections';

const ToktokGoBookingSummary = () => {
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={[styles.card2]} />
      <View style={[styles.card]}>
        <BookingDistanceTime />
        <View style={styles.divider} />
        <BookingSelectVehicle data={BookingDummyData.vehicles} />
        <View style={styles.divider} />
        <BookingSelectPaymentMethod />
        <BookingConfirmButton />
      </View>
    </View>
  );
};

export default ToktokGoBookingSummary;

const styles = StyleSheet.create({
  card: {
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
    height: '60%',
  },
  card2: {
    position: 'absolute',
    bottom: 3,
    zIndex: 999,
    width: '100%',
    backgroundColor: constants.COLOR.ORANGE,
    marginTop: 8,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    height: '60%',
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: constants.COLOR.LIGHT,
    marginVertical: 16,
    marginHorizontal: -16,
  },
});
