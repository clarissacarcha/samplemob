import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import {ThrottledOpacity} from '../../../../components_section';

export const CancelRetryButton = ({waitingStatus, initiateCancel, dismissBookingExpired, tripRebookFunc}) => {
  return (
    <>
      {waitingStatus ? (
        <ThrottledOpacity delay={500} style={styles.cancelContainer} onPress={initiateCancel}>
          <Text style={styles.textStyle}>Cancel</Text>
        </ThrottledOpacity>
      ) : (
        <View style={styles.retryContainer}>
          <ThrottledOpacity delay={500} style={styles.cancelButtonContainer} onPress={dismissBookingExpired}>
            <Text style={styles.textStyle}>Cancel</Text>
          </ThrottledOpacity>

          <ThrottledOpacity delay={500} style={styles.retryButtonContainer} onPress={tripRebookFunc}>
            <Text style={styles.cancelTextStyle}>Retry</Text>
          </ThrottledOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  cancelContainer: {
    marginVertical: 24,
    justifyContent: 'center',
    backgroundColor: CONSTANTS.COLOR.WHITE,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 5,
    paddingVertical: 11,
  },
  textStyle: {
    textAlign: 'center',
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    color: CONSTANTS.COLOR.ORANGE,
  },
  retryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
    flex: 1,
  },
  cancelButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: CONSTANTS.COLOR.WHITE,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 5,
    paddingVertical: 11,
    marginRight: 20,
  },
  retryButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    borderWidth: 1,
    borderColor: CONSTANTS.COLOR.ORANGE,
    borderRadius: 5,
    paddingVertical: 11,
  },
  cancelTextStyle: {
    textAlign: 'center',
    fontSize: CONSTANTS.FONT_SIZE.L,
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    color: CONSTANTS.COLOR.WHITE,
  },
});
