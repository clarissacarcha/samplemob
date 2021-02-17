import React, {useState} from 'react';
import {connect} from 'react-redux';
import {StyleSheet, Switch, Text, View, TextInput} from 'react-native';

import {COLOR, DARK, LIGHT, MEDIUM, COLOR_UNDERLAY} from '../../res/constants';
import {SizedBox} from '../../components/widgets';

import {numberFormatInteger} from '../../helper';

const Widget = ({
  onAmountChange = () => {},
  onSwitchChange = () => {},
  initialValue = 0,
  constants,
  marginTop,
  marginBottom,
}) => {
  const maxValue = constants.maxCashOnDelivery;
  const CODFee = constants.cashOnDeliveryFee;
  const [isCOD, setIsCOD] = useState(initialValue ? true : false);
  const [amount, setAmount] = useState(initialValue);

  const onIsCODChange = (value) => {
    setIsCOD(value);
    onSwitchChange(value);
    if (!value) {
      onAmountChange(0);
    }
  };

  const onCashOnDeliveryValueChange = (value) => {
    const decimal = value.split('.')[1];

    if (value && decimal) {
      if (decimal.toString().length > 2) {
        setAmount(amount); //force no change
        onAmountChange(amount);
        return;
      }
    }

    if (parseFloat(value) >= parseFloat(maxValue)) {
      setAmount(maxValue); //force max amount
      onAmountChange(maxValue);

      return;
    }

    setAmount(value);
    onAmountChange(value);
  };

  return (
    <>
      {marginTop && <SizedBox />}
      <View style={styles.switchContainer}>
        <View>
          <Text style={styles.switchTitle}>Cash On Delivery</Text>
          <Text style={styles.switchDescription}>Rider pays sender and collect cash from recipient.</Text>
          <Text style={styles.switchDescription}>{`Additional P${CODFee}.00 on top of delivery fee.`}</Text>
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
          <View style={styles.inputContainer}>
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
      {marginBottom && <SizedBox />}
    </>
  );
};

const mapStateToProps = (state) => ({
  constants: state.constants,
});

export const CashOnDeliveryInput = connect(mapStateToProps, null)(Widget);

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
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
  inputContainer: {
    borderWidth: 1,
    borderColor: MEDIUM,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    height: 50,
    backgroundColor: 'white',
    marginTop: 0,
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
