/**
 * @format
 * @flow
 */

import React from 'react';

import type {PropsType} from './types';
import {
  ButtonContainer,
  Container,
  ContentContainer,
  ShowTpinButton,
  ShowTpinText,
  Label,
  Logo,
  LogoContainer,
  Message,
} from './Styled';
import {NumberInputBox, OrangeButton} from 'toktokwallet/components';

const EnterNewConfirmPinValidator = (props: PropsType): React$Node => {
  const {
    label,
    type,
    pinCode,
    errorMessage,
    onConfirm,
    showPin,
    setShowPin,
    onChangeText,
    onNumPress,
    numberOfBox = 6,
  } = props;

  return (
    <Container>
      <ContentContainer>
        <LogoContainer>
          <Logo />
        </LogoContainer>
        <Label>{label}</Label>
        <Message>Ka-toktok, do not forget your {type}. Keep it to yourself and do not share this with anyone.</Message>
        <NumberInputBox
          pinCode={pinCode}
          showPin={showPin}
          errorMessage={errorMessage}
          onChangeText={onChangeText}
          onNumPress={onNumPress}
          numberOfBox={numberOfBox}
        />
        <ShowTpinButton onPress={() => setShowPin(!showPin)}>
          <ShowTpinText>{showPin ? `Hide ${type}` : `Show ${type}`}</ShowTpinText>
        </ShowTpinButton>
      </ContentContainer>
      <ButtonContainer>
        <OrangeButton label="Confirm" onPress={onConfirm} />
      </ButtonContainer>
    </Container>
  );
};

export default EnterNewConfirmPinValidator;
