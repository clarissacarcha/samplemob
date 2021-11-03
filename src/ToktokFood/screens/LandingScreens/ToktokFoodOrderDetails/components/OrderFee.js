import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE, FONT} from 'res/variables';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';

const getShippingDiscount = (promoDetails, deliveryFee) => {
  let { amount } = promoDetails;
  if(amount > 0){
    return amount > deliveryFee ? amount - deliveryFee : deliveryFee - amount;
  } else {
    return 0
  }
}

const OrderFee = ({data, forDelivery}) => {
  let {totalAmount, deliveryAmount, promoDetails} = data;
  let deliveryFee = deliveryAmount ? deliveryAmount : 0;
  let withShippingVoucher = promoDetails ? getShippingDiscount(promoDetails, deliveryFee) : deliveryFee

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>Subtotal</Text>
        <Text style={styles.subtotal}>{`PHP ${totalAmount.toFixed(2)}`}</Text>
      </View>
      {forDelivery && (
        <View style={styles.header}>
          <Text>Delivery Fee</Text>
          <View style={styles.deliveryFee}>
            {promoDetails && <Text style={styles.deliveryFeeText}>{`\u20B1${deliveryFee.toFixed(2)}`}</Text>}
            <Text style={styles.subtotal}>{`PHP ${withShippingVoucher.toFixed(2)}`}</Text>
          </View>
        </View>
      )}
      <View style={styles.divider} />
      <View style={styles.header}>
        <Text style={styles.total}>Total</Text>
        {forDelivery ? (
          <Text style={styles.totalPrice}>{`PHP ${(withShippingVoucher + totalAmount).toFixed(2)}`}</Text>
        ) : (
          <Text style={styles.totalPrice}>{`PHP ${totalAmount.toFixed(2)}`}</Text>
        )}
      </View>
    </View>
  );
};

export default OrderFee;

const styles = StyleSheet.create({
  divider: {
    borderTopWidth: 0.5,
    borderColor: '#DDDDDD',
    marginVertical: verticalScale(6),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: moderateScale(5),
  },
  subtotal: {
    color: '#FF6200',
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
  },
  total: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
  },
  totalPrice: {
    color: '#FF6200',
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.L,
  },
  note: {
    fontFamily: FONT.BOLD,
    fontSize: FONT_SIZE.M,
  },
  notes: {
    fontSize: FONT_SIZE.S,
    marginTop: verticalScale(5),
  },
  container: {
    backgroundColor: 'white',
    marginVertical: verticalScale(8),
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(10),
  },
  deliveryFeeText: {
    color: '#9E9E9E',
    fontSize: FONT_SIZE.M,
    marginRight: moderateScale(5),
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  deliveryFee: {
    flexDirection: 'row',
  },
});
