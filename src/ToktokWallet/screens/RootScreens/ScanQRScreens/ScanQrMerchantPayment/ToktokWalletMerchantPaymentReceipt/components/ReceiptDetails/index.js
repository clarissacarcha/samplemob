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
  const {note, amount, serviceFee, accountNumber, accountName, transaction} = route.params.receipt;
  const transactionDate = moment(transaction.createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A');

  return (
    <>
      <View style={styles.line} />
      <View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Service Reference Number </Text>
          <Text style={[styles.description, {color: COLOR.ORANGE, fontFamily: FONT.BOLD}]}>{transaction.refNo}</Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Transaction Date </Text>
          <Text style={styles.description}>{transactionDate}</Text>
        </View>

        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Account Name</Text>
          <Text style={styles.description}>{accountName}</Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Account Number</Text>
          <Text style={styles.description}>{accountNumber}</Text>
        </View>
        {!!note && (
          <View style={[styles.bodyContainer, styles.marginBottom15]}>
            <Text style={styles.title}>Note</Text>
            <Text style={styles.description}>{note}</Text>
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
            {numberFormat(serviceFee)}
          </Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Total</Text>
          <Text style={styles.description}>
            {currencyCode}
            {numberFormat(parseFloat(amount) + parseFloat(serviceFee))}
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
    width: moderateScale(102),
    height: moderateScale(23),
    resizeMode: 'contain',
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
