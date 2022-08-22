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
    type = 'TPIN',
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
          <Text>Do not share your {type} with anyone.</Text>
        </MessageContainer>
        <CircleIndicator pinCode={pinCode} showPin={showPin} error={!!errorMessage} numberOfBox={numberOfBox} />
        {!!errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <NumPad setPinCode={setPinCode} pinCode={pinCode} numberOfBox={numberOfBox} />
        <ForgotButton onPress={onPressForgotPin}>
          <ForgotText>Forgot {type}?</ForgotText>
        </ForgotButton>
      </ContentContainer>
    </BackgroundImage>
  );
};

export default EnterPinValidator;
