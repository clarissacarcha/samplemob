import React, {useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {TransactionModal} from 'toktokwallet/components';
import { moderateScale } from "toktokwallet/helper";
import CONSTANTS from 'common/res/constants';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
const {width} = Dimensions.get('window');

const Details = ({settlement, visible, setVisible}) => {
  const {refNo, dayOfPayment, timeOfPayment, name, phrase, amount} = settlement;

  return (
    <TransactionModal visible={visible} setVisible={setVisible}>
      <View>
        <Text style={[styles.labelText, {fontFamily: FONT.BOLD,fontSize: moderateScale(18)}]}>{name}</Text>
        <Text style={[styles.labelText, {marginBottom: 20}]}>{phrase}</Text>
        <Text style={styles.labelText}><Text style={{fontFamily:FONT.BOLD}}>Status:</Text> Success</Text>
        <Text style={styles.labelText}><Text style={{fontFamily:FONT.BOLD}}>Amount:</Text> {amount}</Text>
        <Text style={styles.labelText}><Text style={{fontFamily:FONT.BOLD}}>Service Reference No.:</Text> {refNo}</Text>
        <Text style={styles.labelText}><Text style={{fontFamily:FONT.BOLD}}>Day of Payment:</Text> {dayOfPayment}</Text>
        <Text style={styles.labelText}><Text style={{fontFamily:FONT.BOLD}}>Time of Payment:</Text> {timeOfPayment}</Text>
      </View>
    </TransactionModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    fontFamily: FONT.REGULAR,
    fontSize: FONT_SIZE.M,
    marginBottom: 2,
  },
});

export default Details;
