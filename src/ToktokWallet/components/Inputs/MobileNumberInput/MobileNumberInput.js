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
import {useNavigation} from '@react-navigation/native';
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
    disableFavorite = true,
  } = props;

  const navigation = useNavigation();

  const onSelectContact = number => {
    onChangeText(number.replace('0', ''));
  };

  const onPressContact = () => {
    navigation.navigate('ToktokLoadContacts', {onSelectContact});
  };

  const onChangeTextProcess = val => {
    let mobile = val.replace(/[^0-9]/g, '');
    if (mobile.length > 10) {
      return;
    }
    onChangeText(val[0] !== '9' && val !== '' ? '9' : mobile);
  };

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
            onChangeText={val => onChangeTextProcess(val)}
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
            <HeartButton editable={editable} onPress={onPressFavorite} disableFavorite={disableFavorite}>
              <HeartIcon isFavorite={isFavorite} editable={editable} disableFavorite={disableFavorite} />
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
