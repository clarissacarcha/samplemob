import React from 'react';
import {View, Text, Dimensions, StyleSheet, TextInput, Image, ImageBackground} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useThrottle} from 'src/hooks';
import validator from 'validator';
import {LoadingIndicator} from 'toktokwallet/components';

//HELPER
import {moderateScale, currencyCode } from 'toktokwallet/helper';

// COLORS AND FONTS AND IMAGES
import CONSTANTS from 'common/res/constants';
import {banner} from 'toktokwallet/assets';
import InfoIcon from '../../../../../../assets/icons/InfoIcon.png';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SHADOW, SIZE} = CONSTANTS;
const {width, height} = Dimensions.get('window');

export const PaymentDetails = ({}) => {
  return (
    <>
      <ImageBackground source={banner.banner_logo} resizeMode="cover">
        <View style={styles.headerContainer}>
          <View style={{justifyContent: 'center'}}>
            {/* {/* {imageLoading && (
              <View style={{position: 'absolute', right: 0, left: 0}}>
                <LoadingIndicator isLoading={true} size="small" />
              </View>
            )} */}
            <Image
              source={{
                uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/98/LBC_Express_2013_Logo.svg/1200px-LBC_Express_2013_Logo.svg.png',
              }}
              style={styles.headerLogo}
              // onLoadStart={() => setImageLoading(true)}
              // onLoadEnd={() => setImageLoading(false)}
            />
          </View>
          <Text style={styles.walletName}>LBC Express</Text>
        </View>
      </ImageBackground>
      <View style={styles.note}>
          <Image
            source={InfoIcon}
            style={{height: 12, width: 12, marginRight: 20}}
          />
          <View>
            <Text style={styles.noteText}>All transactions made before 01.00 PM will be processed within the day.</Text>
            <Text style={styles.noteText}>All transactions after 01.00 PM will be processed the next banking day.</Text>
          </View>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Recipient Name</Text>
        <Text style={styles.description}>Juan Dela Cruz</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Recipient Mobile Number</Text>
        <Text style={styles.description}>09123456789</Text>
      </View>
      <View style={styles.detailsContainer}>
          <Text style={styles.label}>Email Address </Text>
          <Text style={styles.description}>juandelacruz@toktok.ph</Text>
      </View>
      <View style={styles.detailsContainer}>
          <Text style={styles.label}>Date of Claim</Text>
          <Text style={styles.description}>June 1, 2022</Text>
      </View>
      <View style={styles.detailsContainer}>
          <Text style={styles.label}>Purpose</Text>
          <Text style={styles.description}>Lorem Ipsum is simply dummy text of the printing and Lorem Ipsum is simply dummy text of the printing and</Text>
      </View>
      <View style={styles.line} />
      <View style={[styles.detailsContainer]}>
        <Text style={styles.label}>Amount </Text>
        <Text style={styles.description}>
          {currencyCode}
          2,000.00
        </Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Service Fee </Text>
        <Text style={styles.description}>
        {currencyCode}
          10.00
        </Text>
      </View>
      <View style={styles.totalSeparator} />
      <View style={styles.detailsContainer}>
        <Text style={styles.totalLabel}>Total </Text>
        <Text style={styles.totalLabel}>
        {currencyCode}
            2,000.00
        </Text>
      </View>
      <View style={styles.totalSeparator} />
    </>
  );
};

const styles = StyleSheet.create({
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.LIGHT_YELLOW,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(10),
  },
  noteText: {
    color: '#F6841F',
    fontSize: FONT_SIZE.S,
  },
  noteLogo: {
    height: 13,
    width: 13,
    marginRight: 8,
    marginTop: -16,
  },
  noteLogoPolicy1: {
    height: 13,
    width: 13,
    marginRight: 8,
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
});