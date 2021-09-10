import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';

import styles from '../styles';

import {COLOR} from 'res/variables';

const OrderTotal = ({subtotal = 0.0, deliveryFee = 0}) => {
  console.log(deliveryFee)
  return (
    <View style={[styles.sectionContainer, styles.totalContainer]}>
      <View style={styles.header}>
        <Text>Subtotal</Text>
        <Text style={styles.subtotal}>{subtotal.toFixed(2)}</Text>
      </View>
      <View style={styles.header}>
        <Text>Delivery Fee</Text>
        <Text style={styles.subtotal}>{deliveryFee.toFixed(2)}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.header}>
        <Text style={styles.total}>Total</Text>
        <Text style={styles.totalPrice}>{(deliveryFee + subtotal).toFixed(2)}</Text>
      </View>
    </View>
  );
};

export default OrderTotal;
