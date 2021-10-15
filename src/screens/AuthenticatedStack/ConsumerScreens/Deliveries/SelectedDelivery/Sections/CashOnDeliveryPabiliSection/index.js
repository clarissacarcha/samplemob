import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLOR, FONT, SIZE} from '../../../../../../../res/variables';

const moneyFormat = (value) => {
  if (isNaN(value)) {
    return null;
  }
  return parseFloat(value)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

export const CashOnDeliveryPabiliSection = ({delivery}) => {
  let collectPaymentFrom = '';

  if (delivery.collectPaymentFrom === 'S') collectPaymentFrom = 'Sender';
  if (delivery.collectPaymentFrom === 'R') collectPaymentFrom = 'Recipient';

  console.log(JSON.stringify(delivery, null, 4));
  return (
    <>
      <View style={styles.section}>
        <View style={styles.body}>
          {![null, 0, '0'].includes(delivery.cashOnDelivery) && (
            <View style={styles.bodyColumn}>
              <Text style={styles.title}>{delivery.description ? 'Pabili Service' : 'Cash on Delivery'}</Text>
              <Text style={styles.description}>PHP {moneyFormat(delivery.cashOnDelivery)}</Text>
            </View>
          )}
          <View style={styles.bodyColumn}>
            <Text style={styles.title}>Pabili Partner</Text>
            <Text style={styles.description}>SM City Marilao San Jose del Monte Fairview</Text>
          </View>
        </View>
      </View>
      <View style={{height: 8, backgroundColor: COLOR.LIGHT}} />
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    justifyContent: 'center',
    margin: SIZE.MARGIN,
  },
  body: {
    flexDirection: 'row',
    minHeight: 50,
  },
  bodyColumn: {
    flex: 1,
  },
  title: {
    fontFamily: FONT.BOLD,
  },
  description: {
    color: COLOR.DARK,
  },
});
