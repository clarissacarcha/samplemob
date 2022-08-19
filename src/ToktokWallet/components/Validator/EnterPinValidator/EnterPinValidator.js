/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {
  BackgroundImage,
  BackContainer,
  Back,
  ContentContainer,
  Logo,
  Label,
  MessageContainer,
  Icon,
  ForgotButton,
  ForgotText,
  NumPadContainer,
  ErrorMessage,
} from './Styled';
import {Text} from 'react-native';
import {CircleIndicator, NumPad} from 'toktokwallet/components';

const EnterPinValidator = (props: PropsType): React$Node => {
  const {
    label = 'Enter TPIN',
    hasBack = true,
    setPinCode,
    pinCode,
    showPin,
    errorMessage,
    onPressForgotPin,
    numberOfBox,
  } = props;
  return (
    <BackgroundImage>
      {hasBack && (
        <BackContainer>
          <Back />
        </BackContainer>
      )}
      <ContentContainer>
        <Logo />
        <Label>{label}</Label>
        <MessageContainer>
          <Icon />
          <Text>Do not share your TPIN with anyone.</Text>
        </MessageContainer>
        <CircleIndicator pinCode={pinCode} showPin={showPin} error={!!errorMessage} numberOfBox={numberOfBox} />
        {!!errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <NumPadContainer>
          <NumPad setPinCode={setPinCode} pinCode={pinCode} />
        </NumPadContainer>
        <ForgotButton onPress={onPressForgotPin}>
          <ForgotText>Forgot TPIN?</ForgotText>
        </ForgotButton>
      </ContentContainer>
    </BackgroundImage>
  );
};

export default EnterPinValidator;
