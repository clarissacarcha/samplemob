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
    maxLength = 10,
    editable = true,
    errorMessage = '',
    label = '',
  } = props;
  const [isFocus, setIsFocus] = useState(false);

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
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          returnKeyType={returnKeyType}
          editable={editable}
          maxLength={maxLength}
          keyboardType={'numeric'}
          onBlur={() => {
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
