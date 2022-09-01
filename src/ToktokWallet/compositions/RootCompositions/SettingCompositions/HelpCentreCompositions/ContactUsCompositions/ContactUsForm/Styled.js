/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {moderateScale} from 'toktokwallet/helper';
import {CustomTextInput} from 'toktokwallet/components';

export const Container: ComponentType<any> = styled.View`
  padding-bottom: ${moderateScale(15)}px;
`;
export const InputSubject: ComponentType<any> = styled(CustomTextInput).attrs(props => ({
  ...props,
  label: 'Subject',
  keyboardType: 'default',
  returnKeyType: 'done',
}))``;
export const InputMessage: ComponentType<any> = styled(CustomTextInput).attrs(props => ({
  ...props,
  label: 'Message',
  multiline: true,
  textAlignVertical: 'top',
}))`
  height: ${moderateScale(120)}px;
`;
