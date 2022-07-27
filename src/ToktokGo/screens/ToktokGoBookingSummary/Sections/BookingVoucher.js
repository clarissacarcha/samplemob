import React, {useState} from 'react';
import {Text, StyleSheet, Image, View, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';
import voucher_image from '../../../../assets/toktokgo/voucher.png';
import IOIcons from 'react-native-vector-icons/Ionicons';
import InfoIcon from '../../../../assets/images/info.png';

import ArrowRightIcon from '../../../../assets/icons/arrow-right-icon.png';

export const BookingVoucher = ({navigation, selectedVouchers, setSelectedVouchersNull, isNotVoucherApplicable}) => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.elementWrapper}>
          <Image source={voucher_image} style={{width: 22, height: 16, marginRight: 8}} resizeMode={'contain'} />
          <Text style={styles.textStyle}>Vouchers</Text>
        </View>

        {selectedVouchers ? (
          <View style={styles.elementWrapper}>
            <TouchableOpacity onPress={setSelectedVouchersNull}>
              <View style={styles.appliedVoucher}>
                <Text style={styles.appliedVoucherText}>{selectedVouchers.code}</Text>
                <IOIcons name={'close'} style={styles.appliedVoucherClose} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.push('ToktokGoBookingVouchers')}>
              <Image source={ArrowRightIcon} resizeMode={'contain'} style={styles.arrowIconStyle} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => navigation.push('ToktokGoBookingVouchers')} style={styles.elementWrapper}>
            <Text style={styles.seeAlltextStyle}>Select or Enter Code</Text>
            <Image source={ArrowRightIcon} resizeMode={'contain'} style={styles.arrowIconStyle} />
          </TouchableOpacity>
        )}
      </View>
      {isNotVoucherApplicable && (
        <View style={styles.warningContainer}>
          <Image source={InfoIcon} resizeMode={'contain'} style={styles.imgDimensions} />
          <Text style={styles.textStyles}>
            Your changes does not meet the Terms and Conditions of the voucher you used.
          </Text>
        </View>
      )}
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
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    color: CONSTANTS.COLOR.BLACK,
    fontSize: CONSTANTS.FONT_SIZE.M,
  },
  seeAlltextStyle: {
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.M,
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
  warningContainer: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: -16,
    backgroundColor: CONSTANTS.COLOR.LIGHT_YELLOW,
  },
  imgDimensions: {
    width: 13,
    height: 13,
    marginRight: 8,
    marginTop: 4,
  },
  textStyles: {
    color: CONSTANTS.COLOR.ORANGE,
  },
});
