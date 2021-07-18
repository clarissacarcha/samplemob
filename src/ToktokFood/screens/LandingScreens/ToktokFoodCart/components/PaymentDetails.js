import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';

import styles from '../styles';
import {wallet} from 'toktokfood/assets/images';

// enum implementation on JavaScript
const PAYMENT_TYPE = {
  CASH: 'Cash-on-Delivery',
  TOKTOK_WALLET: 'Toktok Wallet',
};

const PaymentDetails = () => {
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_TYPE.TOKTOK_WALLET);

  return (
    <>
      <View style={styles.sectionContainer}>
        <View style={styles.deliverWrapper}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
        </View>
        <View style={styles.paymentContainer}>
          <TouchableOpacity
            onPress={() => setPaymentMethod(PAYMENT_TYPE.TOKTOK_WALLET)}
            style={[styles.tokwaButton, {borderBottomWidth: paymentMethod === PAYMENT_TYPE.TOKTOK_WALLET ? 6 : 1}]}>
            <Image style={styles.walletIcon} source={wallet} />
            <View style={styles.tokwaButtonTextWrapper}>
              <Text style={styles.toktokText}>toktok</Text>
              <Text style={styles.walletText}>wallet</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPaymentMethod(PAYMENT_TYPE.CASH)}
            style={[styles.cashButton, {borderBottomWidth: paymentMethod === PAYMENT_TYPE.CASH ? 6 : 1}]}>
            <Text style={styles.cashText}>CASH</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default PaymentDetails;
