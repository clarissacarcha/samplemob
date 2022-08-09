import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView} from 'react-native';
import {LoadingIndicator} from 'toktokbills/components';

//UTIL
import {moderateScale, numberFormat, currencyCode} from 'toktokbills/helper';

//COMPONENTS
import {ReceiptSeparator} from 'toktokbills/components';

//FONTS & COLORS & IMAGES
import {check_fill_icon, toktokload_logo} from 'toktokload/assets';
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';
import moment from 'moment';
import DashedLine from 'react-native-dashed-line';

export const ReceiptDetails = ({route}) => {
  const {receipt} = route.params;
  const {amount, referenceNumber, destinationNumber, createdAt, discount, convenienceFee, loadDetails} = receipt;
  const transactionDateTime = `${moment(createdAt).tz('Asia/Manila').format('MMM D, YYYY hh:mm A')}`;
  const totalAmount = parseFloat(amount) + parseFloat(convenienceFee);
  const [footerHeight, setFooterHeight] = useState(80);

  // useEffect(() => {
  //   Image.getSize(billerDetails.logo, (width, height) => {
  //     let size = height > width ? height - width : width - height;
  //     if (size > 10) {
  //       if (width > moderateScale(80) || height > moderateScale(40)) {
  //         setLogo({width: 80, height: 50});
  //       } else {
  //         setLogo({width, height});
  //       }
  //     } else {
  //       setLogo({width: 50, height: 50});
  //     }
  //   });
  // }, []);

  return (
    <>
      <View style={styles.line} />
      <View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Service Reference Number </Text>
          <Text style={[styles.description, {color: COLOR.ORANGE, fontFamily: FONT.BOLD}]}>{referenceNumber}</Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={[styles.title, {textTransform: 'capitalize'}]}>Load Provider </Text>
          <Text style={styles.description}>{loadDetails.networkDetails.name}</Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Transaction Date and Time </Text>
          <Text style={styles.description}>{transactionDateTime}</Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Status </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={check_fill_icon} style={styles.icon} />
            <Text style={[styles.description, styles.colorGreen]}>Success</Text>
          </View>
        </View>

        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Load Amount </Text>
          <Text style={styles.description}>
            {currencyCode}
            {numberFormat(amount)}
          </Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Service Fee </Text>
          <Text style={styles.description}>
            {currencyCode}
            {numberFormat(convenienceFee)}
          </Text>
        </View>
        {discount > 0 && (
          <View style={[styles.bodyContainer, styles.marginBottom15]}>
            <Text style={styles.title}>Discount </Text>
            <Text style={styles.description}>
              {currencyCode}
              {numberFormat(discount)}
            </Text>
          </View>
        )}
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Total </Text>
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
          <Image source={toktokload_logo} style={styles.logo} />
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
    width: moderateScale(100),
    height: moderateScale(25),
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
    alignItems: 'center',
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
  icon: {
    width: moderateScale(15),
    height: moderateScale(15),
    resizeMode: 'contain',
  },
  colorGreen: {
    color: '#198754',
    marginLeft: moderateScale(5),
  },
});
