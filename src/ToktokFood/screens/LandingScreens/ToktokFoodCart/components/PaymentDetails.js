import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';

import styles from '../styles';
import {wallet} from 'toktokfood/assets/images';

const PaymentDetails = () => {
  return (
    <>
      <View style={styles.sectionContainer}>
        <View style={styles.deliverWrapper}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
        </View>
        <View style={styles.paymentContainer}>
          <TouchableOpacity style={styles.tokwaButton}>
            <Image style={styles.walletIcon} source={wallet} />
            <View style={styles.tokwaButtonTextWrapper}>
              <Text style={styles.toktokText}>toktok</Text>
              <Text style={styles.walletText}>wallet</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cashButton}>
            <Text style={styles.cashText}>CASH</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default PaymentDetails;
