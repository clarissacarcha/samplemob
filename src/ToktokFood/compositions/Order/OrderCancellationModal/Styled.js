/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {Modal} from 'toktokfood/components/Modal';
import StyledText from 'toktokfood/components/StyledText';

export const Container: ComponentType<any> = styled.View`
  margin-top: -10px;
`;

export const ButtonContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  margin-top: 20px;
`;

export const Column: ComponentType<any> = styled.View`
  flex: 1;
`;

export const CancelModal: ComponentType<any> = styled(Modal).attrs(props => ({
  ...props,
}))``;

export const ErrorText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  color: props.theme.color.red,
}))`
  margin-top: 20px;
`;
