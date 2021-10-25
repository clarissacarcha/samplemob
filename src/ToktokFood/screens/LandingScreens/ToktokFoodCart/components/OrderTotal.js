/* eslint-disable react-hooks/exhaustive-deps */
import React, {useContext, useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {VerifyContext} from '../components';

import styles from '../styles';

const OrderTotal = ({autoShipping, subtotal = 0, deliveryFee = 0, forDelivery = true}) => {
  // deliveryFee = deliveryFee ? deliveryFee : 0;
  // subtotal = subtotal ? subtotal : 0;
  const {temporaryCart} = useContext(VerifyContext);
  const [totalShipping, setTotalShipping] = useState(deliveryFee);

  useEffect(() => {
    if (autoShipping?.success) {
      const {amount} = autoShipping.voucher;
      if (amount > 0) {
        const totalSF = amount > deliveryFee ? amount - deliveryFee : deliveryFee - amount;
        setTotalShipping(totalSF);
      } else {
        setTotalShipping(0);
      }
    }
  }, [autoShipping]);

  return (
    <View style={[styles.sectionContainer, styles.totalContainer]}>
      {forDelivery && (
        <>
          <View style={styles.header}>
            <Text>Subtotal</Text>
            <Text style={styles.subtotal}>{`PHP ${temporaryCart.totalAmount.toFixed(2)}`}</Text>
          </View>
          <View style={styles.header}>
            <Text>Delivery Fee</Text>
            <View style={styles.deliveryFee}>
              {autoShipping?.success && <Text style={styles.deliveryFeeText}>{`\u20B1${deliveryFee.toFixed(2)}`}</Text>}
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
