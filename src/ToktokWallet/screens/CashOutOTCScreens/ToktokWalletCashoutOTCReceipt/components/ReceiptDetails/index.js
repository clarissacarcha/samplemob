import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import DashedLine from 'react-native-dashed-line';

//UTIL
import {moderateScale, numberFormat, currencyCode} from 'toktokbills/helper';

//COMPONENTS
import {ReceiptSeparator} from 'toktokwallet/components';

//FONTS & COLORS & IMAGES
import tokwa2 from 'toktokwallet/assets/images/tokwa2.png';
import {COLOR, FONT, FONT_SIZE} from 'src/res/variables';

export const ReceiptDetails = ({route}) => {
  const [footerHeight, setFooterHeight] = useState(80);

  return (
    <>
      <View style={styles.line} />
      <View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Service Reference Number </Text>
          <Text style={[styles.description, {color: COLOR.ORANGE, fontFamily: FONT.BOLD}]}>12345678910</Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Transaction Date and Time </Text>
          <Text style={styles.description}>Jan 7, 2021 10:30 AM</Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Recipient Name</Text>
          <Text style={styles.description}>Juan Dela Cruz</Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Recipient Mobile Number</Text>
          <Text style={styles.description}>09123456789</Text>
        </View>
        {/* {!!email && (
          <View style={[styles.bodyContainer, styles.marginBottom15]}>
            <Text style={styles.title}>Email Address </Text>
            <Text style={styles.description}>{email}</Text>
          </View>
        )} */}
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Date of Claim </Text>
          <Text style={styles.description}>Jun 7, 2022</Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Purpose</Text>
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Hevivamus sit amet venenatis ex. Vivamus sit amet
            venenatis.
          </Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Amount</Text>
          <Text style={styles.description}>₱2,000.00</Text>
        </View>
        <View style={[styles.bodyContainer, styles.marginBottom15]}>
          <Text style={styles.title}>Service Fee</Text>
          <Text style={styles.description}>₱10.00</Text>
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
  logo: {
    width: moderateScale(110),
    height: moderateScale(80),
    resizeMode: 'contain',
  },
});
