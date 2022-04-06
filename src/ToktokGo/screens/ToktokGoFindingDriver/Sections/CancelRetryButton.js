import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';

export const CancelRetryButton = ({}) => {
  return (
    <>
      {false && (
        <View style={styles.cancelContainer}>
          <Text style={styles.textStyle}>Cancel</Text>
        </View>
      )}
      {true && (
        <View style={styles.retryContainer}>
          <View style={styles.cancelButtonContainer}>
            <Text style={styles.textStyle}>Cancel</Text>
          </View>

          <View style={styles.retryButtonContainer}>
            <Text style={styles.cancelTextStyle}>Retry</Text>
          </View>
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
