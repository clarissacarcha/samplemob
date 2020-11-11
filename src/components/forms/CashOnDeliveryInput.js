import React, {useState} from 'react';
import {StyleSheet, Switch, Text, View, TextInput} from 'react-native';

import {COLOR, DARK, LIGHT, MEDIUM, COLOR_UNDERLAY} from '../../res/constants';

import {numberFormatInteger} from '../../helper';

export const CashOnDeliveryInput = ({
  onAmountChange = () => {},
  onSwitchChange = () => {},
  initialValue = 0,
  maxValue = 1500,
}) => {
  const [isCOD, setIsCOD] = useState(initialValue ? true : false);
  const [amount, setAmount] = useState(initialValue);

  const onIsCODChange = (value) => {
    setIsCOD(value);
    onSwitchChange(value);
  };

  const onCashOnDeliveryValueChange = (value) => {
    const decimal = value.split('.')[1];

    if (value && decimal) {
      if (decimal.toString().length > 2) {
        setAmount(amount); //force no change
        return;
      }
    }

    if (parseFloat(value) >= maxValue) {
      setAmount(maxValue.toString()); //force max amount
      console.log('Setting Max');
      return;
    }
    console.log('Setting Value');

    setAmount(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.switchRow}>
        <View>
          <Text style={styles.switchTitle}>Cash On Delivery</Text>
          <Text style={styles.switchDescription}>Rider pays sender and collect cash from recipient</Text>
        </View>

        <Switch
          trackColor={{false: LIGHT, true: LIGHT}}
          thumbColor={true ? COLOR : MEDIUM}
          onValueChange={onIsCODChange}
          value={isCOD}
        />
      </View>

      {isCOD && (
        <>
          <View style={styles.inputBox}>
            <View style={styles.inputLabel}>
              <Text style={{color: MEDIUM}}> {`Max: ${numberFormatInteger(maxValue)}`}</Text>
            </View>
            <TextInput
              value={amount}
              onChangeText={onCashOnDeliveryValueChange}
              placeholder="Amount"
              keyboardType="numeric"
              returnKeyType="done"
              style={styles.inputField}
              placeholderTextColor={LIGHT}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchTitle: {
    fontSize: 12,
    color: DARK,
    fontFamily: 'Rubik-Medium',
  },
  switchDescription: {
    fontSize: 10,
    color: MEDIUM,
    fontFamily: 'Rubik-Medium',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    height: 50,
    marginTop: 10,
    backgroundColor: 'white',
  },
  inputLabel: {
    paddingHorizontal: 20,
    backgroundColor: COLOR_UNDERLAY,
    height: 50,
    justifyContent: 'center',
    borderColor: MEDIUM,
    borderRightWidth: 1,
  },
  inputField: {
    paddingLeft: 20,
    flex: 1,
    height: 50,
    color: DARK,
  },
});
