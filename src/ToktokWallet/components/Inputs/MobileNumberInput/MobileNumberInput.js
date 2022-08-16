/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {Container, Error, Label, Input, CountryCodeText, CountryCodeContainer} from './Styled';
import CONSTANTS from 'src/common/res/constants';
const {COLOR} = CONSTANTS;

const MobileNumberInput = (props: PropsType): React$Node => {
  const {
    style,
    placeholder,
    placeholderTextColor = COLOR.DARK,
    value,
    onChangeText,
    onSubmitEditing,
    returnKeyType = 'done',
    maxLength = 10,
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
      <Container errorMessage={errorMessage}>
        <CountryCodeContainer>
          <CountryCodeText>+63</CountryCodeText>
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
          onBlur={onBlur}
          onSubmitEditing={onSubmitEditing}
          onFocus={onFocus}
          caretHidden={caretHidden}
        />
      </Container>

      {errorMessage !== '' && <Error>{errorMessage}</Error>}
    </>
  );
};
export default MobileNumberInput;
