/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {Text, TouchableOpacity} from 'react-native';
import {moderateScale} from 'toktokwallet/helper';
import FIcon5 from 'react-native-vector-icons/FontAwesome5';

import CONSTANTS from 'src/common/res/constants';
import {Platform} from 'react-native/Libraries/ReactPrivate/ReactNativePrivateInterface';
const {FONT_FAMILY: FONT, FONT_SIZE, SIZE} = CONSTANTS;

export const Label: ComponentType<any> = styled(Text).attrs(props => ({
  ...props,
}))`
  color: ${props => props.theme.color.darkgray};
  font-size: ${FONT_SIZE.S}px;
  font-family: ${FONT.BOLD};
  margin-bottom: ${moderateScale(5)}px;
`;

export const SelectionInput: ComponentType<any> = styled(TouchableOpacity).attrs(props => ({
  ...props,
}))`
  height: ${SIZE.FORM_HEIGHT}px;
  border-radius: ${moderateScale(5)}px;
  background-color: #fff;
  margin-top: ${moderateScale(5)}px;
  font-size: ${FONT_SIZE.M}px;
  padding-horizontal: ${moderateScale(15)}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  ${Platform.OS === 'android' ? 'elevation: 3' : 'box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.25)'};
  ${({hasError, theme}) =>
    hasError &&
    `
     border-width: 1px;
     border-color: ${theme.color.red};
   `}
`;
export const Placeholder: ComponentType<any> = styled(Text).attrs(props => ({
  ...props,
}))`
  flex: 1;
  font-size: ${FONT_SIZE.M}px;
  color: ${props => (props.hasValue ? props.theme.color.black : props.theme.color.gray)};
`;

export const ArrowDown: ComponentType<any> = styled(FIcon5).attrs(props => ({
  ...props,
  name: 'chevron-down',
  size: moderateScale(16),
  color: props.theme.color.orange,
}))``;

export const ErrorText: ComponentType<any> = styled.Text`
  color: ${props => props.theme.color.red};
  font-size: ${FONT_SIZE.S}px;
  margin-top: 5px;
`;
