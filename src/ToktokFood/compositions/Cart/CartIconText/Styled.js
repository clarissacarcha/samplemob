/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';

export const Container: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: ${props => (props.id === 1 ? 'center' : 'flex-start')};
  margin-bottom: 20px;
`;

export const Column: ComponentType<any> = styled.View``;

export const Image: ComponentType<any> = styled.Image`
  resize-mode: contain;
  height: 20px;
  width: 20px;
  margin-right: 15px;
  top: ${props => (props.id === 1 ? 0 : 2)}px;
`;

export const Title: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  mode: 'semibold',
  fontSize: 13,
}))`
  margin-bottom: 3px;
`;

export const Text: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  fontSize: 11,
  color: props.landmark ? props.theme.color.gray : props.theme.color.darkgray,
}))``;

export const NameText: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  fontSize: 11,
}))`
  margin-top: 3px;
`;
