import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ImageBackground, Platform} from 'react-native';
import moment from 'moment';
import {PolicyNote} from 'toktokwallet/components';
import FastImage from 'react-native-fast-image';

//HELPER
import {moderateScale, currencyCode, numberFormat} from 'toktokwallet/helper';

// COLORS AND FONTS AND IMAGES
import {banner, no_profile_contact} from 'toktokwallet/assets';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SHADOW, SIZE} = CONSTANTS;

export const PaymentDetails = ({route, navigation}) => {
  const {recipientMobileNo, amount, emailAddress, note, recipientSelfieImage, recipientName} = route.params.formData;
  const [imageError, setImageError] = useState(false);

  return (
    <>
      <ImageBackground source={banner.banner_logo} resizeMode="cover">
        <View style={styles.headerContainer}>
          <FastImage
            source={imageError ? no_profile_contact : {uri: recipientSelfieImage, priority: FastImage.priority.high}}
            style={styles.headerLogo}
            onError={() => setImageError(true)}
          />
          <Text style={styles.otcDescription}>{recipientName}</Text>
        </View>
      </ImageBackground>
      <View style={{marginVertical: moderateScale(10)}}>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Send Money to</Text>
          <Text style={styles.description}>{recipientMobileNo}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Email Address </Text>
          <Text style={styles.description}>{emailAddress}</Text>
        </View>
        {!!note && (
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Note </Text>
            <Text style={styles.description}>{note}</Text>
          </View>
        )}
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
      </View>
      <View style={styles.totalSeparator} />
      <View style={styles.detailsContainer}>
        <Text style={styles.totalLabel}>Total </Text>
        <Text style={styles.totalLabel}>
          {currencyCode}
          {numberFormat(parseFloat(amount))}
        </Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('ToktokWalletTermsConditions')} style={styles.container}>
        <Text style={styles.terms}>
          <Text style={styles.footerText}>Please review the accuracy of the details provided and read our </Text>
          <Text style={[styles.footerText, styles.tnc]}>Terms and Conditions </Text>
          <Text style={styles.footerText}>before you proceed with your transaction.</Text>
        </Text>
      </TouchableOpacity>
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
    marginTop: Platform.OS === 'android' ? moderateScale(3) : 0,
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
    marginTop: moderateScale(15),
    marginBottom: moderateScale(15),
  },
  headerLogo: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(60),
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
  otcDescription: {
    fontSize: FONT_SIZE.M,
    marginTop: moderateScale(10),
  },
  nologo: {
    paddingVertical: moderateScale(20),
    fontSize: FONT_SIZE.M,
  },
  container: {
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
});
