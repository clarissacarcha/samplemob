/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';
import StyledButton from 'toktokfood/components/StyledButton';
import {moderateScale} from 'toktokfood/helper/scale';

export const Container: ComponentType<any> = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

export const AnimationContainer: ComponentType<any> = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const AnimationText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  mode: props.title ? 'bold' : 'regular',
  fontSize: props.title ? 18 : 13,
  color: props.title ? props.theme.color.orange : props.theme.color.black,
}))`
  margin-bottom: ${props => (props.title ? moderateScale(10) : 0)};
`;

export const BottomContainer: ComponentType<any> = styled.View`
  background-color: #ffffff;
  border-width: 3px;
  border-left-width: 1px;
  border-right-width: 1px;
  border-bottom-width: 0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  margin-left: -1px;
  margin-right: -1px;
  border-left-color: #ffffff;
  border-right-color: #ffffff;
  border-top-color: ${props => props.theme.color.orange};
`;

export const ButtonContainer: ComponentType<any> = styled.View`
  padding: 20px;
`;

export const AmountContainer: ComponentType<any> = styled.View`
  padding-top: 20px;
`;

export const Button: ComponentType<any> = styled(StyledButton).attrs(props => ({
  ...props,
}))`
  margin-bottom: 15px;
`;
