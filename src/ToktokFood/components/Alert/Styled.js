/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import StyledButton from 'toktokfood/components/StyledButton';

export const Container: ComponentType<any> = styled.View`
  align-items: center;
  justify-content: center;
  padding-horizontal: 10px;
  padding-bottom: 10px;
`;

export const ButtonContainer: ComponentType<any> = styled.View`
  /* align-items: center; */
  /* justify-content: space-evenly; */
  flex-direction: row;
  /* margin-vertical: 20px; */
  margin-top: 10px;
  /* flex: 1; */
`;

export const Column: ComponentType<any> = styled.View`
  flex: 1;
`;

export const AlertButton: ComponentType<any> = styled(StyledButton).attrs(props => ({
  ...props,
}))``;

export const TitleContainer: ComponentType<any> = styled.View`
  margin-bottom: 20px;
`;
