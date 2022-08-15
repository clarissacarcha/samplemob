/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Error, Label, Input} from './Styled';
import CONSTANTS from 'src/common/res/constants';
const {COLOR} = CONSTANTS;

const CustomTextInput = (props: PropsType): React$Node => {
  const {
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
    label = '',
  } = props;

  return (
    <>
      {label !== '' && <Label>{label}</Label>}
      <Input
        style={style}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        returnKeyType={returnKeyType}
        editable={editable}
        maxLength={maxLength}
        keyboardType={keyboardType}
        errorMessage={errorMessage}
        onBlur={onBlur}
        onSubmitEditing={onSubmitEditing}
        onFocus={onFocus}
        caretHidden={caretHidden}
      />
      {errorMessage !== '' && <Error>{errorMessage}</Error>}
    </>
  );
};
export default CustomTextInput;
