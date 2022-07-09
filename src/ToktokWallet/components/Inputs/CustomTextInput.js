import React, {createRef, useContext} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {CheckIdleStateContext} from 'toktokwallet/components';
import {moderateScale} from 'toktokwallet/helper';

import CONSTANTS from 'common/res/constants';
const {COLOR, FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;

export const CustomTextInput = ({
  style,
  placeholder,
  placeholderTextColor = COLOR.DARK,
  value,
  onChangeText,
  returnKeyType = 'done',
  onSubmitEditing,
  keyboardType = 'default',
  maxLength = null,
  onBlur,
  onFocus,
  caretHidden,
  editable = true,
  errorMessage = '',
}) => {
  return (
    <>
      <TextInput
        style={{...styles.input, ...(errorMessage != '' ? styles.errorBorder : {}), ...style}}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        returnKeyType="done"
        editable={editable}
        maxLength={maxLength}
      />
      {!!errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: SIZE.FORM_HEIGHT,
    borderRadius: 5,
    backgroundColor: '#F7F7FA',
    marginTop: 5,
    fontSize: FONT_SIZE.M,
    fontFamily: FONT.REGULAR,
    paddingHorizontal: moderateScale(15),
  },
  errorBorder: {
    borderColor: COLOR.RED,
    borderWidth: 1,
  },
  errorMessage: {
    color: COLOR.RED,
    fontSize: FONT_SIZE.S,
    marginTop: 5,
  },
});
