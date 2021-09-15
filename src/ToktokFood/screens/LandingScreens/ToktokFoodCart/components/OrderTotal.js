import React from 'react';
import {View, Text} from 'react-native';

import styles from '../styles';

const OrderTotal = ({subtotal = 0.0, deliveryFee = 0, forDelivery = true}) => {
  deliveryFee = deliveryFee ? deliveryFee : 0;
  subtotal = subtotal ? subtotal : 0;
  // const {totalAmount, tempCart} = useContext(VerifyContext);

  return (
    <View style={[styles.sectionContainer, styles.totalContainer]}>
      <View style={styles.header}>
        <Text>Subtotal</Text>
        <Text style={styles.subtotal}>{`PHP ${subtotal.toFixed(2)}`}</Text>
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
          <Text style={styles.totalPrice}>{`PHP ${(deliveryFee + subtotal).toFixed(2)}`}</Text>
        ) : (
          <Text style={styles.totalPrice}>{`PHP ${subtotal.toFixed(2)}`}</Text>
        )}
      </View>
    </View>
  );
};

export default OrderTotal;
