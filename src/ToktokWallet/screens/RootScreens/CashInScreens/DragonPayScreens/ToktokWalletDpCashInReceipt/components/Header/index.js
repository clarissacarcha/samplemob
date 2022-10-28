import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

//UTIL
import {moderateScale} from 'toktokwallet/helper';

//FONTS & COLORS & IMAGES
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';
import {bank_icon, cash_in} from 'toktokwallet/assets';

export const Header = ({route}) => {
  const {paymentMethodKey, paymentMethod} = route.params.transactionDetails;
  const logos = {
    onlineBank: bank_icon,
    onlineDebitCredit: bank_icon,
    otcBank: bank_icon,
    otcNonBank: bank_icon,
    jcWallet: cash_in.jc_wallet,
  };

  return (
    <View style={{alignItems: 'center'}}>
      {paymentMethodKey && <Image source={logos[paymentMethodKey]} style={styles.logo} />}
      <View style={paymentMethodKey ? styles.withLogo : styles.withoutLogo}>
        <Text style={styles.headerText}>{paymentMethod}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: moderateScale(50),
    height: moderateScale(30),
    marginBottom: moderateScale(10),
    resizeMode: 'contain',
  },
  withLogo: {
    marginTop: moderateScale(5),
  },
  withoutLogo: {
    marginVertical: moderateScale(10),
  },
  headerText: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
  },
  toktokText: {
    color: COLOR.ORANGE,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
  loadText: {
    color: COLOR.YELLOW,
    fontSize: FONT_SIZE.L,
    fontFamily: FONT.BOLD,
  },
});
