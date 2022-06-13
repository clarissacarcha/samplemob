import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';

export const SeeBookingDetails = ({booking, navigation}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.push('SelectedBookingDetails', {
          booking: booking,
          label: ['Booking', 'Details'],
        });
      }}
      style={styles.buttonWrapper}>
      <Text style={styles.confirmText}>See Booking Details</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  buttonWrapper: {
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 20,
  },
  confirmText: {
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    color: CONSTANTS.COLOR.WHITE,
  },
});
