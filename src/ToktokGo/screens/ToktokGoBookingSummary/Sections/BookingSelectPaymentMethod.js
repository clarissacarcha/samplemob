import React from 'react';
import {Text, StyleSheet, Image, View, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';

import ArrowRightIcon from '../../../../assets/icons/arrow-right-icon.png';
import WalletIcon from '../../../../assets/images/Wallet.png';
import CashIcon from '../../../../assets/images/CashIcon.png';

export const BookingSelectPaymentMethod = ({}) => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.elementWrapper}>
          <Text style={styles.textStyle}>Payment Method</Text>
        </View>

        <TouchableOpacity style={styles.elementWrapper}>
          <Text style={styles.seeAlltextStyle}>See All</Text>
          <Image source={ArrowRightIcon} resizeMode={'contain'} style={styles.arrowIconStyle} />
        </TouchableOpacity>
      </View>

      {false && (
        <View style={styles.container}>
          <View style={styles.elementWrapper}>
            <Image source={WalletIcon} resizeMode={'contain'} style={styles.walletIconStyle} />
            <View style={{marginLeft: 8}}>
              <Text style={{color: CONSTANTS.COLOR.YELLOW}}>
                toktok<Text style={{color: CONSTANTS.COLOR.ORANGE}}>wallet</Text>
              </Text>
              <Text style={{fontSize: CONSTANTS.FONT_SIZE.S}}>Balance: ₱400.00</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.cashInWrapper}>
            <Text style={styles.cashIntextStyle}>Cash in</Text>
          </TouchableOpacity>
        </View>
      )}

      {true && (
        <View style={styles.container}>
          <View style={styles.elementWrapper}>
            <Image source={CashIcon} resizeMode={'contain'} style={styles.walletIconStyle} />
            <View style={{marginLeft: 8}}>
              <Text style={{color: CONSTANTS.COLOR.YELLOW, fontSize: CONSTANTS.FONT_SIZE.M}}>Cash</Text>
            </View>
          </View>
        </View>
      )}
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
});
