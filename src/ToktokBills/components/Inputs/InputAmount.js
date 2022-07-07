import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {numberFormat, formatAmount} from 'toktokwallet/helper';
import CONSTANTS from 'common/res/constants';
import {moderateScale} from '../../helper';

const {FONT_SIZE, COLOR, SIZE, FONT_FAMILY: FONT} = CONSTANTS;

export const InputAmount = ({
  errorMessage = '',
  amount = 0,
  changeAmount,
  currency = '₱',
  onBlur,
  disabled = false,
}) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={[styles.input, {borderWidth: 1, borderColor: errorMessage == '' ? 'transparent' : COLOR.RED}]}>
      {currency && (
        <View style={{borderRightWidth: 1, borderRightColor: '#CCCCCC', justifyContent: 'center'}}>
          <Text
            style={{
              fontSize: FONT_SIZE.L,
              alignSelf: 'center',
              paddingHorizontal: moderateScale(15),
            }}>
            {currency}
          </Text>
        </View>
      )}
      <TextInput
        onFocus={() => setIsFocus(true)}
        onBlur={() => {
          setIsFocus(false);
          if (onBlur) onBlur();
        }}
        value={amount}
        caretHidden={!isFocus}
        onChangeText={changeAmount}
        style={{
          marginTop: 1,
          height: '100%',
          width: '100%',
          marginLeft: moderateScale(15),
          ...(!isFocus && amount != '' ? {position: 'absolute', color: 'transparent', zIndex: 1} : {}),
        }}
        keyboardType="numeric"
        returnKeyType="done"
        placeholder=""
        placeholderTextColor={COLOR.DARK}
      />
      {!isFocus && amount != '' && (
        <View style={{marginLeft: moderateScale(15), alignSelf: 'center', flex: 1}}>
          <Text style={{fontFamily: FONT.REGULAR, fontSize: FONT_SIZE.M}}>
            {amount ? numberFormat(amount) : '0.00'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: SIZE.FORM_HEIGHT,
    paddingHorizontal: 5,
    width: '100%',
    backgroundColor: '#F7F7FA',
    marginTop: 5,
    borderRadius: 5,
    flexDirection: 'row',
    fontSize: FONT_SIZE.M,
  },
});
