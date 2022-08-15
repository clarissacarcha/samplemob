/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {Text, TextInput} from 'react-native';
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

export const Input: ComponentType<any> = styled(TextInput).attrs(props => ({
  ...props,
}))`
  height: ${SIZE.FORM_HEIGHT}px;
  border-radius: 5px;
  background-color: #f7f7fa;
  margin-top: 5px;
  font-size: ${FONT_SIZE.M}px;
  padding-horizontal: ${moderateScale(15)}px;
  ${({errorMessage, theme}) =>
    errorMessage !== '' &&
    `
       border-color: ${theme.color.red};
       border-width: 1;
     `}
`;

export const Error: ComponentType<any> = styled(Text).attrs(props => ({
  ...props,
}))`
  color: ${props => props.theme.color.red};
  font-size: ${FONT_SIZE.S}px;
  margin-top: 5px;
`;
