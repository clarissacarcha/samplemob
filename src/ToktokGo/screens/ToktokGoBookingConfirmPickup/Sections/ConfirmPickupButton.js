import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import {ThrottledOpacity} from '../../../../components_section';

export const ConfirmPickupButton = ({onConfirm}) => {
  return (
    <ThrottledOpacity delay={500} onPress={onConfirm} style={styles.buttonWrapper}>
      <Text style={styles.confirmText}>Confirm Pick-Up</Text>
    </ThrottledOpacity>
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
