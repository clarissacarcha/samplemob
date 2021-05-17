import React, {useState} from 'react';
import {connect} from 'react-redux';
import {View, StyleSheet, Text, TextInput, Switch} from 'react-native';
import {LIGHT, COLOR, FONT_REGULAR, FONT_MEDIUM} from '../../../../../res/constants';

const PabiliForm = ({value, onChange, onAmountChange, constants}) => {
  const maxValue = constants.maxCashOnDelivery;

  const [switchState, setSwitchState] = useState(false);
  const [amount, setAmount] = useState(0);

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

  const onValueChange = (value) => {
    setSwitchState(value);
    onChange(value);
  };

  return (
    <>
      <View style={styles.box}>
        <View style={{flex: 1}}>
          <Text style={{fontFamily: FONT_MEDIUM}}>Cash on Delivery</Text>
          <Text style={{fontSize: 10, color: LIGHT, fontFamily: FONT_REGULAR}}>
            Rider pays on pick up and collect payment on drop off.
          </Text>
        </View>
        <Switch
          trackColor={{false: LIGHT, true: LIGHT}}
          thumbColor={COLOR}
          onValueChange={onValueChange}
          value={switchState}
        />
      </View>
      {switchState && (
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={onCashOnDeliveryValueChange}
          placeholder="Max Amount: 2000"
          placeholderTextColor={LIGHT}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  constants: state.constants,
});

export default connect(mapStateToProps, null)(PabiliForm);

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    fontSize: 14,
    // marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: LIGHT,
    borderRadius: 5,
    fontSize: 14,
    paddingHorizontal: 10,
    fontFamily: FONT_REGULAR,
  },
  spacing: {height: 5},
});
