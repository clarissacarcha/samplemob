import React, {useContext, useRef, useState, useEffect} from 'react';
import {View, Text, Dimensions, StyleSheet, TextInput, Image, ImageBackground} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useThrottle} from 'src/hooks';
import validator from 'validator';
import {LoadingIndicator} from 'toktokbills/components';

//HELPER
import {moderateScale, formatAmount, numberFormat, currencyCode} from 'toktokbills/helper';

// COLORS AND FONTS AND IMAGES
import CONSTANTS from 'common/res/constants';
import {banner_bg} from 'toktokbills/assets';
import {toktokwallet_logo} from 'toktokbills/assets/images';
import InfoIcon from '../../../../../../assets/icons/InfoIcon.png';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SHADOW, SIZE} = CONSTANTS;
const {width, height} = Dimensions.get('window');

export const PaymentDetails = ({paymentData}) => {
  const navigation = useNavigation();
  const {firstField, secondField, amount, email, billType, convenienceFee, billItemSettings} = paymentData;
  const totalAmount =
    parseInt(amount) +
    billItemSettings?.commissionRateDetails?.providerServiceFee +
    billItemSettings?.commissionRateDetails?.systemServiceFee;
  const [logo, setLogo] = useState({height: 0, width: 0});
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    Image.getSize(billItemSettings.logo, (width, height) => {
      let size = height > width ? height - width : width - height;
      if (size > 10) {
        if (width > moderateScale(80) || height > moderateScale(40)) {
          setLogo({width: 80, height: 50});
        } else {
          setLogo({width, height});
        }
      } else {
        setLogo({width: 50, height: 50});
      }
    });
  }, []);

  return (
    <>
      <ImageBackground source={banner_bg} resizeMode="cover">
        <View style={styles.headerContainer}>
          <View style={{justifyContent: 'center'}}>
            {imageLoading && (
              <View style={{position: 'absolute', right: 0, left: 0}}>
                <LoadingIndicator isLoading={true} size="small" />
              </View>
            )}
            <Image
              source={{uri: billItemSettings?.logo}}
              style={styles.headerLogo}
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
            />
          </View>
          <Text style={styles.billerName}>{billItemSettings?.descriptions}</Text>
        </View>
      </ImageBackground>
      <View style={styles.note}>
        <Image source={InfoIcon} style={styles.noteLogo} />
        <View>
          <Text style={styles.noteText}>{billItemSettings?.itemDocumentDetails?.paymentPolicy1}</Text>
          <Text style={styles.noteText}>{billItemSettings?.itemDocumentDetails?.paymentPolicy2}</Text>
        </View>
      </View>
      <View></View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>{billItemSettings.firstFieldName} </Text>
        <Text style={styles.description}>{firstField}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>{billItemSettings.secondFieldName} </Text>
        <Text style={styles.description}>{secondField}</Text>
      </View>
      <View style={styles.line} />
      <View style={[styles.detailsContainer, {marginBottom: moderateScale(-2)}]}>
        <Text style={styles.label}>Payment Method </Text>
        <Image source={toktokwallet_logo} style={[styles.walletLogo]} />
      </View>
      <View style={[styles.detailsContainer]}>
        <Text style={styles.label}>Payment Amount </Text>
        <Text style={styles.description}>
          {currencyCode}
          {numberFormat(amount)}
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Convenience Fee </Text>
        <Text style={styles.description}>
          {currencyCode}
          {numberFormat(billItemSettings?.commissionRateDetails?.providerServiceFee)}
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Toktok Service Fee</Text>
        <Text style={styles.description}>
          {currencyCode}
          {numberFormat(billItemSettings?.commissionRateDetails?.systemServiceFee)}
        </Text>
      </View>
      <View style={styles.totalSeparator} />
      <View style={styles.detailsContainer}>
        <Text style={styles.totalLabel}>Total </Text>
        <Text style={styles.totalLabel}>
          {currencyCode}
          {numberFormat(totalAmount)}
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
    paddingVertical: moderateScale(16),
  },
  noteText: {
    color: '#F6841F',
    fontSize: FONT_SIZE.S,
  },
  noteLogo: {
    height: 13,
    width: 13,
    marginRight: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: moderateScale(16),
    marginVertical: moderateScale(8),
  },
  totalLabel: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.BOLD,
    color: COLOR.ORANGE,
  },
  label: {
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
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
  billerName: {
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
