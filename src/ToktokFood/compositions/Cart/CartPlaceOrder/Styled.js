/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';
import StyledButton from 'toktokfood/components/StyledButton';

export const Container: ComponentType<any> = styled.View`
  padding: 20px;
  border-top-width: 3px;
  border-top-color: ${props => props.theme.divider.active};
  shadow-color: ${props => props.theme.divider.active};
  shadow-offset: {width: 0, height: 3};
  shadow-opacity: 0.8;
  shadow-radius: 3;
  elevation: 1;
`;

export const Row: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const LoaderContainer: ComponentType<any> = styled.View`
  /* position: absolute; */
  left: -10px;
  margin-top: -10px;
`;

export const AmountText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  color: props.theme.color.orange,
  fontSize: 18,
  mode: 'semibold',
}))``;

export const ClosedShopText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
}))`
  text-align: center;
  margin-bottom: 20px;
`;

export const Button: ComponentType<any> = styled(StyledButton).attrs(props => ({
  ...props,
}))`
  padding-horizontal: 30px;
  height: 45px;
`;
