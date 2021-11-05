/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {VerifyContext} from '../components';

import styles from '../styles';

const OrderTotal = ({autoShipping, subtotal = 0, deliveryFee = 0, forDelivery = true}) => {
  // deliveryFee = deliveryFee ? deliveryFee : 0;
  // subtotal = subtotal ? subtotal : 0;
  const {shippingVoucher, temporaryCart} = useContext(VerifyContext);
  const [totalBasket, setTotalBasket] = useState(temporaryCart.totalAmount);
  const [totalShipping, setTotalShipping] = useState(deliveryFee);

  useEffect(() => {
    if (autoShipping?.success) {
      const {amount, is_percentage} = autoShipping.voucher;
      if (amount > 0) {
        let pAmount = is_percentage != 0 ? (amount / 100) * deliveryFee : amount
        let totalSF = deliveryFee - pAmount;
        totalSF = totalSF > 0 ? totalSF : 0;
        setTotalShipping(totalSF);
      } else {
        setTotalShipping(0);
      }
    }

    if (shippingVoucher.length) {
      console.log(shippingVoucher);
      const {type} = shippingVoucher[0];
      const {amount} = shippingVoucher[0].voucher;
      if (type === 'shipping' && amount > 0) {
        const totalSF = amount > deliveryFee ? amount - deliveryFee : deliveryFee - amount;
        setTotalShipping(totalSF);
      }
      if (type === 'shipping' && amount === 0) {
        setTotalShipping(0);
      }
      if (type !== 'shipping') {
        const totalBasketDiscount = amount > totalBasket ? amount - totalBasket : totalBasket - amount;
        setTotalBasket(totalBasketDiscount);
      }
    }
  }, [autoShipping, shippingVoucher]);

  return (
    <View style={[styles.sectionContainer, styles.totalContainer]}>
      {forDelivery && (
        <>
          <View style={styles.header}>
            <Text>Subtotal</Text>
            <Text style={styles.subtotal}>{`PHP ${totalBasket.toFixed(2)}`}</Text>
          </View>
          <View style={styles.header}>
            <Text>Delivery Fee</Text>
            <View style={styles.deliveryFee}>
              {(autoShipping?.success || shippingVoucher.length > 0) && (
                <Text style={styles.deliveryFeeText}>{`\u20B1${deliveryFee.toFixed(2)}`}</Text>
              )}
              <Text style={styles.subtotal}>{`PHP ${totalShipping.toFixed(2)}`}</Text>
            </View>
          </View>
          <View style={styles.divider} />
        </>
      )}
      <View style={styles.header}>
        <Text style={styles.total}>Total</Text>
        {forDelivery ? (
          <Text style={styles.totalPrice}>{`PHP ${(totalShipping + temporaryCart.totalAmount).toFixed(2)}`}</Text>
        ) : (
          <Text style={styles.totalPrice}>{`PHP ${temporaryCart.totalAmount.toFixed(2)}`}</Text>
        )}
      </View>
    </View>
  );
};

export default OrderTotal;
