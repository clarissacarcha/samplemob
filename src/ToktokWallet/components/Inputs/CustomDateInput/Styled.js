/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {Image, TouchableOpacity, Text} from 'react-native';
import {moderateScale} from 'toktokwallet/helper';
import {calendar_icon} from 'toktokwallet/assets';

import CONSTANTS from 'src/common/res/constants';
const {FONT_SIZE, SIZE, FONT_FAMILY: FONT} = CONSTANTS;

export const Button: ComponentType<any> = styled(TouchableOpacity).attrs(props => ({
  ...props,
}))`
  height: ${SIZE.FORM_HEIGHT}px;
  border-radius: 5px;
  background-color: #f7f7fa;
  margin-top: 5px;
  padding-horizontal: ${moderateScale(15)}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  ${({hasError, theme}) =>
    hasError &&
    `
     border-width: 1px;
     border-color: ${theme.color.red};
   `}
`;

export const ButtonText: ComponentType<any> = styled(Text).attrs(props => ({
  ...props,
}))`
  flex: 1;
  ${({selectedValue, theme}) => !selectedValue && `color: ${theme.color.gray}`}
`;

export const ButtonImage: ComponentType<any> = styled(Image).attrs(props => ({
  ...props,
  source: calendar_icon,
}))`
  width: ${moderateScale(20)}px;
  height: ${moderateScale(20)}px;
`;

export const ErrorText: ComponentType<any> = styled.Text`
  color: ${props => props.theme.color.red};
  font-size: ${FONT_SIZE.S}px;
  margin-top: 5px;
`;

export const Label: ComponentType<any> = styled(Text).attrs(props => ({
  ...props,
}))`
  color: ${props => props.theme.color.darkgray};
  font-size: ${FONT_SIZE.S}px;
  font-family: ${FONT.BOLD};
  margin-bottom: ${moderateScale(5)}px;
`;
