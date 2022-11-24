/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {
  Container,
  Error,
  Label,
  Input,
  CountryCodeText,
  CountryCodeContainer,
  ContactsButton,
  ContactIcon,
  ContentContainer,
  HeartIcon,
  HeartButton,
  Recipient,
} from './Styled';
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
    onPressFavorite,
    isFavorite = false,
    name,
    hasContacts = false,
    hasFavorite = false,
  } = props;

  const onPressContact = () => {};

  return (
    <>
      {label !== '' && (
        <Label>
          {label}
          <Recipient>{name}</Recipient>
        </Label>
      )}
      <ContentContainer>
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
          {hasFavorite && (
            <HeartButton editable={editable} onPress={onPressFavorite}>
              <HeartIcon isFavorite={isFavorite} />
            </HeartButton>
          )}
        </Container>
        {hasContacts && (
          <ContactsButton editable={editable} onPress={onPressContact}>
            <ContactIcon />
          </ContactsButton>
        )}
      </ContentContainer>
      {errorMessage !== '' && <Error>{errorMessage}</Error>}
    </>
  );
};
export default MobileNumberInput;
