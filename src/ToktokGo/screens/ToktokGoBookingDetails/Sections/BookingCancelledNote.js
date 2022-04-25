import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';

export const BookingCancelledNote = ({}) => {
  return (
    <View style={styles.contentCard}>
      {true && (
        <Text style={styles.cancelledText}>
          Booking was cancelled by<Text style={styles.bold}> Driver</Text>
        </Text>
      )}
      {false && <Text style={styles.cancelledText}>You cancelled this booking</Text>}
      {false && (
        <Text style={styles.cancelledText}>
          Booking was cancelled by<Text style={styles.bold}> Toktok Operations</Text>
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bold: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
  },
  cancelledText: {
    textAlign: 'center',
    color: CONSTANTS.COLOR.DARK,
  },
  contentCard: {
    alignItems: 'center',
    marginBottom: 47,
  },
});
