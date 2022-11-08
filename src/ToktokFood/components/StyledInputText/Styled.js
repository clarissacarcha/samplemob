/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {TextInput} from 'react-native';

export const Input: ComponentType<any> = styled(TextInput).attrs(props => ({
  ...props,
  placeholderTextColor: props.theme.color.gray,
}))`
  height: 40px;
  flex: 1;
  background-color: ${props => props.theme.textInput.container};
  border-width: 1px;
  border-color: ${props => props.theme.textInput.container};
  border-radius: 5px;
  padding-horizontal: 20px;
`;
