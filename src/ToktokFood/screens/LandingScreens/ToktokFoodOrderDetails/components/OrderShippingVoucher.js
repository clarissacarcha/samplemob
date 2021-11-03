import moment from 'moment';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE, FONT} from 'res/variables';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';

const validDateFormat = (validUntil) => {
  let isValid = moment(validUntil).isValid();
  if(isValid){
    let date = moment(validUntil, 'YYYY/MM/DD');
    let month = date.format('M');
    let day   = date.format('D');
    let year  = date.format('YYYY');
    return `${month}.${day}.${year}`
  }
  return isValid
}

const OrderShippingVoucher = ({data, forDelivery}) => {
  let {promoDetails} = data;
  let validDate = validDateFormat(promoDetails.validUntil);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Voucher</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.header}>
        <Text style={styles.voucherTitle}>{promoDetails.shippingDiscountName}</Text>
        { validDate && (
          <Text style={styles.validDate}>ValidUuntil: {validDate}</Text>
        )}
      </View>
    </View>
  );
};

export default OrderShippingVoucher;

const styles = StyleSheet.create({
  divider: {
    borderTopWidth: 2,
    borderColor: '#F7F7FA',
    marginVertical: verticalScale(6),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(5),
    paddingHorizontal: moderateScale(20)
  },
  title: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
  },
  voucherTitle: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
    color: '#FFA700'
  },
  validDate: {
    color: '#9E9E9E',
    fontSize: FONT_SIZE.M,
  },
  container: {
    backgroundColor: 'white',
    marginVertical: verticalScale(8),
    paddingVertical: moderateScale(10),
  },
});
