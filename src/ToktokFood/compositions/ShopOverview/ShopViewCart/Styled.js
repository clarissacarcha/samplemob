/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';

import StyledButton from 'toktokfood/components/StyledButton';
import StyledText from 'toktokfood/components/StyledText';

export const Container: ComponentType<any> = styled.View`
  /* align-items: center; */
  background-color: ${props => props.theme.color.white};
  border-width: 2px;
  border-bottom-width: 0;
  border-top-right-radius: 18px;
  border-top-left-radius: 18px;
  border-color: ${props => props.theme.color.orange};
  margin-horizontal: -2px;
  padding: 20px;
`;

export const AmountContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const AmountText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  mode: 'semibold',
  fontSize: 18,
  color: props.theme.color.orange,
}))``;

export const ViewCart: ComponentType<any> = styled(StyledButton).attrs(props => ({
  ...props,
  buttonText: 'View Cart',
}))`
  margin-top: 20px;
`;
