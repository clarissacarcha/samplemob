import React from 'react';
import {Text, StyleSheet, Image, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import voucher_image from '../../../../assets/toktokgo/voucher.png';
import IOIcons from 'react-native-vector-icons/Ionicons';

import ArrowRightIcon from '../../../../assets/icons/arrow-right-icon.png';
import {numberFormat} from '../../../../helper';

export const BookingTotal = ({loading, details}) => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.elementWrapper}>
          <Text style={styles.textStyle}>Total</Text>
        </View>
        <View style={styles.elementWrapper}>
          {loading ? (
            <ActivityIndicator color={CONSTANTS.COLOR.ORANGE} />
          ) : (
            <Text style={styles.seeAlltextStyle}>
              ₱{numberFormat(details?.rate?.tripFare?.total ? details?.rate?.tripFare?.total : 0)}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.divider} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 19,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  cashInWrapper: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: CONSTANTS.COLOR.ORANGE,
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  elementWrapper: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.XL + 1,
  },
  seeAlltextStyle: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.L,
  },
  cashIntextStyle: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.S,
  },
  arrowIconStyle: {
    height: 9,
    width: 6,
    marginLeft: 10,
  },
  walletIconStyle: {
    width: 40,
    height: 34,
  },
  warningIconStyle: {
    width: 17,
    height: 17,
  },
  warningWrapper: {
    flexDirection: 'row',
    marginTop: -12,
    marginBottom: 16,
  },
  warningText: {
    fontSize: CONSTANTS.FONT_SIZE.S,
    marginLeft: 9,
    color: CONSTANTS.COLOR.RED,
  },
  noTokWa: {
    textAlign: 'center',
    color: CONSTANTS.COLOR.ORANGE,
    textDecorationLine: 'underline',
    fontSize: CONSTANTS.FONT_SIZE.S,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: CONSTANTS.COLOR.LIGHT,
    marginBottom: 16,
    marginHorizontal: -16,
  },
  appliedVoucher: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    backgroundColor: CONSTANTS.COLOR.ORANGE,
    flexDirection: 'row',
    alignItems: 'center',
  },
  appliedVoucherText: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    color: CONSTANTS.COLOR.WHITE,
    fontSize: CONSTANTS.FONT_SIZE.S,
  },
  appliedVoucherClose: {
    fontFamily: CONSTANTS.FONT_FAMILY.BOLD,
    color: CONSTANTS.COLOR.WHITE,
    fontSize: CONSTANTS.FONT_SIZE.M,
    marginLeft: 3,
  },
});
