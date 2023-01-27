/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import StyledText from 'toktokfood/components/StyledText';
import StyledInputText from 'toktokfood/components/StyledInputText';

export const Container: ComponentType<any> = styled.View`
  padding: 20px;
  flex: 1;
`;

export const InputContainer: ComponentType<any> = styled.View`
  height: 90px;
  background-color: ${props => props.theme.textInput.container};
  /* background-color: ${props => props.theme.color.orange}; */
  justify-content: center;
  flex: 1;
  width: 100%;
  align-items: center;
  border-radius: 5px;
`;

export const Title: ComponentType<any> = styled(StyledText).attrs(props => ({
  ...props,
  mode: 'semibold',
  color: props.theme.color.darkgray,
}))`
  margin-bottom: 20px;
`;

export const Input: ComponentType<any> = styled(StyledInputText).attrs(props => ({
  ...props,
  placeholder: 'e.g items are fragile',
  multiline: true,
  numberOfLines: 4,
  maxLength: 320,
}))`
  flex: 0.8;
  width: 93%;
  padding-horizontal: 7px;
`;
