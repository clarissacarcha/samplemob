import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE} from 'res/variables';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';

const OrderFee = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>Subtotal</Text>
        <Text style={styles.subtotal}>96.00</Text>
      </View>
      <View style={styles.header}>
        <Text>Delivery Fee</Text>
        <Text style={styles.subtotal}>59.00</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.header}>
        <Text style={styles.total}>Total</Text>
        <Text style={styles.totalPrice}>155.00</Text>
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
    color: COLORS.ORANGE,
    fontWeight: '500',
    fontSize: FONT_SIZE.M,
  },
  total: {
    fontWeight: '500',
    fontSize: FONT_SIZE.L,
  },
  totalPrice: {
    fontWeight: '500',
    fontSize: FONT_SIZE.L,
    color: COLORS.ORANGE,
  },
  note: {
    fontWeight: '500',
    fontSize: FONT_SIZE.M,
  },
  notes: {
    fontWeight: '300',
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
