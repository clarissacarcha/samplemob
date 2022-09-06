import React, {useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {SettingsLogModal} from 'toktokwallet/components';
import CONSTANTS from 'common/res/constants';

const {COLOR, FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;
const {width} = Dimensions.get('window');

const Details = ({settlement, visible, setVisible}) => {
  const {refNo, dayOfPayment, timeOfPayment, name, phrase, amount} = settlement;

  return (
    <SettingsLogModal visible={visible} setVisible={setVisible}>
      <View>
        <Text style={[styles.labelText, {fontFamily: FONT.BOLD}]}>{name}</Text>
        <Text style={[styles.labelText, {marginBottom: 20}]}>{phrase}</Text>
        <Text style={styles.labelText}>Status: Success</Text>
        <Text style={styles.labelText}>Amount: {amount}</Text>
        <Text style={styles.labelText}>Service Reference No.: {refNo}</Text>
        <Text style={styles.labelText}>Day of Payment: {dayOfPayment}</Text>
        <Text style={styles.labelText}>Time of Payment: {timeOfPayment}</Text>
      </View>
    </SettingsLogModal>
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
  },
});

export default Details;
