import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView} from 'react-native';
import {LoadingIndicator} from 'toktokbills/components';

//UTIL
import {moderateScale, numberFormat, currencyCode} from 'toktokbills/helper';

//COMPONENTS
import {ReceiptSeparator} from '../../../../../components/Ui';

//FONTS & COLORS & IMAGES
import {onboarding_toktokbills} from 'toktokbills/assets';
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';
import moment from 'moment';
import DashedLine from 'react-native-dashed-line';

export const ReceiptDetails = ({route}) => {
  const {receipt, paymentData} = route.params;
  const {
    senderMobileNumber,
    destinationNumber,
    destinationIdentifier,
    amount,
    billerDetails,
    convenienceFee,
    referenceNumber,
    createdAt,
    toktokServiceCommission,
    providerServiceFee,
    systemServiceFee,
  } = receipt;
  const {emailAddress, billItemSettings, paymentType, payorType, itemCode, periodCoveredFrom, periodCoveredTo} =
    paymentData;
  const totalAmount = parseFloat(amount) + parseFloat(convenienceFee);
  const [logo, setLogo] = useState({height: 0, width: 0});
  const [imageLoading, setImageLoading] = useState(true);
  const [footerHeight, setFooterHeight] = useState(80);
  let firstFieldName = '';
  let secondFieldName = '';

  switch (itemCode) {
    case 'SSS':
      firstFieldName = 'Payment Reference Number (PRN)';
      secondFieldName = 'Customer Name';
      break;
    case 'PAG_IBIG':
      firstFieldName = 'Account Number';
      secondFieldName = 'Contact Number';
      break;
    default:
      firstFieldName = billItemSettings.firstFieldName;
      secondFieldName = billItemSettings.secondFieldName;
      break;
  }

  useEffect(() => {
    Image.getSize(billerDetails.logo, (width, height) => {
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
      <View style={styles.line} />
      <View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Service Reference Number </Text>
          <Text style={[styles.description, {color: COLOR.ORANGE, fontFamily: FONT.BOLD}]}>{referenceNumber}</Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Transaction Date </Text>
          <Text style={styles.description}>{moment(createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A')}</Text>
        </View>
        {!!paymentType?.description && (
          <View style={[styles.bodyContainer, styles.marginBottom15]}>
            <Text style={styles.title}>Payment Type</Text>
            <Text style={styles.description}>{paymentType.description}</Text>
          </View>
        )}
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>{firstFieldName}</Text>
          <Text style={styles.description}>{destinationNumber}</Text>
        </View>
        {!!payorType?.description && (
          <View style={[styles.bodyContainer, styles.marginBottom15]}>
            <Text style={styles.title}>Payor Type</Text>
            <Text style={styles.description}>{payorType.description}</Text>
          </View>
        )}
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>{secondFieldName} </Text>
          <Text style={styles.description}>{destinationIdentifier}</Text>
        </View>
        {periodCoveredFrom != '' && (
          <View style={[styles.bodyContainer, styles.marginBottom15]}>
            <Text style={styles.title}>Period Covered From</Text>
            <Text style={styles.description}>{moment(periodCoveredFrom).format('MM YYYY').replace(' ', '')}</Text>
          </View>
        )}
        {periodCoveredTo != '' && (
          <View style={[styles.bodyContainer, styles.marginBottom15]}>
            <Text style={styles.title}>Period Covered To</Text>
            <Text style={styles.description}>{moment(periodCoveredTo).format('MM YYYY').replace(' ', '')}</Text>
          </View>
        )}
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Toktokwallet Account Number </Text>
          <Text style={styles.description}>{senderMobileNumber}</Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Email Address </Text>
          <Text style={styles.description}>{emailAddress}</Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Payment Amount </Text>
          <Text style={styles.description}>
            {currencyCode}
            {numberFormat(amount)}
          </Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Convenience Fee </Text>
          <Text style={styles.description}>
            {currencyCode}
            {numberFormat(providerServiceFee)}
          </Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Toktok Service Fee </Text>
          <Text style={styles.description}>
            {currencyCode}
            {numberFormat(systemServiceFee)}
          </Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Total</Text>
          <Text style={styles.description}>
            {currencyCode}
            {numberFormat(totalAmount)}
          </Text>
        </View>
        <ReceiptSeparator bottomHeight={footerHeight} />
        <View style={styles.brokenLine}>
          <DashedLine dashColor={COLOR.ORANGE} dashThickness={1} />
        </View>
        <View
          style={{alignItems: 'center'}}
          onLayout={event => {
            let {x, y, width, height} = event.nativeEvent.layout;
            setFooterHeight(height);
          }}>
          <Text style={[styles.receiptNote]}>A copy of this receipt will be delivered on the email provided.</Text>
          <Image source={onboarding_toktokbills} style={styles.logo} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: COLOR.BLACK,
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    width: '50%',
    paddingRight: moderateScale(10),
  },
  receiptNote: {
    marginHorizontal: moderateScale(16),
    color: '#525252',
    textAlign: 'center',
    fontSize: FONT_SIZE.S,
  },

  logo: {
    marginTop: moderateScale(16),
    alignSelf: 'center',
    width: moderateScale(102),
    height: moderateScale(23),
  },
  description: {
    color: COLOR.BLACK,
    fontSize: FONT_SIZE.M,
    textAlign: 'right',
    flexShrink: 1,
  },
  bodyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  marginBottom15: {
    marginBottom: moderateScale(15),
  },
  line: {
    height: 8,
    marginHorizontal: -16,
    backgroundColor: COLOR.LIGHT,
    marginVertical: moderateScale(16),
  },
  brokenLine: {
    marginVertical: moderateScale(20),
    marginHorizontal: moderateScale(16),
  },
});
