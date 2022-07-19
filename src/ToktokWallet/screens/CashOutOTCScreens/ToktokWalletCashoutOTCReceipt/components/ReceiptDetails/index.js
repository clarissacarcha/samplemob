import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import DashedLine from 'react-native-dashed-line';

//UTIL
import {moderateScale, numberFormat, currencyCode} from 'toktokwallet/helper';
import moment from 'moment';

//COMPONENTS
import {ReceiptSeparator} from 'toktokwallet/components';

//FONTS & COLORS & IMAGES
import tokwa2 from 'toktokwallet/assets/images/tokwa2.png';
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';

export const ReceiptDetails = ({route}) => {
  const [footerHeight, setFooterHeight] = useState(80);
  const {recipientMobileNo, recipientName} = route.params.transactionDetails;
  const {cashOut, emailAddress, requestDate, purpose} = route.params.receipt;
  const {amount, referenceNumber, systemServiceFee, providerServiceFee} = cashOut;
  const totalServiceFee = parseFloat(systemServiceFee) + parseFloat(providerServiceFee);
  const transactionDate = moment(requestDate).tz('Asia/Manila').format('MMM D, YYYY hh:mm A');

  return (
    <>
      {console.log(purpose)}
      <View style={styles.line} />
      <View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Service Reference Number </Text>
          <Text style={[styles.description, {color: COLOR.ORANGE, fontFamily: FONT.BOLD}]}>{referenceNumber}</Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Transaction Date </Text>
          <Text style={styles.description}>{transactionDate}</Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Recipient Name</Text>
          <Text style={styles.description}>{recipientName}</Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Recipient Mobile Number</Text>
          <Text style={styles.description}>{recipientMobileNo}</Text>
        </View>
        {!!emailAddress && (
          <View style={[styles.bodyContainer, styles.marginBottom15]}>
            <Text style={styles.title}>Email Address </Text>
            <Text style={styles.description}>{emailAddress}</Text>
          </View>
        )}
        {!!purpose && (
          <View style={[styles.bodyContainer, styles.marginBottom15]}>
            <Text style={styles.title}>Purpose</Text>
            <Text style={styles.description}>{purpose}</Text>
          </View>
        )}

        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Amount</Text>
          <Text style={styles.description}>
            {currencyCode}
            {numberFormat(amount)}
          </Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Service Fee</Text>
          <Text style={styles.description}>
            {currencyCode}
            {numberFormat(totalServiceFee)}
          </Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Total</Text>
          <Text style={styles.description}>
            {currencyCode}
            {numberFormat(parseFloat(totalServiceFee) + parseFloat(amount))}
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
          <Image source={tokwa2} style={styles.logo} />
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
  logo: {
    width: moderateScale(110),
    height: moderateScale(80),
    resizeMode: 'contain',
  },
});
