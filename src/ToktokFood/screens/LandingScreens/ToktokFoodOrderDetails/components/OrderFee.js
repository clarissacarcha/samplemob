import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE, FONT} from 'res/variables';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';

const OrderFee = ({data, forDelivery}) => {
  const {totalAmount, deliveryAmount} = data;
  let deliveryFee = deliveryAmount ? deliveryAmount : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>Subtotal</Text>
        <Text style={styles.subtotal}>{`PHP ${totalAmount.toFixed(2)}`}</Text>
      </View>
      {forDelivery && (
        <View style={styles.header}>
          <Text>Delivery Fee</Text>
          <Text style={styles.subtotal}>{`PHP ${deliveryFee.toFixed(2)}`}</Text>
        </View>
      )}
      <View style={styles.divider} />
      <View style={styles.header}>
        <Text style={styles.total}>Total</Text>
        {forDelivery ? (
          <Text style={styles.totalPrice}>{`PHP ${(deliveryFee + totalAmount).toFixed(2)}`}</Text>
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
});
