/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';
import StyledButton from 'toktokfood/components/StyledButton';

export const Container: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

export const RadioContainer: ComponentType<any> = styled.View`
  padding: 20px;
`;

export const Text: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
}))`
  margin-left: 7px;
  flex: 1;
`;

export const PickupText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  fontSize: 11,
  color: props.theme.color.gray,
}))``;

export const Button: ComponentType<any> = styled(StyledButton).attrs(props => ({
  ...props,
}))`
  margin-top: 20px;
`;
