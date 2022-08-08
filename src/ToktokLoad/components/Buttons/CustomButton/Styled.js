/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {Text, TouchableOpacity, Platform} from 'react-native';
import {moderateScale} from 'toktokload/helper';

import CONSTANTS from 'src/common/res/constants';
const {FONT_FAMILY: FONT, FONT_SIZE} = CONSTANTS;

export const Container: ComponentType<any> = styled.View`
  ${({hasShadow}) =>
    hasShadow &&
    `
     padding-horizontal: ${moderateScale(32)};
     padding-vertical: ${moderateScale(16)};
     background: #FFFFFF;
     box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);
   `}
`;

export const Button: ComponentType<any> = styled(TouchableOpacity).attrs(props => ({
  ...props,
}))`
  background-color: ${props =>
    props.btnColor ? props.btnColor : props.disabled ? '#F6841F70' : props.theme.color.orange};
  height: ${moderateScale(40)}px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const ButtonText: ComponentType<any> = styled(Text).attrs(props => ({
  ...props,
}))`
  font-family: ${FONT.BOLD};
  font-size: ${FONT_SIZE.L};
  color: ${props => (props.labelColor ? props.labelColor : props.theme.color.white)};
  margin-bottom: ${Platform.OS === 'android' ? moderateScale(5) : 0};
`;
