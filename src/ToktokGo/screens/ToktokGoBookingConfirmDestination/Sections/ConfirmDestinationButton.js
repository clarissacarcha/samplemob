import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';

export const ConfirmDestinationButton = ({navigation}) => {
  return (
    <TouchableOpacity
      style={styles.buttonWrapper}
      onPress={() => {
        navigation.push('ToktokGoBookingConfirmPickup');
      }}>
      <Text style={styles.confirmText}>Confirm Destination</Text>
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
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    color: CONSTANTS.COLOR.WHITE,
  },
});
