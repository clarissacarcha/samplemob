/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {Text, TextInput, Image} from 'react-native';
import {moderateScale} from 'toktokwallet/helper';
import {info_icon} from 'toktokwallet/assets';

import CONSTANTS from 'src/common/res/constants';
const {FONT_SIZE, FONT_FAMILY: FONT, SIZE} = CONSTANTS;

export const Label: ComponentType<any> = styled(Text).attrs(props => ({
  ...props,
}))`
  color: ${props => props.theme.color.darkgray};
  font-size: ${FONT_SIZE.M}px;
  font-family: ${FONT.BOLD};
`;

export const Input: ComponentType<any> = styled(TextInput).attrs(props => ({
  ...props,
}))`
  ${({multiline}) =>
    multiline
      ? `height: ${moderateScale(90)}px; padding-top: ${moderateScale(15)}px; padding-bottom: ${moderateScale(15)}px;`
      : `height: ${SIZE.FORM_HEIGHT}px;`}
  border-radius: ${moderateScale(10)}px;
  background-color: #f7f7fa;
  margin-top: ${moderateScale(5)}px;
  font-size: ${FONT_SIZE.M}px;
  padding-horizontal: ${moderateScale(15)}px;
  ${({hasError, theme}) =>
    hasError &&
    `
      border-color: ${theme.color.red};
      border-width: ${moderateScale(1)}px;
    `}
`;

export const Error: ComponentType<any> = styled(Text).attrs(props => ({
  ...props,
}))`
  color: ${props => props.theme.color.red};
  font-size: ${FONT_SIZE.S}px;
  margin-top: ${moderateScale(5)}px;
`;

export const InfoContainer: ComponentType<any> = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${moderateScale(5)}px;
`;

export const InfoIcon: ComponentType<any> = styled(Image).attrs(props => ({
  ...props,
  source: info_icon,
}))`
  height: ${moderateScale(12)}px;
  width: ${moderateScale(12)}px;
  resize-mode: contain;
  margin-left: ${moderateScale(5)}px;
`;
