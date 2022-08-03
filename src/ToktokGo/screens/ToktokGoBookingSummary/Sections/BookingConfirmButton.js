import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import FIcon from 'react-native-vector-icons/Fontisto';

export const BookingConfirmButton = ({SheetManager}) => {
  return (
    <TouchableOpacity style={styles.buttonWrapper} onPress={() => SheetManager.show('passenger_capacity')}>
      <Text style={styles.confirmText}>Confirm Booking</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 5,
    marginBottom: 16,
    paddingVertical: 11,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    color: CONSTANTS.COLOR.WHITE,
  },
});
