/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {Text, TextInput, View} from 'react-native';
import {moderateScale} from 'toktokwallet/helper';

import CONSTANTS from 'src/common/res/constants';
const {FONT_SIZE, FONT_FAMILY: FONT, SIZE} = CONSTANTS;

export const Label: ComponentType<any> = styled(Text).attrs(props => ({
  ...props,
}))`
  color: ${props => props.theme.color.darkgray};
  font-size: ${FONT_SIZE.S}px;
  font-family: ${FONT.BOLD};
  margin-bottom: ${moderateScale(5)}px;
`;
export const Container: ComponentType<any> = styled(View).attrs(props => ({
  ...props,
}))`
  height: ${SIZE.FORM_HEIGHT}px;
  width: 100%;
  background-color: #f7f7fa;
  margin-top: 5px;
  border-radius: 5px;
  flex-direction: row;
  font-size: ${FONT_SIZE.M}px;
  ${({errorMessage, theme}) =>
    errorMessage !== '' &&
    `
      border-color: ${theme.color.red};
      border-width: 1;
    `}
`;

export const CountryCodeContainer: ComponentType<any> = styled(View).attrs(props => ({
  ...props,
}))`
  border-right-width: 1px;
  border-right-color: #cccccc;
  justify-content: center;
`;
export const CountryCodeText: ComponentType<any> = styled(Text).attrs(props => ({
  ...props,
}))`
  font-size: ${FONT_SIZE.M}px;
  align-self: center;
  padding-horizontal: ${moderateScale(13)}px;
`;

export const Input: ComponentType<any> = styled(TextInput).attrs(props => ({
  ...props,
}))`
  margin-top: 1px;
  height: 100%;
  width: 100%;
  margin-left: ${moderateScale(15)}px;
`;

export const Error: ComponentType<any> = styled(Text).attrs(props => ({
  ...props,
}))`
  color: ${props => props.theme.color.red};
  font-size: ${FONT_SIZE.S}px;
  margin-top: 5px;
`;
