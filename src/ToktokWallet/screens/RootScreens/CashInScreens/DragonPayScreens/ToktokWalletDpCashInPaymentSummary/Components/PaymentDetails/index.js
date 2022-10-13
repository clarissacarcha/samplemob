import React from 'react';
import {View, Text, StyleSheet, Image, ImageBackground, Platform} from 'react-native';

//HELPER
import {moderateScale, numberFormat, currencyCode} from 'toktokwallet/helper';

// COLORS AND FONTS AND IMAGES
import {banner, bank_icon, cash_in} from 'toktokwallet/assets';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const PaymentDetails = ({route, navigation}) => {
  const {method, methodKey, amount, accountName, accountNumber, processingFee} = route.params.transactionDetails;
  const logos = {
    onlineBank: bank_icon,
    onlineDebitCredit: bank_icon,
    otcBank: bank_icon,
    otcNonBank: bank_icon,
    jcWallet: cash_in.jc_wallet,
  };
  console.log(methodKey);
  return (
    <>
      <ImageBackground source={banner.banner_logo} resizeMode="cover">
        <View style={styles.headerContainer}>
          <View style={{justifyContent: 'center'}}>
            <Image source={logos[methodKey]} style={styles.headerLogo} />
          </View>
          <Text style={styles.otcDescription}>{method}</Text>
        </View>
      </ImageBackground>
      <View style={{marginVertical: moderateScale(10)}}>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Account Name</Text>
          <Text style={styles.description}>{accountName}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Account Number</Text>
          <Text style={styles.description}>{accountNumber}</Text>
        </View>
      </View>
      <View style={styles.line} />
      <View style={{marginVertical: moderateScale(10)}}>
        <View style={[styles.detailsContainer]}>
          <Text style={styles.label}>Amount </Text>
          <Text style={styles.description}>
            {currencyCode}
            {numberFormat(amount)}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Service Fee </Text>
          <Text style={styles.description}>
            {currencyCode}
            {numberFormat(processingFee)}
          </Text>
        </View>
      </View>
      <View style={styles.totalSeparator} />
      <View style={styles.detailsContainer}>
        <Text style={styles.totalLabel}>Total </Text>
        <Text style={styles.totalLabel}>
          {currencyCode}
          {numberFormat(parseFloat(amount) + parseFloat(processingFee))}
        </Text>
      </View>
      <View style={styles.totalSeparator} />
      <View style={styles.container}>
        <Text style={styles.terms}>
          <Text style={styles.footerText}>Please review the accuracy of the details provided and read our </Text>
          <Text
            style={[styles.footerText, styles.tnc]}
            onPress={() => navigation.navigate('ToktokWalletTermsConditions')}>
            Terms and Conditions{' '}
          </Text>
          <Text style={styles.footerText}>before you proceed with your transaction.</Text>
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  note: {
    flexDirection: 'row',
    backgroundColor: COLOR.LIGHT_YELLOW,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(16),
  },
  noteText: {
    color: '#F6841F',
    fontSize: FONT_SIZE.S,
    marginHorizontal: moderateScale(10),
  },
  noteLogo: {
    height: moderateScale(12),
    width: moderateScale(12),
    marginTop: Platform.OS == 'android' ? moderateScale(3) : 0,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: moderateScale(16),
    marginVertical: moderateScale(8),
  },
  totalLabel: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.BOLD,
    color: COLOR.ORANGE,
    marginVertical: moderateScale(8),
  },
  label: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
    width: '50%',
    paddingRight: moderateScale(10),
  },
  description: {
    textAlign: 'right',
    flexShrink: 1,
    fontSize: FONT_SIZE.M,
  },
  logo: {
    width: null,
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: moderateScale(20),
    marginBottom: moderateScale(20),
  },
  headerLogo: {
    width: moderateScale(50),
    height: moderateScale(30),
    resizeMode: 'contain',
  },
  walletName: {
    fontSize: FONT_SIZE.M,
    marginTop: moderateScale(10),
  },
  line: {
    height: 8,
    marginHorizontal: -16,
    backgroundColor: COLOR.LIGHT,
  },
  totalSeparator: {
    height: 2,
    marginHorizontal: 16,
    backgroundColor: COLOR.LIGHT,
  },
  walletLogo: {
    width: moderateScale(110),
    height: moderateScale(40),
    resizeMode: 'contain',
    flexShrink: 1,
  },
  container: {
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(10),
  },
  terms: {
    textAlign: 'left',
    marginBottom: moderateScale(15),
    fontSize: FONT_SIZE.S,
  },
  tnc: {
    color: '#F6841F',
  },
  footerText: {
    fontSize: FONT_SIZE.S,
    color: '#525252',
  },
  otcDescription: {
    fontSize: FONT_SIZE.M,
    marginTop: moderateScale(10),
  },
  nologo: {
    paddingVertical: moderateScale(20),
    fontSize: FONT_SIZE.M,
  },
});
