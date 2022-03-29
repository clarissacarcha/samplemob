import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import FIcon from 'react-native-vector-icons/Fontisto';

export const BookingConfirmButton = ({}) => {
  return (
    <TouchableOpacity style={styles.buttonWrapper}>
      <Text style={styles.confirmText}>Confirm Booking</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 5,
    paddingVertical: 11,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    color: CONSTANTS.COLOR.WHITE,
  },
});
