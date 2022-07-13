import React from 'react';
import {View, Text, StyleSheet, Image, ImageBackground, Platform} from 'react-native';
import moment from 'moment';
import {PolicyNote} from 'toktokwallet/components';

//HELPER
import {moderateScale, currencyCode, numberFormat} from 'toktokwallet/helper';

// COLORS AND FONTS AND IMAGES
import {banner, info_icon} from 'toktokwallet/assets';
import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SHADOW, SIZE} = CONSTANTS;

export const PaymentDetails = ({route}) => {
  const {recipientName, recipientMobileNo, email, dateOfClaim, amount, purpose, otcPartnerDetails, totalServiceFee} =
    route.params.transactionDetails;

  return (
    <>
      <ImageBackground source={banner.banner_logo} resizeMode="cover">
        <View style={styles.headerContainer}>
          {otcPartnerDetails.logo && (
            <View style={{justifyContent: 'center'}}>
              <Image
                source={{
                  uri: otcPartnerDetails.logo,
                }}
                style={styles.headerLogo}
              />
            </View>
          )}
          <Text style={otcPartnerDetails.logo ? styles.otcDescription : styles.nologo}>
            {otcPartnerDetails.description}
          </Text>
        </View>
      </ImageBackground>
      <PolicyNote
        note1="All transactions made before 01.00 PM will be processed within the day."
        note2="All transactions after 01.00 PM will be processed the next banking day."
      />
      <View style={{marginVertical: moderateScale(10)}}>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Recipient Name</Text>
          <Text style={styles.description}>{recipientName}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Recipient Mobile Number</Text>
          <Text style={styles.description}>{recipientMobileNo}</Text>
        </View>
        {!!email && (
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Email Address </Text>
            <Text style={styles.description}>{email}</Text>
          </View>
        )}
        {/* <View style={styles.detailsContainer}>
          <Text style={styles.label}>Date of Claim </Text>
          <Text style={styles.description}>{moment(dateOfClaim).format('ll')}</Text>
        </View> */}
        {!!purpose && (
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Purpose </Text>
            <Text style={styles.description}>{purpose}</Text>
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
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Service Fee </Text>
          <Text style={styles.description}>
            {currencyCode}
            {numberFormat(totalServiceFee)}
          </Text>
        </View>
      </View>
      <View style={styles.totalSeparator} />
      <View style={styles.detailsContainer}>
        <Text style={styles.totalLabel}>Total </Text>
        <Text style={styles.totalLabel}>
          {currencyCode}
          {numberFormat(parseFloat(amount) + parseFloat(totalServiceFee))}
        </Text>
      </View>
      <View style={styles.totalSeparator} />
      <View style={styles.container}>
        <Text style={styles.terms}>
          <Text style={styles.footerText}>Please review the accuracy of the details provided and read our </Text>
          <Text style={[styles.tnc, styles.footerText]}>Terms and Conditions </Text>
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
    marginTop: moderateScale(15),
    marginBottom: moderateScale(15),
  },
  headerLogo: {
    width: moderateScale(130),
    height: moderateScale(60),
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
