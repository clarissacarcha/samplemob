import React from 'react';
import {View, Text} from 'react-native';

import styles from '../styles';

const OrderTotal = () => {
  return (
    <View style={[styles.sectionContainer, styles.totalContainer]}>
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

export default OrderTotal;
