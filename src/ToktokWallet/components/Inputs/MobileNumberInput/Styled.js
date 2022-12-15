/**
 * @flow
 */

import type {ComponentType} from 'react';
import styled from 'styled-components/native';
import {Text, TextInput, View, TouchableOpacity, Image} from 'react-native';
import {moderateScale} from 'toktokwallet/helper';

import CONSTANTS from 'src/common/res/constants';
const {FONT_SIZE, FONT_FAMILY: FONT, SIZE, COLOR} = CONSTANTS;
import {contact_icon} from 'toktokload/assets/icons';
import FIcon5 from 'react-native-vector-icons/FontAwesome';

export const Label: ComponentType<any> = styled(Text).attrs(props => ({
  ...props,
}))`
  color: ${props => props.theme.color.darkgray};
  font-size: ${FONT_SIZE.M}px;
  font-family: ${FONT.BOLD};
  margin-bottom: ${moderateScale(5)}px;
`;
export const Recipient: ComponentType<any> = styled(Text).attrs(props => ({
  ...props,
}))`
  color: ${props => props.theme.color.orange};
  font-size: ${FONT_SIZE.M}px;
  font-family: ${FONT.BOLD};
  margin-bottom: ${moderateScale(5)}px;
`;
export const Container: ComponentType<any> = styled(View).attrs(props => ({
  ...props,
}))`
  height: ${SIZE.FORM_HEIGHT}px;
  flex: 1;
  background-color: #f7f7fa;
  margin-top: 5px;
  border-radius: 5px;
  flex-direction: row;
  ${({errorMessage, theme}) =>
    errorMessage !== '' &&
    `
       border-color: ${theme.color.red};
       border-width: 1px;
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
  flex: 1;
  margin-horizontal: ${moderateScale(15)}px;
  font-size: ${FONT_SIZE.M}px;
`;

export const Error: ComponentType<any> = styled(Text).attrs(props => ({
  ...props,
}))`
  color: ${props => props.theme.color.red};
  font-size: ${FONT_SIZE.S}px;
`;

export const ContactsButton: ComponentType<any> = styled(TouchableOpacity).attrs(props => ({
  ...props,
  disabled: !props.editable,
}))`
  background-color: ${props => (props.editable ? '#f6841f' : '#DADADA')};
  height: ${moderateScale(SIZE.FORM_HEIGHT - 2)}px;
  width: ${moderateScale(SIZE.FORM_HEIGHT)}px;
  align-items: center;
  justify-content: center;
  border-radius: ${moderateScale(5)}px;
  margin-left: ${moderateScale(10)}px;
  margin-top: ${moderateScale(5)}px;
`;

export const ContactIcon: ComponentType<any> = styled(Image).attrs(props => ({
  ...props,
  source: contact_icon,
  resizeMode: 'contain',
}))`
  width: ${moderateScale(25)}px;
  height: ${moderateScale(25)}px;
  resize-mode: contain;
`;

export const ContentContainer: ComponentType<any> = styled(View).attrs(props => ({
  ...props,
}))`
  flex-direction: row;
`;

export const HeartButton: ComponentType<any> = styled(TouchableOpacity).attrs(props => ({
  ...props,
  disabled: !props.editable || props.disableFavorite,
}))`
  align-items: center;
  justify-content: center;
  border-radius: ${moderateScale(5)}px;
  margin-horizontal: ${moderateScale(15)}px;
`;

export const HeartIcon: ComponentType<any> = styled(FIcon5).attrs(props => ({
  ...props,
  name: props.isFavorite ? 'heart' : 'heart-o',
  color: props.editable && !props.disableFavorite ? COLOR.ORANGE : '#DADADA',
  size: moderateScale(20),
}))``;
