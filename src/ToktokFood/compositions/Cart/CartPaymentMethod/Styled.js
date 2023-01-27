/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {Animated} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import StyledButton from 'toktokfood/components/StyledButton';
import StyledText from 'toktokfood/components/StyledText';

export const Container: ComponentType<any> = styled(Animated.View)`
  padding: 20px;
`;

export const Column: ComponentType<any> = styled.View``;

export const LimitContainer: ComponentType<any> = styled.View`
  flex: 0.7;
  align-items: flex-end;
  justify-content: center;
`;

export const Row: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ErrorContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

export const Image: ComponentType<any> = styled.Image`
  width: ${props => (props.selected === 'toktokwallet' ? 30 : 30)}px;
  height: ${props => (props.selected === 'toktokwallet' ? 25 : 15)}px;
  resize-mode: cover;
  margin-right: 10px;
`;

export const PaymentSelectionContainer: ComponentType<any> = styled.View`
  padding: 20px;
`;

export const Icon: ComponentType<any> = styled(AntDesign).attrs(props => ({
  ...props,
}))`
  margin-left: ${props => props.marginLeft || 0}px;
  margin-right: ${props => props.marginRight || 0}px;
`;

export const CashInButton: ComponentType<any> = styled(StyledButton).attrs(props => ({
  ...props,
  height: 25,
  type: 'secondary',
  textStyle: {
    weight: '400',
    fontSize: 11,
  },
  buttonText: 'Cash In',
}))`
  padding-horizontal: 10px;
`;

export const CreateAccountText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  fontSize: 11,
  color: props.theme.color.orange,
}))`
  text-align: center;
  text-decoration-line: underline;
`;

export const LimitText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  fontSize: 11,
  color: props.theme.color.gray,
}))`
  text-align: center;
`;
