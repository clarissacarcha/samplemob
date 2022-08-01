import React from 'react';
import {Text, StyleSheet, Image, View, TouchableOpacity} from 'react-native';
import CONSTANTS from '../../../../common/res/constants';

import ArrowRightIcon from '../../../../assets/icons/arrow-right-icon.png';
import WalletIcon from '../../../../assets/images/Wallet.png';
import CashIcon from '../../../../assets/images/CashIcon.png';
import WarningIcon from '../../../../assets/icons/Warning.png';

export const BookingSelectPaymentMethod = ({setViewSelectPaymentModal, viewPaymenetSucessModal, details}) => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.elementWrapper}>
          <Text style={styles.textStyle}>Payment Method</Text>
        </View>

        {/* <TouchableOpacity
          style={styles.elementWrapper}
          onPress={() => setViewSelectPaymentModal(!viewPaymenetSucessModal)}>
          <Text style={styles.seeAlltextStyle}>See All</Text>
          <Image source={ArrowRightIcon} resizeMode={'contain'} style={styles.arrowIconStyle} />
        </TouchableOpacity> */}
      </View>

      {/*---Todo: add condition here---*/}
      {details.paymentMethod == 1 && (
        <>
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

            {/*---Todo: add condition here---*/}
            {true && (
              <TouchableOpacity style={styles.cashInWrapper}>
                <Text style={styles.cashIntextStyle}>Cash In</Text>
              </TouchableOpacity>
            )}

            {/*---Todo: add condition here---*/}
            {false && (
              <TouchableOpacity>
                <Text style={styles.noTokWa}>Create your toktokwallet</Text>
                <Text style={styles.noTokWa}>account now!</Text>
              </TouchableOpacity>
            )}
          </View>

          {/*---Todo: add condition here---*/}
          {false && (
            <View style={styles.warningWrapper}>
              <Image source={WarningIcon} resizeMode={'contain'} style={styles.warningIconStyle} />
              <Text style={styles.warningText}>Insufficient Balance</Text>
            </View>
          )}
        </>
      )}

      {/*---Todo: add condition here---*/}
      {details.paymentMethod == 2 && (
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
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
    color: CONSTANTS.COLOR.ALMOST_BLACK,
    fontSize: CONSTANTS.FONT_SIZE.M,
  },
  seeAlltextStyle: {
    fontFamily: CONSTANTS.FONT_FAMILY.REGULAR,
    color: CONSTANTS.COLOR.ORANGE,
    fontSize: CONSTANTS.FONT_SIZE.M,
  },
  cashIntextStyle: {
    fontFamily: CONSTANTS.FONT_FAMILY.SEMI_BOLD,
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
});
