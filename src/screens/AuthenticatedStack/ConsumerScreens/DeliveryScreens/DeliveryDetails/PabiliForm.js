import React, {useState} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Text, TextInput, Switch} from 'react-native';
import {LIGHT, FONT_REGULAR, FONT_MEDIUM} from '../../../../../res/constants';
import {useAlert} from '../../../../../hooks';

import {COLOR, FONT, FONT_SIZE} from '../../../../../res/variables';

const CashOnDeliveryForm = ({value, onChange, onAmountChange, constants}) => {
  const maxValue = constants.maxCashOnDelivery;

  const [switchState, setSwitchState] = useState(false);
  const [amount, setAmount] = useState(0);
  const AlertHook = useAlert();

  const onValueChange = (value) => {
    setSwitchState(value);
    onChange(value);
  };

  const onCashOnDeliveryValueChange = (value) => {
    const decimal = value.split('.')[1];

    if (isNaN(value)) {
      AlertHook({message: 'Please enter a valid amount.'});
      setAmount(''); //force clear
      onAmountChange('');
      return;
    }

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
      <View style={styles.box}>
        <View style={{flex: 1}}>
          <Text style={{fontFamily: FONT.BOLD}}>Cash on Delivery</Text>
          <Text style={{fontSize: FONT_SIZE.S, color: COLOR.MEDIUM}}>
            {`Add PHP ${constants.cashOnDeliveryFee}.00 Cash on Delivery service fee.`}
          </Text>
          <Text style={{fontSize: FONT_SIZE.S, color: COLOR.MEDIUM}}>
            {`Rider pays sender and collect cash from recipient.`}
          </Text>
        </View>
        <Switch
          trackColor={{false: LIGHT, true: LIGHT}}
          thumbColor={COLOR.YELLOW}
          onValueChange={onValueChange}
          value={switchState}
        />
      </View>
      {switchState && (
        <View style={{marginBottom: 60}}>
          <Text style={{fontFamily: FONT.BOLD, marginTop: 16}}>Cash on Delivery Amount</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={onCashOnDeliveryValueChange}
            placeholder={`Max Amount: PHP ${constants.maxCashOnDelivery}.00`}
            placeholderTextColor={LIGHT}
            keyboardType="number-pad"
            returnKeyType="done"
          />
        </View>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  constants: state.constants,
});

export default connect(mapStateToProps, null)(CashOnDeliveryForm);

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    // marginBottom: 20,
  },
  input: {
    height: 50,
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: COLOR.LIGHT,
  },
  spacing: {height: 2},
});
