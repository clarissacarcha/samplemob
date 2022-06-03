import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

// Fonts/Colors
import {COLORS} from 'res/constants';
import {FONT_SIZE, FONT} from 'res/variables';

// Utils
import {moderateScale, verticalScale} from 'toktokfood/helper/scale';
// import {getSubtotalOrder} from '../function';

const getShippingDiscount = (promoDetails, deliveryFee) => {
  const {amount, isPercentage} = promoDetails;
  if (amount > 0) {
    let pAmount = isPercentage !== 0 ? (amount / 100) * deliveryFee : amount;
    // let totalSF = deliveryFee + pAmount;
    pAmount = pAmount > 0 ? pAmount : 0;
    const deliveryAmount = pAmount > deliveryFee ? deliveryFee : pAmount;
    return deliveryAmount > 0 ? deliveryAmount.toFixed(2) : 0;
  } else {
    return deliveryFee.toFixed(2);
  }
};

const OrderFee = ({data, forDelivery, showRefund, forWallet}) => {
  let {
    originalShippingFee,
    // actualTotalamount,
    deliveryAmount,
    promoDetails,
    promoDiscounts,
    resellerDiscountTotal,
    srpTotalamount,
    srpTotal,
    totalAmount,
    totalAmountWithAddons,
    refundTotal,
  } = data;
  let deliveryFee = deliveryAmount ? deliveryAmount : 0;
  const promotionDiscount = promoDiscounts || 0;
  // let withShippingVoucher = promoDetails ? getShippingDiscount(promoDetails, originalShippingFee) : deliveryFee;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>Subtotal</Text>
        <Text style={styles.subtotal}>{`PHP ${srpTotal.toFixed(2)}`}</Text>
      </View>

      {promoDiscounts > 0 && (
        <View style={styles.header}>
          <Text>Item Discount</Text>
          <Text style={styles.subtotal}>{`-PHP ${promoDiscounts.toFixed(2)}`}</Text>
        </View>
      )}

      {resellerDiscountTotal > 0 && (
        <View style={styles.header}>
          <Text>Item Discount (Reseller)</Text>
          <Text style={styles.subtotal}>{`-PHP ${resellerDiscountTotal.toFixed(2)}`}</Text>
        </View>
      )}

      {forDelivery && (
        <View style={styles.header}>
          <Text>Delivery Fee</Text>
          <View style={styles.deliveryFee}>
            {/* {promoDetails && <Text style={styles.deliveryFeeText}>{`\u20B1${originalShippingFee.toFixed(2)}`}</Text>} */}
            <Text style={styles.subtotal}>{`PHP ${originalShippingFee.toFixed(2)}`}</Text>
          </View>
        </View>
      )}

      {promoDetails && forDelivery && (
        <View style={styles.header}>
          <Text>Shipping Voucher Applied</Text>
          <Text style={styles.subtotal}>{`-PHP ${getShippingDiscount(promoDetails, originalShippingFee)}`}</Text>
        </View>
      )}

      <View style={styles.divider} />
      <View style={styles.header}>
        <Text style={styles.total}>Total</Text>
        {forDelivery ? (
          <Text style={styles.totalPrice}>{`PHP ${(deliveryFee + srpTotal).toFixed(2)}`}</Text>
        ) : (
          <Text style={styles.totalPrice}>{`PHP ${srpTotal.toFixed(2)}`}</Text>
        )}
      </View>
      {forWallet && showRefund && (
        <View style={styles.header}>
          <Text style={styles.total}>Total Refund Amount</Text>
          <Text style={styles.totalPrice}>{`PHP ${refundTotal.toFixed(2)}`}</Text>
        </View>
      )}
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
