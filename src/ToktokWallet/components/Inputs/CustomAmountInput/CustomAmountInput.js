/**
 * @format
 * @flow
 */

import React, {useState} from 'react';

import type {PropsType} from './types';
import {
  Container,
  Error,
  Label,
  Input,
  CountryCodeText,
  CountryCodeContainer,
  PlaceholderContainer,
  PlaceholderText,
} from './Styled';
import CONSTANTS from 'src/common/res/constants';
const {COLOR} = CONSTANTS;
import {numberFormat} from 'toktokwallet/helper';

const CustomAmountInput = (props: PropsType): React$Node => {
  const {
    style,
    placeholder,
    placeholderTextColor = COLOR.DARK,
    value,
    onChangeText,
    onSubmitEditing,
    returnKeyType = 'done',
    maxLength = 6,
    editable = true,
    errorMessage = '',
    label = '',
    onBlur,
  } = props;
  const [isFocus, setIsFocus] = useState(false);

  const changeAmount = val => {
    const num = val.replace(/[^0-9.]/g, '');
    const checkFormat = /^(\d*[.]?[0-9]{0,2})$/.test(num);
    if (!checkFormat) {
      return;
    }
    let decimalValueArray = num.split('.');
    if (decimalValueArray[0].length > maxLength) {
      return;
    }
    let amount = num[0] === '.' ? '0.' : num;
    onChangeText(amount);
  };

  return (
    <>
      {label !== '' && <Label>{label}</Label>}
      <Container errorMessage={errorMessage}>
        <CountryCodeContainer>
          <CountryCodeText>₱</CountryCodeText>
        </CountryCodeContainer>
        <Input
          style={style}
          value={value}
          onChangeText={changeAmount}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          returnKeyType={returnKeyType}
          editable={editable}
          maxLength={maxLength}
          keyboardType={'numeric'}
          onBlur={() => {
            if (onBlur) {
              onBlur();
            }
            setIsFocus(false);
          }}
          onFocus={() => setIsFocus(true)}
          onSubmitEditing={onSubmitEditing}
          caretHidden={!isFocus}
          focused={!isFocus && value !== ''}
        />
        {!isFocus && value !== '' && (
          <PlaceholderContainer>
            <PlaceholderText>{value ? numberFormat(value) : '0.00'}</PlaceholderText>
          </PlaceholderContainer>
        )}
      </Container>
      {errorMessage !== '' && <Error>{errorMessage}</Error>}
    </>
  );
};
export default CustomAmountInput;
